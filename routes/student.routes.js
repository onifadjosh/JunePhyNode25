const express = require('express');
const { getAllStudentsPage, getAddStudentPage, addStudent, deleteStudent, editStudentPage, editStudent } = require('../controllers/student.controller');
const { authToken } = require('../controllers/user.controller');
const router = express.Router()
router.get("/allStudents",authToken,  getAllStudentsPage);

router.get("/addStudent", getAddStudentPage);

router.post("/addStudent", addStudent);

router.post("/delete/:id", deleteStudent);

router.get("/edit/:id", editStudentPage);

router.post("/edit/:id", editStudent);

module.exports= router
