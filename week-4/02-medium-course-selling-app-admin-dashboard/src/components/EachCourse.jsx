import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";

function EachCourse(){
    let { courseId } = useParams();
    const [courses,setCourses] = useState([]);
    useEffect(()=>{fetch('http://localhost:3000/admin/courses',{
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
    },[]);
    return  <div>
        {courseId}
    </div>
}
export default EachCourse;