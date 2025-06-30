const express= require('express')
const router = express.Router()
const UserModel = require('../models/user.model.js')
const { signUp, login, loginPage, signupPage } = require('../controllers/user.controller.js')
router.post('/signup', signUp)

router.get('/login', loginPage)

router.post('/login', login)

router.get("/signup",signupPage);

module.exports = router
