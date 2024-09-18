const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(cors());
let ADMINS = [];
let USERS = [];
let COURSES = [];

const secret = "53CRET";
const authenticateJwt = (req, res, next) => {
  let auth = req.headers.authorization;
  if (auth) {
    const token = auth.split(' ')[1];  // Extract token from 'Bearer <token>'
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);  // Send 403 if token is invalid
      }
      req.user = user;  // Attach user to request object
      next();  // Proceed to the next middleware/route
    });
  } else {
    res.sendStatus(401);  // No token was provided
  }
};

const generateJwt=(user)=>{
  const payload = {username : user.username};
  return jwt.sign(payload,secret,{expiresIn:'1h'});
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let admin = req.headers;
  let adminExists = ADMINS.find(a => a.username === admin.username);
  if(adminExists){
    res.json({message:"Admin already exists"})
  }else{
    let token = generateJwt(admin);
    ADMINS.push(admin);
    console.log(token);
    res.json({message:"admin created successfully", token : token});
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    const token = generateJwt(admin);
    res.json({ message: "Logged in Successfully", token });
  } else {
    res.status(401).send("Admin not found");
  }
});


app.post('/admin/courses', authenticateJwt, (req, res) => {
  const newCourse = req.body;
  newCourse.id = COURSES.length + 1;
  COURSES.push(newCourse);
  res.json({ message: "Course Created Successfully", courseId: COURSES.length+1});
});


app.put('/admin/courses/:courseId',authenticateJwt, (req, res) => {
  // logic to edit a course
  const course = req.body;
  const courseId = parseInt(req.params.courseId);
  const courseIndex = COURSES.findIndex(a=>a.id === courseId);
  if(courseIndex>-1){
    COURSES[courseIndex] = course;
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
