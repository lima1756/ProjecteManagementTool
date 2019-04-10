const router = require('express').Router();
const bcrypt = require('bcryptjs');
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken');
const jwtControl = require('../../libraries/jwtControl')
const ErrorManager = require('../../libraries/ErrorManager');
const DBController =  require('../../libraries/controllers/DBController')

const Query = require('../../libraries/Query');


const secret = require('../../config/secret');

const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g

router.post('/login', (req, res)=>{
    const user = req.body.user;
    const password = req.body.password;
    let userId = null;

    let searchUser = new Query('person').select('id', 'password')

    if(emailRegex.test(user)){
        searchUser = searchUser.join('email', new Query.Comparator().equalTo('id', 'person_id'))
        .where(new Query.Comparator().equalTo('email', `'${user}'`))
        .run()
    }
    else {
        searchUser = searchUser.where(new Query.Comparator().equalTo('username', `'${user}'`))
        .run()
    }
    searchUser.then(result=>{
        if(result.rows.length==1){
            userId = result.rows[0].ID;
            return bcrypt.compare(password, result.rows[0].PASSWORD);
        }
        else{
            throw new ErrorManager.BadRequestError("The data received is incorrect, please verify your user/email and password")
        }
    })
    .then(equal => {
        if(equal){
            jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (3600 * 8760),
                id:userId
            }, 
            secret, 
            (err, token)=>{
                if(err)
                    throw new ErrorManager.InternalServerError("There was a problem, please try again in a moment.")
                res.json({
                    success: true,
                    token: token
                })
            })
        } else {
            throw new ErrorManager.BadRequestError("The data received is incorrect, please verify your user/email and password")
        }
    })
    .catch(err=>{
        if(!(err instanceof ErrorManager.MainError)){
            err.msg = err.message;
            return next(new ErrorManager.DataBaseError("There was a problem, please try again in a moment.", err))
        }
        else{
            return next(err);
        }
    });
});

router.get('/emailExists', (req, res, next)=>{
    const email = req.body.email;
    new Query('email')
        .select('email')
        .where(new Query.Comparator().equalTo('email', `'${email}'`))
    .run()
    .then(result=>{
        if(result.rows.length>0){
            res.json({
                exists:true
            })
        }
        else{
            res.json({
                exists:false
            })
        }
    })
    .catch(err=>{
        err.msg = err.message;
        return new ErrorManager.DataBaseError("There was a problem, please try again in a moment.", err);
    });
})

router.get('/userExists', (req, res)=>{
    const user = req.body.user;
    new Query('person')
        .select('username')
        .where(new Query.Comparator().equalTo('username', `'${user}'`))
    .run()
    .then(result=>{
        if(result.rows.length>0){
            res.json({
                exists:true
            })
        }
        else{
            res.json({
                exists:false
            })
        }
    })
    .catch(err=>{
        err.msg = err.message;
        return new ErrorManager.DataBaseError("There was a problem, please try again in a moment.", err);
    });
})

router.post('/signup', (req, res, next)=>{
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    const fName = req.body.fName;
    const lName = req.body.lName;
    const img = '';
    const verified = 1;

    new Query('person').select('username')
        .where(new Query.Comparator().equalTo('username', `'${user}'`))
        .run()
    .then(result=>{
        if(result.rows.length==0){
            return new Query('email').select('email')
                .where(new Query.Comparator().equalTo('email', `'${email}'`))
                .run()
        }
        else{
            console.log("User already exists")
            throw new ErrorManager.BadRequestError("User already exists")
        }
        
    })
    .then(result=>{
        if(result.rows.length==0){
            return bcrypt.hash(password, 10);
            
        }
        else{
            console.log("email already exists")
            throw new ErrorManager.BadRequestError("email already exists")
        }
    })
    .then(hash => {
        return new Query('person')
                .insert(true, 'username', 'password', 'first_name', 'last_name', 'profile_img', 'verified')
                .insertValues(user, hash, fName, lName, img, verified)
                .run(false, {id : {type: oracledb.NUMBER, dir: oracledb.BIND_OUT } })
    })
    .then(result=>{
        return new Query('email').insert(false).insertValues(email, 1, result.outBinds.id[0])
        .run()            
    })
    .then(result=>{
        res.json({
            success:true,
            message:"successfull sign up"
        });
    })
    .catch(err=>{
        if(!err instanceof ErrorManager.MainError){
            err.msg = err.message;
            return next(new ErrorManager.DataBaseError("There was a problem, please try again in a moment.", err))
        }
        else{
            return next(err);
        }
    })

})

router.get('/searchUser', jwtControl, (req, res, next)=>{
    const user = req.body.user;
    
    let searchUser = 
        new Query('person').select('username', 'first_name', 'profile_img', 'email', 'id')
        .join('email', new Query.Comparator().equalTo('id', 'person_id'))

    if(emailRegex.test(user)){
        searchUser = searchUser.where(Query.Comparator.and(
            new Query.Comparator().equalTo('email', `'${user}'`),
            new Query.Comparator().equalTo('main', `1`))
        )
        .run(true)
    }
    else {
        searchUser = searchUser.where(Query.Comparator.and(
            new Query.Comparator().like('username', `'%${user}%'`),
            new Query.Comparator().equalTo('main', `1`))
        )
        .run()
    }

    searchUser
    .then(result=>{
        res.json(DBController.oracleToSimpleJson(result));
    })
    .catch(err=>{
        if(!(err instanceof ErrorManager.MainError)){
            err.msg = err.message;
            return next(new ErrorManager.DataBaseError("There was a problem, please try again in a moment.", err))
        }
        else{
            return next(err);
        }
    });
})

module.exports = router;