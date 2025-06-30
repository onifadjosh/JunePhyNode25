const express = require("express");
const app = express();
const ejs = require("ejs");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
app.set("view engine", "ejs");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const UserModel = require("./models/user.model.js");
const StudentModel = require("./models/student.model.js");
const UserRouter = require("./routes/user.routes.js");
app.use( "/user", UserRouter);
let URI = process.env.DB_URI;

mongoose
  .connect(URI)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

let students = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    course: "Computer Science",
    isAdmin: false,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    course: "Mathematics",
    isAdmin: false,
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    course: "Physics",
    isAdmin: false,
  },
  {
    firstName: "Bob",
    lastName: "Brown",
    email: "bob.brown@example.com",
    course: "Chemistry",
    isAdmin: false,
  },
  {
    firstName: "Charlie",
    lastName: "Davis",
    email: "charlie.davis@example.com",
    course: "Biology",
    isAdmin: false,
  },
  {
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@example.com",
    course: "History",
    isAdmin: false,
  },
  {
    firstName: "Eva",
    lastName: "Garcia",
    email: "eva.garcia@example.com",
    course: "Literature",
    isAdmin: false,
  },
  {
    firstName: "Frank",
    lastName: "Martinez",
    email: "frank.martinez@example.com",
    course: "Art",
    isAdmin: false,
  },
  {
    firstName: "Grace",
    lastName: "Lopez",
    email: "grace.lopez@example.com",
    course: "Philosophy",
    isAdmin: false,
  },
  {
    firstName: "Henry",
    lastName: "Hernandez",
    email: "henry.hernandez@example.com",
    course: "Economics",
    isAdmin: false,
  },
];

let message;



// app.get(path, callback)
app.get("/index", (req, res) => {
  // res.send('Hello, we have gotten here, wow')
  // res.send(1+5)

  // res.send({status:true, message:'we are going higher'})

  // console.log(__dirname)
  // res.sendFile(__dirname+'\/\index.html')

  res.render("index", { message: "Pamilerin" });
});

app.get("/about", (req, res) => {
  // let gender = 'female'
  res.render("about", { gender: "male" });
});

app.get("/allStudents", async (req, res) => {
  try {
    let students = await StudentModel.find();

    // res.render("allStudents", { students });
    res.json(students);
  } catch (e) {
    console.log(e);
    res.render("404");
  }
});

app.get("/addStudent", (req, res) => {
  message = "";
  res.render("addStudent", { message });
});

app.post("/addStudent", async (req, res) => {
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
});

app.post("/delete/:id", async (req, res) => {
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
});

app.get("/edit/:id", (req, res) => {
  const { id } = req.params;

  res.render("editStudent", { id });
});

app.post("/edit/:id", async (req, res) => {
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
});

//to create a server
// app.listen(port, callback)
let port = 5000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server started successfully on port ${port}`);
  }
});
