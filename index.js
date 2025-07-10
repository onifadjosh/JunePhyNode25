const express = require("express");
const app = express();
const ejs = require("ejs");
const cors = require('cors')
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
app.set("view engine", "ejs");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit:'50mb' }));
app.use(express.json({limit:'50mb'}))
app.use(cors());
const UserRouter = require("./routes/user.routes.js");
const StudentRouter = require("./routes/student.routes.js");
app.use( "/user", UserRouter);
app.use("/students", StudentRouter)
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
