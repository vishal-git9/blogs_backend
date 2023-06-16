const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema({
  username: String,
  title: String,
  content: String,
  category: String,
  date: String,
  likes: Number,
  userId: String,
  comments: [{commentId:{type:mongoose.Schema.Types.ObjectId,ref:"commentsModel"}}]
  // 64621a20b9d1853f5545e9e2
});


const commentsSchema = new mongoose.Schema({
  userId:{ 		// this one populate
    type: mongoose.Schema.Types.ObjectId,      
    ref:"Userdb",
},
  comment: String,
})

const commentsModel = mongoose.model("commentsModel",commentsSchema)

// const data = blogsModle.aggregate([{$lookup:{from:"Userdb",localfield:"username",foreignfiled:"username",as:"commeents"}}])

const blogsModel = mongoose.model("blogsdb", blogsSchema);

module.exports = {blogsModel,commentsModel};
