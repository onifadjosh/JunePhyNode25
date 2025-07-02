const express= require('express')
const router = express.Router()
const UserModel = require('../models/user.model.js')
const { signUp, login, loginPage, signupPage, requestOtp, requestOtpPage, forgotPasswordPage, forgotPassword } = require('../controllers/user.controller.js')
router.post('/signup', signUp)

router.get('/login', loginPage)

router.post('/login', login)

router.get("/signup",signupPage);
router.post("/requestOtp",requestOtp);
router.get('/requestOtp', requestOtpPage)
router.get('/forgotPass/:email', forgotPasswordPage)
router.post('/forgotPass/:email', forgotPassword)

module.exports = router
