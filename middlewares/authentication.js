const {verifyToken} = require('../helpers/jwt')

module.exports = {
    authentication(req,res,next) {
        if(req.headers.hasOwnProperty('access_token')) {
            try {
                const decode = verifyToken(req.headers.access_token)
                req.decode = decode
                next()
            }
            catch(err) {
                next({status: 401, message: "unauthorized"})
            }
        }
        else{
            next({status: 401, message: "unauthorized"})
        }
    }
}