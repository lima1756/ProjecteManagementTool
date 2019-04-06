const router = require('express').Router();

router.get('/', (req, res)=>{
    res.send("Here is supossed to return project lists", req.params.id)
});

module.exports = router;