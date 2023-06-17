const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  avatar: String,
  email: String,
  password: String,
});

const blackListed_Token_Schema = new mongoose.Schema({
  token:String
})

const userModel = mongoose.model("Userdb", userSchema);
const blackListed_Token_Model = mongoose.model("blackListed_Tokendb", blackListed_Token_Schema);

module.exports = {
  userModel,
  blackListed_Token_Model
}
