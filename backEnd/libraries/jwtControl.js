const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const ErrorManager = require('./ErrorManager')

module.exports = (req, res, next)=>{
    const token = req.get("token") || req.body.token;
    jwt.verify(token, secret, (err, decoded)=>{
        if(err)
            next(new ErrorManager.Forbidden("Please use a generated token through login in the request"))
        req.user = decoded.id;
        next();
    });
};