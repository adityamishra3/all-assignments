import { useState,useEffect } from "react";

function Todoinput(){
    let [title,setTitle] = useState([]);
    let [description,setDesc] = useState([]);
    let handleChange = (e)=>{
        setTitle(e.target.value);
        console.log(e.target.value);
    }
    let onPress = (e)=>{
        const input = {title , description}
        fetch("http://localhost:3000/todos",{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(input)
    }).then((res)=>{
        res.json().then(data=>{
            console.log(data)
            location.reload();
        })
    })
    }
    return <div>
        <input type="text" onChange={handleChange}/> <br /> <br /> 
        <input type="text" onChange={(e)=>{
            setDesc(e.target.value);
            console.log(e.target.value);
        }}/> <br />
        <button onClick={onPress}>Submit</button>
    </div>

}
export default Todoinput;