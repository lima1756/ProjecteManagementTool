const router = require('express').Router();
const oracledb = require('oracledb');
const Query = require('../../../../libraries/Query')
const ErrorManager = require('../../../../libraries/ErrorManager')
const DBController = require('../../../../libraries/DBController')
const jwt = require('../../../../libraries/jwtControl');
const ProjectPermission = require('../../../../libraries/ProjectPermissionsController');
const PermissionsTypes = ProjectPermission.PermissionsType;

router.use('/tasks', require('./tasks'));

router.get('/', jwt, (req, res, next)=>{
  const projectId = req.query.projectId;
  const userId = req.user;
  const milestoneId = req.query.milestoneId;
  if(!milestoneId){
    ProjectPermission.checkIfContributorToProject(userId, projectId)
    .then(result=>{
      return new Query('milestone')
        .select('*')
        .where(Query.Comparator.and(
          new Query.Comparator().equalTo('project_id', projectId),
          new Query.Comparator().equalTo('visible', 1)
        ))
        .run()
    })
    .then(result=>{
      res.json(DBController.oracleToSimpleJson(result))
    })
    .catch(ErrorManager.databaseErrorHandler(next))
  }
  else{
    ProjectPermission.checkIfContributorToProject(userId, projectId)
    .then(result=>{
      return new Query('milestone')
        .select('*')
        .where(Query.Comparator.and(
          new Query.Comparator().equalTo('project_id', projectId),
          new Query.Comparator().equalTo('visible', 1),
          new Query.Comparator().equalTo('id', milestoneId)
        ))
        .run(true)
    })
    .then(result=>{
      res.json(DBController.oracleToSimpleJson(result))
    })
    .catch(ErrorManager.databaseErrorHandler(next))
  }
})

router.post('/create', jwt, (req, res, next)=>{
  const projectId = req.body.projectId;
  const userId = req.user;
  const milestoneName = req.body.milestoneName, 
    milestoneDescription = req.body.milestoneDescription, 
    deadline = req.body.deadline, 
    dateFormat = req.body.dateFormat || 'YYYY-MM-DD';
  const tags = req.body.tags;
  console.log(req.body);
  ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.MILESTONE_CREATE)
  .then(result=>{
    return new Query('milestone')
      .insert(true, 'milestone_name', 'milestone_description', 'deadline', 'project_id')
      .insertValues(milestoneName, milestoneDescription, Query.dateValue(deadline, dateFormat), projectId)
      .run(true, {id : {type: oracledb.NUMBER, dir: oracledb.BIND_OUT } })
  })
  .then(result=>{
    if(tags){
      tagsPromises = []
      for(let i = 0; i < tags.length; i++){
        tagsPromises.push(new Query('milestone_tag')
          .insert(false, 'milestone_id', 'tag_id')
          .insertValues(result.outBinds.id[0], tags[i])
          .run(false)
        )
      }
      return Promise.all(tagsPromises);
    }
    else {
      res.json({success:true})
    }
  })
  .then(result=>{
    res.json({success:true})
  })
  .catch(ErrorManager.databaseErrorHandler(next))
})


router.put('/update', jwt, (req, res, next)=>{
  const userId = req.user;
  const projectId = req.body.projectId,
    milestoneName = req.body.milestoneName, 
    milestoneId = req.body.milestoneId,
    milestoneDescription = req.body.milestoneDescription, 
    deadline = req.body.deadline, 
    state = req.body.state
    dateFormat = req.body.dateFormat || 'YYYY-MM-DD';
  
  
  ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.MILESTONE_EDIT)
  .then(result=>{
    return new Query('milestone')
      .update(['milestone_name', milestoneName], ['milestone_description', milestoneDescription], ['deadline', Query.dateValue(deadline, dateFormat)], ['milestone_state', state])
      .where(new Query.Comparator().equalTo('id', milestoneId))
      .run(true);
  })
  .then(result=>{
    console.log(result)
    res.json({success:true})
  })
  .catch(ErrorManager.databaseErrorHandler(next))
})

router.delete('/delete', jwt, (req, res, next)=>{
  const userId = req.user;
  const projectId = req.body.projectId,
    milestoneId = req.body.milestoneId;
  
  
  ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.MILESTONE_EDIT)
  .then(result=>{
    return new Query('milestone')
      .update(['visible', 0])
      .where(new Query.Comparator().equalTo('id', milestoneId))
      .run(true);
  })
  .then(result=>{
    console.log(result)
    res.json({success:true})
  })
  .catch(ErrorManager.databaseErrorHandler(next))
})

router.get('/getTags', jwt, (req, res, next)=>{
  const userId = req.user;
  const projectId = req.body.projectId || req.query.projectId,
    milestoneId = req.body.milestoneId  || req.query.milestoneId;

  ProjectPermission.checkIfContributorToProject(userId, projectId)
  .then(result=>{
    return new Query('milestone_tag')
    .select('tag.id', 'tag_name', 'color')
    .join('tag', new Query.Comparator().equalTo("tag_id", "id"))
    .where(new Query.Comparator().equalTo("milestone_Id", milestoneId))
    .run(true);
  })
  .then(result=>{
    res.json(DBController.oracleToSimpleJson(result))
  })
  .catch(ErrorManager.databaseErrorHandler(next))
})

router.put('/addTag', jwt, (req, res, next)=>{
  const userId = req.user;
  const projectId = req.body.projectId || req.query.projectId,
    milestoneId = req.body.milestoneId || req.query.milestoneId,
    tagId = req.body.tagId || req.query.tagId;
  console.log(req.body)
  ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.MILESTONE_EDIT)
  .then(result=>{
    return new Query('milestone_tag')
    .insert(false)
    .insertValues(milestoneId, tagId)
    .run();
  })
  .then(result=>{
    res.json({success:true})
  })
  .catch(ErrorManager.databaseErrorHandler(next))
})

router.delete('/removeTag', jwt, (req, res, next)=>{
  const userId = req.user;
  const projectId = req.body.projectId,
    milestoneId = req.body.milestoneId,
    tagId = req.body.tagId;

  ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.MILESTONE_EDIT)
  .then(result=>{
    return new Query('milestone_tag')
    .delete()
    .where(Query.Comparator.and(
      new Query.Comparator().equalTo("milestone_id", milestoneId),
      new Query.Comparator().equalTo("tag_id", tagId)
    ))
    .run();
  })
  .then(result=>{
    res.json({success:true})
  })
  .catch(ErrorManager.databaseErrorHandler(next))
})


module.exports = router;