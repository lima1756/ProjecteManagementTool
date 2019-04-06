const router = require('express').Router();

router.get('/', (req, res)=>{
    res.send("Here is supossed to return teams")
});

module.exports = router;