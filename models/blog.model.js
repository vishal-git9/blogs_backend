const mongoose = require("mongoose");

const blogsSchema = mongoose.Schema({
  username: String,
  title: String,
  content: String,
  category: String,
  date: String,
  likes: String,
  userId: String,
  comments: [{ username: String, comment: String }],
});

const blogsModel = mongoose.model("blogsdb", blogsSchema);

module.exports = blogsModel;
