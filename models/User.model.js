const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: false, default: false },
  dateCreated: { type: String, default: Date.now() },
});
const UserModel = mongoose.model("Users", UserSchema);

module.exports= UserModel