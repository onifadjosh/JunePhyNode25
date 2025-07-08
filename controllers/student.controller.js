const express = require("express");
const StudentModel = require("../models/student.model.js");
const jwt = require('jsonwebtoken')

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


const getAllStudentsPage = async (req, res) => {
  try {
    let students = await StudentModel.find();

    // res.render("allStudents", { students });
    res.json(students);
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

const getAddStudentPage = (req, res) => {
  message = "";
  res.render("addStudent", { message });
};

const addStudent = async (req, res) => {
  console.log("i am working");
  console.log(req.body);
  const { firstName, lastName, email, course } = req.body;

  try {
    let form = await StudentModel.create(req.body);
    students.push(req.body);
    message = "Student added sucessfully";
    res.render("addStudent", { message });
  } catch (error) {
    // console.log(error.code)

    if (error.code == 11000) {
      message = "Student already exists";
      res.render("addStudent", { message });
    } else {
      message = "error adding Student";
      res.render("addStudent", { message });
    }
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    let student = await StudentModel.findByIdAndDelete(id);
    let students = await StudentModel.find();

    res.render("allStudents", { students });
  } catch (error) {
    console.log(e);
    res.render("404");
  }
  // console.log(req.params.id)
  // console.log(id)
  // students.splice(id, 1);
};

const editStudentPage = (req, res) => {
  const { id } = req.params;

  res.render("editStudent", { id });
};

const editStudent = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, course } = req.body;
  try {
    // students.splice(id, 1, req.body);
    let newStudent = await StudentModel.findByIdAndUpdate(id, req.body);
    let students = await StudentModel.find();

    res.render("allStudents", { students });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "error editing student" });
  }
};

module.exports = {
  getAllStudentsPage,
  getAddStudentPage,
  addStudent,
  deleteStudent,
  editStudentPage,
  editStudent,
  authToken
};
