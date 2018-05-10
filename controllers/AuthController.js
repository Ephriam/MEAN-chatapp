var jwt = require('jsonwebtoken')

module.exports.tokenChecker = (req, res, next) => {
    try {
      var decoded = jwt.verify(req.headers.authorization, 'JWT_SECRET')
      req.user = decoded 
      next()  
    }catch (err){
        return res.status(401).json({msg: 'Auth Failed'})        
    }    
}

module.exports.tokenCheckerChat = (token) => {
    return new Promise ((resolve, reject) => {
        try {
        resolve(jwt.verify(token, 'JWT_SECRET')) 
        }catch (err){
            reject({err: 'invalid token'})
        }  
    })       
}