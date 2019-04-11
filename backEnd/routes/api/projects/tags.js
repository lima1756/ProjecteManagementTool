const router = require('express').Router();
const Query = require('../../../libraries/Query')
const ErrorManager = require('../../../libraries/ErrorManager')
const DBController = require('../../../libraries/DBController')
const jwt = require('../../../libraries/jwtControl');
const ProjectPermission = require('../../../libraries/ProjectPermissionsController');
const PermissionsTypes = ProjectPermission.PermissionsType;

router.get('/', (req, res, next)=>{
    const projectId = req.body.projectId;
    
    ProjectPermission.checkIfContributorToProject(userId, projectId)
    .then(result=>{
        return new Query('tag').select('*')
        .where(new Query.Comparator().equalTo('project_id', projectId))
        .run()
    })
    .then(result=>{
        res.json(DBController.oracleToSimpleJson(result))
    })
    .catch(ErrorManager.databaseErrorHandler(next))
});

router.post('/create', jwt, (req, res, next)=>{
    const projectId = req.body.projectId;
    const tagName = req.body.tagName;
    const userId = req.user;
    const color = req.body.color;

    ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.TAGS_CREATE)
    .then(result=>{
        if(result){
            return new Query('tag')
            .insert(false, "tag_name", "color", "project_id")
            .insertValues(tagName, color, projectId)
            .run()
        }
        else{
            throw new ErrorManager.Forbidden("You don't have the permission to do this")
        }
    })
    .then(result=>{
        res.json({success:true})
    })
    .catch(ErrorManager.databaseErrorHandler(next))
})

router.delete('/delete', jwt, (req, res, next)=>{
    const projectId = req.body.projectId;
    const userId = req.user;
    const tagId = req.body.tagId;

    ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.TAGS_DELETE)
    .then(result=>{
        if(result){
            return new Query('tag').delete().where(new Query.Comparator().equalTo('id', tagId)).run()
        }
        else{
            throw new ErrorManager.Forbidden("You don't have the permission to do this")
        }
    })
    .then(result=>{
        res.json({success:true})
    })
    .catch(ErrorManager.databaseErrorHandler(next))
})

router.put('/update', jwt, (req, res, next)=>{
    const projectId = req.body.projectId;
    const userId = req.user;
    const tagId = req.body.tagId;
    const tagName = req.body.tagName;
    const color = req.body.color;

    ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.TAGS_DELETE)
    .then(result=>{
        if(result){
            return new Query('tag')
            .update(["tag_name", tagName], ["color", color])
            .where(new Query.Comparator().equalTo('id', tagId))
            .run()
        }
        else{
            throw new ErrorManager.Forbidden("You don't have the permission to do this")
        }
    })
    .then(result=>{
        res.json({success:true})
    })
    .catch(ErrorManager.databaseErrorHandler(next))
})

module.exports = router;