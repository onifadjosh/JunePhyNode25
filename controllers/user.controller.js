const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const bcrypt = require("bcryptjs");
const UserModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET, 
});

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAIL,
    pass: process.env.NODE_MAIL_PASS,
  },
});

let OTP = "";

let image;

const authToken = (req, res, next) => {
  let authHeaders = req.headers["authorization"];

  const token = authHeaders && authHeaders.split(" ")[1];
  console.log(token);

  if (!token) {
    message = "unauthorized";
    res.send({ message, status: false });
  }

  jwt.verify(token, process.env.APP_PASS, (err, user) => {
    if (err) {
      message = "invalid token";
      res.send({ message, status: false });
    } else {
      next();
    }
  });
};

const signUp = async (req, res) => {
  const { firstName, lastName, email, password, profileImage } = req.body;
  try {
    await cloudinary.v2.uploader.upload(profileImage, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        image = result.secure_url;
        console.log(image);
      }
    });
    let saltRound = 10;
    let salt = await bcrypt.genSalt(saltRound);
    let hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    let form = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImage: image,
    });
    message = lastName;
    // res.render('index', {message});
    res.json({ status: true, firstName, lastName, email });
    let mailOptions = {
      from: process.env.NODE_MAIL,
      to: email,
      subject: "Account Created!!! 🥳🥳",
      html: `<h1>Hello ${firstName}, Welcome to Osun Microfinance your account Number is ${form.accountNumber}</h1>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    // console.log(error.code)

    if (error.code == 11000) {
      message = "User already exists";
      res.send({ status: false, message });
    } else {
      console.log(error);
      message = "error creating User";
      res.send({ status: false, message });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      message = "invalid credentials";
      res.render("login", { message });
    } else {
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        message = "invalid credentials";
        res.json({ message, status: false });
      } else {
        console.log(user._id);
        let token = jwt.sign({ user: user._id }, process.env.APP_PASS, {
          expiresIn: "1hr",
        });
        message = user.lastName;
        res.send({ message, token, status: true });
      }
    }
  } catch (error) {
    message = "cannot sign you in at this time";
    res.send({ message, status: false });
  }
};

const requestOtpPage = (req, res) => {
  message = "";
  res.render("requestOtp", { message });
};

const requestOtp = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      message = "User doesn not exist";
      res.render("requestOtp", { message });
    } else {
      OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      console.log(OTP);
      message = "otp sent to mail";

      res.redirect(`/user/forgotPass/${email}`);
    }
  } catch (error) {
    message = "error verifying you";
    res.render("requestOtp", { message });
  }
};

const forgotPasswordPage = (req, res) => {
  const { email } = req.params;
  res.render("forgotPass", { email });
};

const forgotPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const { emaill } = req.params;

  console.log(email);
  // console.log(emaill)
  if (email && otp == OTP) {
    let user = await UserModel.findOne({ email });

    await UserModel.findByIdAndUpdate(user._id, { password: newPassword });
    message = "Password updated successfully";
    res.render("login", { message });
  } else {
    //  message='Password updated successfully'
    res.render("forgotPass", { email });
  }
};

const resolveAccount = async (req, res) => {
  const { accountNumber } = req.body;

  try {
    let user = await UserModel.findOne({ accountNumber });
    if (!user) {
      res.json({ status: false, message: "invalid account details" });
    } else {
      res.json({
        status: true,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  } catch (error) {
    res.json({ status: false, message: "Error getting account at this time" });
  }
};

const loginPage = (req, res) => {
  message = "";
  res.render("login", { message });
};

const signupPage = (req, res) => {
  message = "";
  res.render("signup", { message });
};

module.exports = {
  signUp,
  login,
  loginPage,
  signupPage,
  requestOtp,
  requestOtpPage,
  forgotPasswordPage,
  forgotPassword,
  authToken,
  resolveAccount,
};
