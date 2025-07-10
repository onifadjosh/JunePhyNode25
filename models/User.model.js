const mongoose = require("mongoose");
const genAccountModel = require('./genAccountNum.model.js')
const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage:{type:String, default:''},
  password: { type: String, required: true },
  accountBalance: { type: Number, default: 100 },
  accountNumber: { type: String },


  isAdmin: { type: Boolean, required: false, default: false },
  dateCreated: { type: String, default: Date.now() },
});

UserSchema.pre("save" , async function(next){
  let accountdigit = await genAccountModel.find()
  
  if(!accountdigit){
    
    console.log('cannot assign account Number at this time')
  }else{
    console.log(accountdigit[0].genAccount)
    let accountNum = Number(accountdigit[0].genAccount)+1
    let accountId = accountdigit[0]._id

    this.accountNumber = `SGB${accountNum}`

    await genAccountModel.findByIdAndUpdate(accountId, {genAccount:accountNum})
  }

  
  
  next();
});

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;