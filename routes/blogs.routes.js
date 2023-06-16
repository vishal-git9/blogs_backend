const express = require("express")
const blogsModel = require("../models/blog.model")
const blogMiddleware = require("../middlewares/blog.middleware")
const authMiddleware = require("../middlewares/auth.middlware")
const blogRouter = express.Router()
blogRouter.get("/blogs",async(req,res)=>{
    const {category,title,sort,page,limit,order} = req.query
    const queryObj = {}
    let sortWise = -1
    if(category){
        queryObj.category = category
    }
    if(title){
        queryObj.title = {$regex:title,$options:"i"}
    }
    if(sort&& order){
        if(order==="asc"){
            sortWise = -1
        }else{
            sortWise = 1
        }
    }
    try {
        const blogData = await blogsModel.blogsModel.find(queryObj).populate({path:"comments.commentId",populate:"userId"}).sort({date:sortWise}).skip((Number(page)-1)*limit).limit(limit)
        res.status(200).send({msg:"here is all the blogs",blogData})
    } catch (error) {
        res.status(400).send({msg:"error while fetching blogs"})
    }
})

blogRouter.get("/blogs/user",async(req,res)=>{
    const token = req.headers.authorization
    try {
        jwt.verify(token,"user",async(err,found)=>{
        if(found){
                const userData = await blogsModel.blogsModel.find({userId:found.userId}).populate({path:"comments.commentId",populate:"userId"})
                res.status(200).send({msg:"all blogs of this user",userData})
        }else{
            res.status(404).send({msg:"you are not authorized for this action"})
        }
    })
    } catch (error) {
        res.status(400).send({msg:"error while fetching the blogs"})
    }
})

// get user by username

blogRouter.get("/blogs/comments",async(req,res)=>{
    try {
        const userData = await blogsModel.commentsModel.find().populate("userId")
        console.log(userData)
        res.status(200).send({msg:"data of the commented user",userData})
    } catch (error) {
        res.status(400).send({msg:"error while fetching the username"})
    }
})

blogRouter.post("/blogs",blogMiddleware,async(req,res)=>{
    try {
        const blogData = new blogsModel.blogsModel(req.body)
        await blogData.save()
        res.status(201).send({msg:"added a new blog"})
    } catch (error) {
        res.status(400).send({msg:"error while adding blog"})
    }
})


blogRouter.post("/blogs/update/:id",async(req,res)=>{
    const {id} = req.params
    try {
        const commentsData = new blogsModel.commentsModel({
            userId:req.body.userId,
            comment:req.body.comment
        })
        await commentsData.save()
        const getDocument = await blogsModel.blogsModel.findById(id)
        getDocument.comments.push({commentId:commentsData._id})
        await getDocument.save()
        res.status(201).send({msg:"added a new comment"})
    } catch (error) {
        res.status(400).send({msg:"error while adding comment"})
    }
})

blogRouter.patch("/blogs/update/:id",authMiddleware,async(req,res)=>{
    const {id} = req.params
    try {
        const getDocument = await blogsModel.blogsModel.findByIdAndUpdate(id,req.body)
        res.status(201).send({msg:"added a new like"})
    } catch (error) {
        res.status(400).send({msg:"error while adding like"})
    }
})
blogRouter.delete("/blogs/delete/:id",authMiddleware,async(req,res)=>{
    const {id} = req.params
    try {
        const getDocument = await blogsModel.blogsModel.findByIdAndDelete(id)
        res.status(201).send({msg:"deleted the blog"})
    } catch (error) {
        res.status(400).send({msg:"error while deleting blog"})
    }
})

module.exports = blogRouter
