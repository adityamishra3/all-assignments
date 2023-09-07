import React from "react";
import { useNavigate } from "react-router-dom";
/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const navigate = useNavigate();
    const handleSubmit =()=>{
        fetch('http://localhost:3000/admin/login',{
            method:"POST",
            body:JSON.stringify({username:email,password}),
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>{
            res.json().then(data=>{
                console.log(data);
                localStorage.setItem("token",data.token);
                navigate('/about')
            })
        })
    }
    return <div>
        <h1>Login to admin dashboard</h1>
        <br/>
        Email - <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br/>
        Password - <input type="text" onChange={e=>setPassword(e.target.value)} />
        <br />
        <button onClick={handleSubmit}>Login</button>
        <br/>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;