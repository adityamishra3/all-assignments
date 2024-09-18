const express = require('express');
const app = express();
const body = require('body-parser');
const { Experimental_CssVarsProvider } = require('@mui/material');
app.use(express.json());
// app.use(body);
let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req,res,next)=>{
  const {username,password} = req.headers;
  let adminExist = ADMINS.find(i => i.username == username);
  if(adminExist) res.send("Admin already exists").status(403);
  else{
    req.user = adminExist; // no need to fetch the admins info again and again and can be accessed from this req.user itself
    next();
  }
}
const userAuthentication = (req,res,next)=>{
  const {username, password} = req.headers;
  let userAuthenticate = USERS.find(i => i.username == username && i.password == password);
  if(userAuthenticate){
    req.user = userAuthenticate;
    next();
  }else{
    res.send("Enter correct username or password").status(203);
  }
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let admin = req.headers;
  let adminExist = ADMINS.find(i => i.username == admin.username);
  if(adminExist) res.status(403).send("Admin already exists");
  else {
    ADMINS.push(admin);
    res.send("Admin created successfully");
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let admin = req.headers;
  let adminFound = ADMINS.find(i=>i.username == admin.username && i.password == admin.password);
  if(adminFound){
    res.send("Admin logged in successfully");
  }else{
    res.send("wrong username or password");
  }
});
let courseId = 1;
app.post('/admin/courses', (req, res) => {
  // logic to create a course
  let admin = req.headers;
  let course = req.body;
  let newCourse = {
    'courseId' : courseId,
    'title' : course.title,
    'description' : course.description,
    'price': course.price,
    'imagelink' : course.image,
    'published' : true,
    'purchased' : false
  }
  COURSES.push(newCourse);
  res.send({'message' : "Cource added successfully", 'courseId' : courseId});
  courseId++;
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  let id = req.params.courseId;
  let course = COURSES.find(i => i.courseId == id);
  let updates = req.body;
  if(course){
    Object.assign(course,body);
    // course.title = updates.title;
    // course.description = updates.description;
    // course.imagelink = updates.imagelink;
    // course.price = updates.price;
    // course.purchased = false;
    res.send("Course updated!");
  }else{
    res.send("Course not found");
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.send(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let user = req.headers;
  let userExist = USERS.find(i => i.username == user.username);
  if(userExist) {
    res.status(403).send("Admin already exists");
  }
  else {
    req.user.purchasedCourses = [];
    USERS.push(user);
    res.send("User created successfully");
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  let user = req.headers;
  let userFound = USERS.find(i=>i.username == user.username && i.password == user.password);
  if(userFound){
    res.send("User logged in successfully");
  }else{
    res.send("wrong username or password");
  }
});

app.get('/users/courses', userAuthentication,(req, res) => {
  // logic to list all courses
  res.json({courses : COURSES.filter(c=>c.published)})
});

app.post('/users/courses/:courseId', userAuthentication,(req, res) => {
  // logic to purchase a course
  const id = req.params.courseId;
  let course = COURSES.find(i => i.courseId == id);
  if(course){
    req.user.purchasedCourses.push(course);  
    course.purchased = true; 
    res.send("Course purchased successfully").status(200);
  }else{
    res.send("ERROR");
  }
});

app.get('/users/purchasedCourses',userAuthentication, (req, res) => {
  // logic to view purchased courses
  res.send(req.user.purchasedCourses);
  // or
  // res.json({purchasedCourses : COURSES.filter(c=>c.purchased)});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});