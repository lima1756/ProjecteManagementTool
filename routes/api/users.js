const router = require('express').Router();

router.get('/', (req, res)=>{
    res.send("Here is supossed to return users")
});

module.exports = router;