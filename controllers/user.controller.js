const express= require('express')
const app = express();
app.use(express.urlencoded({ extended: true }));
const bcrypt = require('bcryptjs')
const UserModel= require('../models/user.model.js')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')


let OTP = ''

const authToken=(req, res, next)=>{
  let authHeaders = req.headers['authorization']

  const token = authHeaders && authHeaders.split(" ")[1]
  console.log(token)

  if(!token){
    message='unauthorized'
    res.send({message, status:false})
  }

  jwt.verify(token, process.env.APP_PASS, (err, user)=>{
    if(err){
      message='invalid token'
    res.send({message, status:false})
    }else{
      next();
    }
  })

}

const signUp = async(req, res)=>{
  const {firstName, lastName, email, password}= req.body
  try {
    let saltRound = 10
    let salt = await bcrypt.genSalt(saltRound)
    let hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword)
    let form = await UserModel.create({firstName, lastName, email, password:hashedPassword});
    message = lastName;
    // res.render('index', {message});
    res.json({status:true, firstName, lastName, email})
  } catch (error) {
    // console.log(error.code)

    if (error.code == 11000) {
      message = "User already exists";
      res.send( {status:false,  message });
    } else {
      console.log(error)
      message = "error creating User";
      res.send( {status:false,  message });
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
      res.json( {message, status:false})
      }else{
        let token=  jwt.sign({user:user._id}, process.env.APP_PASS, {expiresIn:'1hr'})
        message = user.lastName
        res.send( {message, token, status:true})
      }
    }

  } catch (error) {
    message= 'cannot sign you in at this time'
    res.send({message, status:false})
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
    forgotPassword,
    authToken
}