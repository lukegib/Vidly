const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied - no token provided.');

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next(); //pass control to next midlleware
    }
    catch(err){
        res.status(400).send('Invalid Token!');
    }
}

