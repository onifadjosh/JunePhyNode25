const express= require('express')
const app = express();
app.use(express.urlencoded({ extended: true }));
const bcrypt = require('bcryptjs')
const UserModel= require('../models/user.model.js')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')


let OTP = ''

const signUp = async(req, res)=>{
  const {firstName, lastName, email, password}= req.body
  try {
    let saltRound = 10
    let salt = await bcrypt.genSalt(saltRound)
    let hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword)
    let form = await UserModel.create({firstName, lastName, email, password:hashedPassword});
    students.push(req.body);
    message = lastName;
    // res.render('index', {message});
    res.render('login')
  } catch (error) {
    // console.log(error.code)

    if (error.code == 11000) {
      message = "User already exists";
      res.render("signup", { message });
    } else {
      console.log(error)
      message = "error adding Student";
      res.render("signup", { message });
    }
  }

}


const login = async(req, res)=>{
  const{email, password} = req.body

  try {
    let user = await UserModel.findOne({email})
    if(!user){
      message= 'invalid credentials'
      res.render('login', {message})
    }else{
      let isMatch= await bcrypt.compare(password, user.password)
      if(!isMatch){
        message= 'invalid credentials'
      res.render('login', {message})
      }else{
        let token=  jwt.sign({user:user._id}, process.env.APP_PASS, {expiresIn:'1hr'})
        message = user.lastName
        res.send( {message, token})
      }
    }

  } catch (error) {
    message= 'cannot sign you in at this time'
    res.render('login', {message})
  }
}

const requestOtpPage=(req, res)=>{
  message= ''
  res.render('requestOtp', {message})
}

const requestOtp=async(req, res)=>{
  const{email}= req.body
  try {

    let user= await UserModel.findOne({email})
    if(!user){
      message= 'User doesn not exist'
      res.render('requestOtp', {message})
    }else{
     OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
     console.log(OTP)
      message='otp sent to mail'


      res.redirect(`/user/forgotPass/${email}`)

    }
    
  } catch (error) {
    message= 'error verifying you'
      res.render('requestOtp', {message})
  }
}

const forgotPasswordPage=(req, res)=>{
  const{email}=req.params
  res.render('forgotPass', {email})
}

const forgotPassword=async(req, res)=>{
  const {email, otp, newPassword} = req.body
    const{emaill}=req.params

    console.log(email)
    // console.log(emaill)
    if(email&& otp==OTP){
      let user = await UserModel.findOne({email})

     await UserModel.findByIdAndUpdate(user._id, {password:newPassword})
      message='Password updated successfully'
      res.render('login', {message})
    }else{
      //  message='Password updated successfully'
      res.render('forgotPass', {email})
    }

}

const loginPage = (req, res)=>{
  message = ''
  res.render('login', {message})
}

const signupPage =  (req, res) => {
  message = "";
  res.render("signup", { message });
}


module.exports= {
    signUp,
    login,
    loginPage,
    signupPage,
    requestOtp,
    requestOtpPage,
    forgotPasswordPage,
    forgotPassword
}