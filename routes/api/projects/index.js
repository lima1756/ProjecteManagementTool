const router = require('express').Router();

router.param('id', (req, res, next, id)=>{
    req.project = id;
  
    return next();
});


router.use('/:id/tags', require('./tags'));
router.use('/:id/lists', require('./lists'));
router.use('/:id/milestones', require('./milestones'));

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