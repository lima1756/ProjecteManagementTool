const router = require('express').Router();

router.param('idMilestone', (req, res, next, idMilestone)=>{
    req.milestone = idMilestone;
  
    return next();
});

router.use('/:id_milestone/tasks', require('./tasks'));

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;