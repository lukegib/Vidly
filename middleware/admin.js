module.exports = function(req, res, next){
    // req.user already set
    if(!req.user.isAdmin) return res.status(403).send("Access Denied.")

    next();
}