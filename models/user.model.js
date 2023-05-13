const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  avatar: String,
  email: String,
  password: String,
});

const userModel = mongoose.model("Userdb", userSchema);

module.exports = userModel;
