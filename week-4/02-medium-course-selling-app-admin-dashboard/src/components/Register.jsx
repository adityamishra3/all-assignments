import React from "react";
// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState('');
    
    const handleClick = ()=>{ (fetch('http://localhost:3000/admin/signup',{
        method:"POST",
        body:JSON.stringify({username: email , password}),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(res=>{
        console.log(res)
        res.json().then(data=>{
            localStorage.setItem('token',data.token);
            console.log(data.token)
        })
    }))}
    return <div>
        <h1>Register to the website</h1>
        <br/>
        <input type={"text"} onChange={(e)=>{
            setEmail(e.target.value);
            console.log(e.target.value);
        }}/> <br />
        <input type={"text"} onChange={(e)=>{
            setPassword(e.target.value);
            console.log(e.target.value);
        }}/> <br />
        <button onClick={handleClick}>Submit</button>
        <br/>
        Already a user? <a href="/login">Login</a>
    </div>
}

export default Register;