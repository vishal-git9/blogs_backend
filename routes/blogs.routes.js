const express = require("express")
const blogsModel = require("../models/blog.model")
const blogMiddleware = require("../middlewares/blog.middleware")
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
        const blogData = await blogsModel.find(queryObj).sort({date:sortWise}).skip((Number(page)-1)*limit).limit(limit)
        res.status(200).send({msg:"here is all the blogs",blogData})
    } catch (error) {
        res.status(400).send({msg:"error while fetching blogs"})
    }
})

blogRouter.post("/blogs",blogMiddleware,async(req,res)=>{
    try {
        const blogData = new blogsModel(req.body)
        await blogData.save()
        res.status(201).send({msg:"added a new blog"})
    } catch (error) {
        res.status(400).send({msg:"error while adding blog"})
    }
})

module.exports = blogRouter