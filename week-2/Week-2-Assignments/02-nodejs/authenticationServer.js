/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or inval
    id.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3001;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(express.json());
var user = [];

app.post('/signup',(req,res)=>{
  var inputUser = req.body;
  var userFound = false;
  for(let i=0 ; i<user.length ; i++) {
    if(user[i].email === inputUser.email){
      userFound = true;
      break;
    }
  }
  if(!userFound){
    let newUser = inputUser;
    user.push(newUser);
    res.status(201).send("Signup Done!");
  }else{
    res.status(400).send("User already exists!");
  }
});


app.post('/login',(req,res)=>{
  var log = req.body;
  let userFound = null;
  for(let i=0 ; i<user.length;i++){
    if(user[i].email === log.email && user[i].password === log.password){
      userFound = user[i];
      break;
    }    
  }
  if(userFound){
  res.status(200).json({
    Name: userFound.name,
    Lastname : userFound.Lastname,
    Email : userFound.email
  });
  }
  else{
    res.sendStatus(400);
  }
});

app.get('/data' , (req,res)=>{
  let dataFound = [];
  let fetchedData = req.headers;
  for(let i=0 ; i<user.length ; i++){
    if(user[i].email === fetchedData.email && user[i].password === fetchedData.password){
      dataFound.push({
        Name : user[i].name,
        email: user[i].email
      });
    }
  }
  res.status(200).json(dataFound);
});
app.listen(3000);

module.exports = app;
