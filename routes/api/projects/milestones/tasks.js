const router = require('express').Router();

router.get('/', (req, res)=>{
    res.send(req);
    // res.send(`Here is supossed to return mileston tasks\n project_id:${req.params} \n mileston_id: ${ req.params.id_milestone}`)
});

module.exports = router;