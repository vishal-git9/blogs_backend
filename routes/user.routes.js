const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const userRouter = express.Router()

userRouter.get("/users",async(req,res)=>{
    try {
        const userData = await userModel.find()
        res.status(200).send({msg:"here is all the users data",userData})
    } catch (error) {
        res.status(400).send({msg:"error while fetching the data"})
    }
})
userRouter.post("/register",async(req,res)=>{
    console.log(req.body)
    const {email,password} = req.body
    const hashedPass = bcrypt.hashSync(password,10)
    const userData = {...req.body,password:hashedPass}
    try {
        const checkedData = await userModel.find({email:email})
        console.log(checkedData)
        if(checkedData.length>0){
            res.status(400).send({msg:"User already exist, please login"})
        }else{
            const setuserData = new userModel(userData)
            await setuserData.save()
            res.status(201).send({msg:"registerd successfully"})
        }
    } catch (error) {
        res.status(400).send({msg:"registeration failed"})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try {
        const userData = await userModel.find({email})
        const hashedPass = userData[0].password
        const decoded = bcrypt.compareSync(password,hashedPass)
        if(decoded){
            res.status(201).send({msg:"login successfully",token:jwt.sign({userId:userData[0]._id},"user"),userData})
        }else{
            res.status(400).send({msg:"No account exist"})
        }
    } catch (error) {
        res.status(400).send({msg:"Login failed"})
    }
})
// 

userRouter.patch("/users/:id/reset",async(req,res)=>{
    let {id} = req.params
    const userId = jwt.verify(id,"user",(err,found)=>{
        if(found){
            id = found.userId
        }else{
            res.status(400).send({msg:"token is invalid"})
        }
    })
    const {current,newPass} = req.body
    console.log(id)
    try {
        const user_database = await userModel.find({_id:id})
        const hashedPass = user_database[0].password
        const decoded = bcrypt.compareSync(current,hashedPass)
        if(decoded){
            const newHashedPass = bcrypt.hashSync(newPass,10)
            await userModel.findByIdAndUpdate(id,{password:newHashedPass})
            res.status(202).send({msg:"password updated succesfully"})
        }else{
            res.status(400).send({msg:"no account exist with this current password"})
        }
    } catch (error) {
        res.status(400).send({msg:"Update passowrd failed"})
    }
})

module.exports = userRouter