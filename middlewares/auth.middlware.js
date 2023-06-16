const jwt = require("jsonwebtoken")
 const authMiddleware = async(req,res,next)=>{
    const token = req.headers.authorization
    jwt.verify(token,"user",(err,found)=>{
        if(found){
            next()
        }else{
            res.status(404).send({msg:"you are not authorized for this action"})
        }
    })
}

module.exports = authMiddleware