const mongoose = require('mongoose')
const StudentSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  isAdmin: { type: Boolean, required: false, default: false },
  dateCreated: { type: String, default: Date.now() },
});

const StudentModel = mongoose.model("students", StudentSchema);


module.exports= StudentModel