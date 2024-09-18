const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs');
app.use(express.json());

try {
  let ADMINS = JSON.parse(fs.readFileSync('admins.json', 'utf8'));
  let USERS = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  let COURSES = JSON.parse(fs.readFileSync('courses.json', 'utf8'));
} catch { // so that our code doesnt throw error when the files are empty.
  ADMINS = [];
  USERS = [];
  COURSES = [];
}
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

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let admin = req.body;
  adminExists = ADMINS.find(a=>a.username == admin.username);
  if(adminExists){
    res.json({message: "Admin already exists"});
  }else{
    ADMINS.push(admin);
    fs.writeFileSync('admin.json',JSON.stringify(ADMINS));
    const token = jwt.sign(admin,secret,{expiresIn:'1h'});
    res.json({message: "admin created successfully", token});
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
});

app.post('/admin/courses',authentiacteJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = COURSES.length+1;
  COURSES.push(course);
  fs.writeFileSync('courses.json',JSON.stringify(COURSES));
  res.json({message: "course added successfully",id : course.id});
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username);
  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = { username, password ,purchasedCourses : []};
    USERS.push(newUser);
    fs.writeFileSync('users.json', JSON.stringify(USERS));
    const token = jwt.sign({ username, role: 'user' }, secret, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId',authentiacteJwt, (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  const course = COURSES.find(c=>c.id == courseId);
  if(course){
    const user = USERS.find(u=> u.username == req.user.username);//req.user we got from authenticateJwt
    user.purchasedCourses.push(course);
    fs.writeFileSync('users.json',JSON.stringify(USERS));
    res.json("course purchased successfully");
  }else{
    res.sendStatus(404);
  }


});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
