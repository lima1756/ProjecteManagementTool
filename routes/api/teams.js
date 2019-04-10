const router = require('express').Router();
const jwtControl = require('../../libraries/jwtControl')
const Query = require('../../libraries/Query');
const ErrorManager = require('../../libraries/ErrorManager');
const DBController =  require('../../libraries/controllers/DBController')
const oracledb = require('oracledb');

router.get('/', jwtControl, (req, res, next)=>{
    new Query('team').select('team.id', 'team.name')
    .join('team_permissions', new Query.Comparator().equalTo('team.id','team_id'))
    .join('person', new Query.Comparator().equalTo('person_id','person.id'))
    .run(true)
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
    })
});

router.get('/create', jwtControl, (req, res, next)=>{

    const name = req.body.name;
    const teamMembers = req.body.teamMembers;
    new Query('team').insert(true, 'name').insertValues(name)
    .run(false, {id : {type: oracledb.NUMBER, dir: oracledb.BIND_OUT } })
    .then(result=>{
        const teamId = result.outBinds.id[0];
        
        let inserts = []
        // Owner of the team (user that created it)
        inserts.push(addTeamMember(req.user, teamId, [1,1,1,1,1,1,1,1,1,1,1,1]));
        for(let i = 0; i < teamMembers.length; i++){
            inserts.push(addTeamMember(teamMembers[i].id, teamId, teamMembers[i].permissions));
        } 
        return Promise.all(inserts)
    })
    .then(result=>{
        res.json({
            success:true
        })
    })
    .catch(err=>{
        if(!(err instanceof ErrorManager.MainError)){
            err.msg = err.message;
            return next(new ErrorManager.DataBaseError("There was a problem, please try again in a moment.", err))
        }
        else{
            return next(err);
        }
    })
});

router.get('/addMember', jwtControl, (req, res, next)=>{
    const memberId = req.body.memberId;
    const teamId = req.body.teamId;
    const permissions = req.body.permissions;

    addTeamMember(memberId, teamId, permissions)
    .then(result=>{
        res.json({success:true})
    })
    .catch(err=>{
        if(!(err instanceof ErrorManager.MainError)){
            err.msg = err.message;
            return next(new ErrorManager.DataBaseError("There was a problem, please try again in a moment.", err))
        }
        else{
            return next(err);
        }
    })
});


function addTeamMember(userId, teamId, permissions){
    return new Query('team_permissions')
        .insert(false)
        .insertValues([userId, teamId].concat(permissions))
        .run()
}
module.exports = router;