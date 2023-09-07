const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(cors());
let ADMINS = [];
let USERS = [];
let COURSES = [];

const secret = 'My_Secret_key';
const generateJwt = (user) => {
  const payload = {username : user.username}
  jwt.sign(payload,secret); // here payload is the data that you want to encrypt and secret is your secret key
};

const authenticateJwt = (req,res,next)=>{
  let authHeader = req.header.authentication;
  if(authHeader){
    const token = authHeader.split(" ")[1];
    jwt.verify(token,secret,(err,user)=>{
      if(err){
        res.status(403);
      }
      req.user = user;
      next();
    });
  }else{
    res.status(401);
  } 
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var adminInfo = req.body;
  let adminFound = ADMINS.find(a=>a.username === adminFound.username);
  if(!adminFound){
    ADMINS.push(adminInfo);
    const token = generateJwt(adminInfo);
    res.json({
      message : "Admin Created Successfully",
      token
    });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username , password} = req.header;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if(admin){
    const token = generateJwt(admin);
    res.json({message : "Logged in Successfully" , token});
  }else{
    res.status(401).send("Admin not found");
  }
});

app.post('/admin/courses',authenticateJwt,(req, res) => {
  // logic to create a course
  const Course = req.body;
  courseId = COURSES.length+1;
  COURSES.push(Course);
  res.json({message : "Course Created Successfullt",COurse_ID : courseId});
});

app.put('/admin/courses/:courseId',authenticateJwt, (req, res) => {
  // logic to edit a course
  const course = req.body;
  const courseId = parseInt(req.params.courseId);
  const courseIndex = COURSES.findIndex(a=>a.id === courseId);
  if(courseIndex>-1){
    COURSES[courseIndex] =  course;
    res.status(200).json({message:"Course Updates Successfully"})
  }else{
    res.status(400).send("Course Not Found");
  }
});

app.get('/admin/courses',authenticateJwt , (req, res) => {
  // logic to get all courses
  res.json(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
