const router = require('express').Router();
const jwtControl = require('../../libraries/jwtControl')
const Query = require('../../libraries/Query');
const ErrorManager = require('../../libraries/ErrorManager');
const DBController =  require('../../libraries/controllers/DBController')
const oracledb = require('oracledb');

router.get('/', jwtControl, (req, res, next)=>{
    new Query('team').select('team.id', 'team.name', 'creation_date', 'count(team_permissions.team_id) total')
        .join('team_permissions', new Query.Comparator().equalTo('team.id','team_id'))
        .groupBy('team.id', 'team.name', 'creation_date')
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

router.get('/teamDetails', jwtControl, (req, res, next)=>{
    const teamId = req.body.teamId;
    const userId = req.user;

    
    new Query('team_permissions')
        .select('person_id')
        .where(Query.Comparator.and(
            new Query.Comparator().equalTo('person_id', userId), 
            new Query.Comparator().equalTo('creator', 1),
            new Query.Comparator().equalTo('team_id', teamId)    
        ))
        .run(true)
    .then(result=>{
        let select = null;
        if(result.rows.length==1)
        {
            select = ['team_permissions.*', 'person.username', 'email']
        }
        else{
            select = ['person.username', 'email']
        }
        return new Query('team_permissions')
                .select(select)
                .join('person', new Query.Comparator().equalTo('person.id', 'team_permissions.person_id'))
                .join('email', new Query.Comparator().equalTo('person.id', 'email.person_id'))
                .where(Query.Comparator.and(
                    new Query.Comparator().equalTo('main', 1),
                    new Query.Comparator().equalTo('team_id', teamId)
                ))
                .run(true)
    })
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
});

router.put('/create', jwtControl, (req, res, next)=>{
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

router.put('/addMember', jwtControl, (req, res, next)=>{
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

router.put('/updateMember', jwtControl, (req, res, next)=>{
    const memberId = req.body.memberId;
    const teamId = req.body.teamId;
    const permissions = req.body.permissions;
    const userId = req.user;

    new Query('team_permissions')
        .select('person_id')
        .where(Query.Comparator.and(
            new Query.Comparator().equalTo('person_id', userId),
            new Query.Comparator().equalTo('creator', 1),
            new Query.Comparator().equalTo('team_id', teamId)
        ))
        .run()
    .then(result=>{

        if(result.rows.length==1){
            let updateValues = []
            const columns = ['creator', 'task_create', 'task_edit', 'milestone_create', 'milestone_edit', 'milestone_task_delete', 'tags_create', 'tags_edit', 'tags_delete', 'list_create', 'list_delete', 'tasks_in_lists_move'];
            for(let i = 0; i < permissions.length; i++){
                updateValues.push([columns[i], permissions[i]])
            }
            return new Query('team_permissions')
            .update(updateValues)
            .where(Query.Comparator.and(
                new Query.Comparator().equalTo('person_id', memberId),
                new Query.Comparator().equalTo('team_id', teamId)
            ))
            .run(true)
        }
        else{
            throw new ErrorManager.Forbidden("You must be the creator of the team");
        }
    })
    .then(result=>{
        console.log(result);
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
})

router.delete('/deleteMember', jwtControl, (req, res, next)=>{
    const memberId = req.body.memberId;
    const teamId = req.body.teamId;
    new Query('team_permissions')
        .select('person_id')
        .where(Query.Comparator.and(
            new Query.Comparator().equalTo('person_id', req.user),
            new Query.Comparator().equalTo('creator', 1),
            new Query.Comparator().equalTo('team_id', teamId)
        ))
        .run()
    .then(result=>{
        if(result.rows.length==1){
            return new Query('team_permissions')
                .delete()
                .where(Query.Comparator.and(
                    new Query.Comparator().equalTo('person_id', memberId),
                    new Query.Comparator().equalTo('team_id', teamId)
                ))
                .run()
        }
        else{
            throw new ErrorManager.Forbidden("You must be the creator of the team");
        }
    })
    .then(result=>{
        console.log(result);
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
})

router.delete('/delete', jwtControl, (req, res, next)=>{
    const teamId = req.body.teamId;
    new Query('team_permissions')
        .select('person_id')
        .where(Query.Comparator.and(
            new Query.Comparator().equalTo('person_id', req.user),
            new Query.Comparator().equalTo('creator', 1),
            new Query.Comparator().equalTo('team_id', teamId)
        ))
        .run()
    .then(result=>{
        if(result.rows.length==1){
            return new Query('team')
                .delete()
                .where(Query.Comparator.and(
                    new Query.Comparator().equalTo('id', teamId)
                ))
                .run()
        }
        else{
            throw new ErrorManager.Forbidden("You must be the creator of the team");
        }
    })
    .then(result=>{
        console.log(result);
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
})

// TODO: delete team, check if creator


function addTeamMember(userId, teamId, permissions){
    return new Query('team_permissions')
        .insert(false)
        .insertValues([userId, teamId].concat(permissions))
        .run(true)
}
module.exports = router;