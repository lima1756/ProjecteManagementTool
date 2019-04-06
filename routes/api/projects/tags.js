const router = require('express').Router();

router.get('/', (req, res)=>{
    res.send(`Here is supossed to return project tags,project id ${req.project}`)
});

module.exports = router;