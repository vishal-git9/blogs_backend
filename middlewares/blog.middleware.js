const jwt = require("jsonwebtoken")
const blogMiddleware = (req,res,next)=>{
    const token = req.headers.authorization

    jwt.verify(token,"user",(err,found)=>{
        if(found){
            const utc = new Date().toJSON().slice(0,10);
            req.body.date = utc
            req.body.userId = found.userId
            next()
        }else{
            res.status(404).send({msg:"you are not authorized for this action"})
        }
    })
}

module.exports = blogMiddleware