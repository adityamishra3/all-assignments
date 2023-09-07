import React from "react";
import Card from '@mui/material/Card'
function ShowCourses() {
    const [courses, setCourses] = React.useState([]);

    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    React.useEffect(()=>{
        fetch('http://localhost:3000/admin/courses',{
            method:"GET",
            headers:{
                'Content-Type':'application/json',
                'Authorization' : "Bearer " + localStorage.getItem("token")
            }
        }).then(res=>{
            res.json().then(data=>{
                console.log(data);
                setCourses(data.courses);
            })
        })
    },[])
    return <div style={{
        display:"flex",
        flexWrap:"wrap",
        justifyContent:"center",
    }}>
        {courses.map(c=>{
            return <Course title={c.title} description={c.description}/>
        })}
    </div>
}

function Course(props) {
    return <div >
        <Card sx={{maxWidth:200, backgroundColor:"grey", textAlign:"center", margin:10, minHeight:100}}>
            <h1>{props.title}</h1>
            <p>{props.description}</p>
        </Card>
    </div>
}

export default ShowCourses;