const router = require('express').Router();
const Query = require('../../../libraries/Query')
const ErrorManager = require('../../../libraries/ErrorManager')
const DBController = require('../../../libraries/DBController')
const oracledb = require('oracledb')
const jwt = require('../../../libraries/jwtControl');

router.use('/tags', require('./tags'));
router.use('/lists', require('./lists'));
router.use('/milestones', require('./milestones'));

router.get('/', jwt, (req, res, next)=>{
  const userId = req.user;
  const projectId = req.query.projectId || req.params.projectId || req.body.projectId;
  if(!projectId){
    new Query('project') 
      .select('id', 'project_name', 'project_state')
      .join('project_permissions', new Query.Comparator().equalTo('id', 'project_id'))
      .where(new Query.Comparator().equalTo('person_id', userId))
      .run()
    .then(result=>{
      res.json(DBController.oracleToSimpleJson(result))
    })
    .catch(ErrorManager.databaseErrorHandler(next))
  }
  else{
    new Query('project') 
      .select('project.*')
      .join('project_permissions', new Query.Comparator().equalTo('id', 'project_id'))
      .where(Query.Comparator.and(
        new Query.Comparator().equalTo('person_id', userId),
        new Query.Comparator().equalTo('id', projectId)
      ))
      .run()
    .then(result=>{
      res.json(DBController.oracleToSimpleJson(result))
    })
    .catch(ErrorManager.databaseErrorHandler(next))
  }
})

router.post('/create', jwt, (req, res, next)=>{
  const name = req.body.name;
  const userId = req.user;

  new Query('project')
    .insert(true, 'project_name', 'project_state')
    .insertValues(name, 'open')
    .run(false, {id : {type: oracledb.NUMBER, dir: oracledb.BIND_OUT } })
  .then(result=>{
      const projectId = result.outBinds.id[0];
      return new Query('project_permissions')
        .insert(false)
        .insertValues([userId, projectId, 1,1,1,1,1,1,1,1,1,1,1,1])
        .run()
  })
  .then(result=>{
      res.json({
          success:true
      })
  })
  .catch(ErrorManager.databaseErrorHandler(next));
})

router.put('/modify', jwt, (req, res, next)=>{
  const projectId = req.body.projectId;
  const state = req.body.state;
  const userId = req.user;

  
  checkOwnership(userId, projectId)
  .then(result=>{
    if(result.rows.length==1){
      return new Query('project')
        .update(['project_state', state])
        .where(new Query.Comparator().equalTo('id', projectId))
        .run()
    }
    else{
      throw new ErrorManager.Forbidden("You must be the creator of the project");
    }
  })
  .then(result=>{
    console.log(result);
    res.json({success:true});
  })
  .catch(ErrorManager.databaseErrorHandler(next));
})

router.delete('/deleteProject', jwt, (req, res, next)=>{
  const projectId = req.body.projectId;
  const userId = req.user;

  
  checkOwnership(userId, projectId)
  .then(result=>{
    if(result.rows.length==1){
      return new Query('project')
        .delete()
        .where(new Query.Comparator().equalTo('id', projectId))
        .run()
    }
    else{
      throw new ErrorManager.Forbidden("You must be the creator of the project");
    }
  })
  .then(result=>{
    console.log(result);
    res.json({success:true});
  })
  .catch(ErrorManager.databaseErrorHandler(next));
})

router.post('/addColaborator', jwt, (req, res, next)=>{
  const memberId = req.body.memberId;
  const projectId = req.body.projectId;
  const permissions = req.body.permissions;
  const userId = req.user;

  checkOwnership(userId, projectId)
  .then(result=>{
    if(result.rows.length==1){
      return new Query('project_permissions')
        .insert(false)
        .insertValues([memberId, projectId].concat(permissions))
        .run()
    }
    else{
      throw new ErrorManager.Forbidden("You must be the creator of the project");
    }
  })
  .then(result=>{
    res.json({
      success:true
    })
  })
  .catch(ErrorManager.databaseErrorHandler(next))
  
})

router.delete('/deleteColaborator', jwt, (req, res, next)=>{
  const memberId = req.body.memberId;
  const projectId = req.body.projectId;
  const userId = req.user;
  checkOwnership(userId, projectId)
  .then(result=>{
      if(result.rows.length==1){
          return new Query('project_permissions')
              .delete()
              .where(Query.Comparator.and(
                  new Query.Comparator().equalTo('person_id', memberId),
                  new Query.Comparator().equalTo('project_id', projectId)
              ))
              .run()
      }
      else{
          throw new ErrorManager.Forbidden("You must be the creator of the project");
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

function checkOwnership(userId, projectId){
  return new Query('project_permissions')
      .select('person_id')
      .where(Query.Comparator.and(
          new Query.Comparator().equalTo('person_id', userId),
          new Query.Comparator().equalTo('creator', 1),
          new Query.Comparator().equalTo('project_id', projectId)
      ))
      .run()
}
module.exports = router;