module.exports = function asyncMiddleware(handler){
    return async (req, res, next) => {
        try{
            await handler(req, res);
        }
        catch(ex){
            next(ex);
        }
    }
}

//NOTE - THIS IS NOT BEING USED AS ALTERNATIVE NPM PACKAGE 'EXPRESS-ASYNC-ERRORS' IS INSTEAD IN USE!!!