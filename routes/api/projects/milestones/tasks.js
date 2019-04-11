const router = require('express').Router();
const Query = require('../../../../libraries/Query')
const ErrorManager = require('../../../../libraries/ErrorManager')
const DBController = require('../../../../libraries/DBController')
const jwt = require('../../../../libraries/jwtControl');
const ProjectPermission = require('../../../../libraries/ProjectPermissionsController');
const PermissionsTypes = ProjectPermission.PermissionsType;

router.get('/', jwt, (req, res, next)=>{
  const projectId = req.body.projectId;
  const userId = req.user;

  ProjectPermission.checkIfContributorToProject(userId, projectId)
  .then(result=>{
    return new Query('task')
      .select('task.id', 'task_name', 'task_description', 'deadline', 'task_state')
      .join('milestone', new Query.Comparator().equalTo('milestone.id', 'milestone_id'))
      .where(new Query.Comparator().equalTo('project_id', projectId))
      .run()
  })
  .then(result=>{
    res.json(DBController.oracleToSimpleJson(result))
  })
  .catch(ErrorManager.databaseErrorHandler(next))
})

router.get('/milestoneTasks', jwt, (req, res, next)=>{
    const projectId = req.body.projectId;
    const userId = req.user;
    const milestoneId = req.body.milestoneId;

    ProjectPermission.checkIfContributorToProject(userId, projectId)
    .then(result=>{
      return new Query('task')
        .select('*')
        .where(Query.Comparator.and(
            new Query.Comparator().equalTo('project_id', projectId),
            new Query.Comparator().equalTo('milestone_id', milestoneId),
            ))
        .run()
    })
    .then(result=>{
      res.json(DBController.oracleToSimpleJson(result))
    })
    .catch(ErrorManager.databaseErrorHandler(next))
  })

router.post('/create', jwt, (req, res, next)=>{
  const projectId = req.body.projectId;
  const userId = req.user;
  const milestoneId = req.body.milestoneId;
  const taskName = req.body.taskName, 
    taskDescription = req.body.taskDescription, 
    deadline = req.body.deadline,
    dateFormat = req.body.dateFormat;

  ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.TASK_CREATE)
  .then(result=>{
    return new Query('task')
      .insert(false, 'task_name', 'task_description', 'deadline', 'milestone_id')
      .insertValues(taskName, taskDescription, Query.dateValue(deadline, dateFormat), milestoneId)
      .run()
  })
  .then(result=>{
    console.log(result)
    res.json({success:true})
  })
  .catch(ErrorManager.databaseErrorHandler(next))
})


router.put('/update', jwt, (req, res, next)=>{
  const userId = req.user;
  const projectId = req.body.projectId,
    taskId = req.body.taskId,
    taskName = req.body.taskName, 
    taskDescription = req.body.taskDescription, 
    deadline = req.body.deadline, 
    state = req.body.state
    dateFormat = req.body.dateFormat;
  
  ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.TASK_EDIT)
  .then(result=>{
    return new Query('task')
      .update(['task_name', taskName], ['task_description', taskDescription], ['deadline', Query.dateValue(deadline, dateFormat)], ['milestone_state', state])
      .where(new Query.Comparator().equalTo('id', taskId))
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
    taskId = req.body.taskId;
  
  
  ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.TASK_EDIT)
  .then(result=>{
    return new Query('task')
      .delete()
      .where(new Query.Comparator().equalTo('id', taskId))
      .run();
  })
  .then(result=>{
    console.log(result)
    res.json({success:true})
  })
  .catch(ErrorManager.databaseErrorHandler(next))
})

router.get('/getTags', jwt, (req, res, next)=>{
    const userId = req.user;
    const projectId = req.body.projectId,
      taskId = req.body.taskId;
  
    ProjectPermission.checkIfContributorToProject(userId, projectId)
    .then(result=>{
      return new Query('task_tag')
      .select('tag_name', 'color')
      .join('tag', new Query.Comparator().equalTo("tag_id", "id"))
      .where(new Query.Comparator().equalTo("task_id", taskId))
      .run(true);
    })
    .then(result=>{
      res.json(DBController.oracleToSimpleJson(result))
    })
    .catch(ErrorManager.databaseErrorHandler(next))
  })

router.put('/addTag', jwt, (req, res, next)=>{
  const userId = req.user;
  const projectId = req.body.projectId,
    taskId = req.body.taskId,
    tagId = req.body.tagId;

  ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.TASK_EDIT)
  .then(result=>{
    return new Query('task_tag')
    .insert(false)
    .insertValues(taskId, tagId)
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
    taskId = req.body.taskId,
    tagId = req.body.tagId;

  ProjectPermission.checkPermission(userId, projectId, PermissionsTypes.TASK_EDIT)
  .then(result=>{
    return new Query('task_tag')
    .delete()
    .where(Query.Comparator.and(
      new Query.Comparator().equalTo("task_id", milestoneId),
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