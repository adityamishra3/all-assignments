const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
app.use(express.json());


//defining the mongoose schema

const userSchema = new mongoose.Schema({
  username : {type: String},
  password : String,
  purchasedCourses : [{type: mongoose.Schema.Types.ObjectId , ref : 'Course'}]
});
const adminSchema = new mongoose.Schema({
  username : String,
  password : String
});
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});
//Define user models

const User = mongoose.model('UserDb',userSchema);
const Admin = mongoose.model('Admin',adminSchema);
const Course = mongoose.model('Course',courseSchema);

const secret = "superSecret";
const authentiacteJwt = (req,res,next)=>{
  const authHeader = req.headers.authorization;

  if(authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token,secret,(err,user)=>{
      if(err){
        res.send(err).status(403);
      }else{
      req.user = user;
      next();
      }
    })
  }else{
    res.sendStatus(401);
  }
}

//COnnect to Db
mongoose.connect("mongodb+srv://fnckingrestart2024:JvnqTNbXVDARGLGi@cluster0.6uzkp.mongodb.net/",{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" })


// Admin routes
app.post('/admin/signup',async (req, res) => {
  // logic to sign up admin
  const {username,password} = req.body;
  let admin = await Admin.findOne({username});
  if(admin){
    res.sendStatus(403);
  }else{
    const newAdmin = new Admin({username, password});
    await newAdmin.save();
    const token = jwt.sign({username, role:'admin'}, secret, {expiresIn:'1h'});
    res.json({message: "admin created successully"});
  }
});

app.post('/admin/login',async (req, res) => {
  // logic to log in admin
  const {username,password} = req.headers;
  let admin = await Admin.findOne({username,password});
  if(admin){
    const token = jwt.sign({username,role:'admin'},secret,{expiresIn:'1h'});
    res.json({message:"admin logged in successfully", token});
  }else{
    res.json({message:"admin not found"}).status(403);
  }
});

app.post('/admin/courses',authentiacteJwt ,async (req, res) => {
  // logic to create a course
  const course = req.body;
  const newCourse = new Course(course);
  await newCourse.save();
  res.json({message:"course created!!!",courseId:newCourse.id});
});

app.put('/admin/courses/:courseId',authentiacteJwt,async (req, res) => {
  // logic to edit a course
  const course = Course.findByIdAndUpdate(req.params.courseId,req.body);
  if(course){
    res.send("updated");
  }else{
    res.send("Error");
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup',async (req, res) => {
  // logic to sign up user
  const user = req.headers;
  let userExist = await User.findOne({username:user.username});
  if(userExist){
    res.sendStatus(401);
  }else{
    const payload = {username: user.username,password:user.password}
    const token = jwt.sign(payload,secret,{expiresIn:'1h'});
    const newUser = new User({username:user.username,password:user.password});
    await newUser.save();
    res.json({message:"User created!!!",id:newUser.id,token})
  }
});

app.post('/users/login',async (req, res) => {
  // logic to log in user
  const {username,password} = req.headers;
  const user = await User.findOne({username,password});
  if(user){
    const payload = {username};
    const token = jwt.sign(payload,secret);
    res.json({message:"loggin in",token});
  }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId',authentiacteJwt,async (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if(course){
    const username = req.user.username;
    const user = await User.findOne({username});
    user.purchasedCourses.push(course);
    await user.save();
    res.json({Message:"COurse purchased"}).status(200);

  }else{
    res.sendStatus(404);
  }
});

app.get('/users/purchasedCourses',authentiacteJwt,async (req, res) => {
  // logic to view purchased courses
  const username = req.user.username;
  const user = await User.findOne({username});
  if(user){
    await user.populate('purchasedCourses');
    res.json({Courses:user.purchasedCourses})
  }else{
    res.sendStatus(403);
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
