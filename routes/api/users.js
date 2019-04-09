const router = require('express').Router();
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const express = require('express');

const Query = require('./../../Query');

router.get('/', (req, res)=>{
    res.send("Here is supossed to return users")
});

router.post('/login', (req, res)=>{
    const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g
    const user = req.body.user;
    const pass = req.body.password;
    if(emailRegex.test(user)){
        // TODO: is an email check for that email in the DB and the pass
    }
    else {
        new Query('person').select('username', 'password')
        .where(Query.Comparator.and(
            new Query.Comparator().equalTo('username', `'${user}'`),
            new Query.Comparator().equalTo('password', `'${pass}'`)
            ))
        .run()
        .then(result=>{
            if(result.rows.length==1){
                req.send('Success');
            }
            else{
                req.send('Fail');
            }
        }).catch(error=>{
            console.log(error);
        })

    }

    
});

router.get('/emailExists', (req, res)=>{

})

router.get('/userExists', (req, res)=>{

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
            return new Query('emails').select('email')
                .where(new Query.Comparator().equalTo('email', `'${email}'`))
                .run()
        }
        else{
            console.log("User already exists")
            throw conflict("User already exists")
        }
        
    })
    .then(result=>{
        if(result.rows.length==0){
            return bcrypt.hash(password, 10);
        }
        else{
            console.log("email already exists")
            throw conflict("email already exists")
        }
    })
    .then((hash)=>{
        return new Query('person')
        .insert(true, 'username', 'password', 'first_name', 'last_name', 'profile_img', 'verified')
        .insertValues(user, hash, fName, lName, img, verified)
        .run(false, {id : {type: oracledb.NUMBER, dir: oracledb.BIND_OUT } })
    })
    .then(result=>{
        return new Query('emails').insert(false).insertValues(email, result.outBinds.id[0])
        .run(true)            
    })
    .then(result=>{
        console.log(result);
        res.json();
    })
    .catch(err=>{
        if(!err.status){
            console.log(err);
            return next(internalServerError("There was a problem, please try again in a moment."))
        }
        else{
            return next(err);
        }
    })

})

function conflict(message, errorCode = 409) {
    let err = new Error(message || 'The requested resource couldn\'t be found');
    err.status = errorCode;
    return err;
};

function internalServerError(message, errorCode = 500){

    let err = new Error(message || 'There was a problem, please try again in a moment');
    err.status = errorCode;
    return err;
}

module.exports = router;