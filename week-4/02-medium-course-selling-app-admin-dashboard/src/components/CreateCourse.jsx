import React from "react";
import { useNavigate } from "react-router-dom";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [description,setDescription] = React.useState("");
    const navigate = useNavigate();
    return <div>
        <h1>Create Course Page</h1>
        Title - <input type={"text"} onChange={e => setTitle(e.target.value)} /> <br />
        Description - <input type={"text"} onChange={e => setDescription(e.target.value)} /> <br />
        <button onClick={() =>{
            fetch('http://localhost:3000/admin/courses',{
                method:"POST",
                body:JSON.stringify({title,description}),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization' : "Bearer " + localStorage.getItem("token")
                }
            }).then(res=>{
                res.json().then(data=>{
                    console.log(data);
                })
            })
        }}>Create Course</button>
        <button onClick={()=>{
            navigate('/courses');
        }}>View Courses</button>
    </div>
}
export default CreateCourse;