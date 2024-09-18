import { useEffect, useState } from "react";

function Alltodos(){
    let [todo,setTodo] = useState([]);

    useEffect(()=>{ 
        fetch("http://localhost:3000/todos",{
            method:"GET",
        })  
        .then(res=>{
            res.json().then(data=>{
                setTodo(data);
                console.log(data);
            })
        })
    },[])
    const handleDelete = ((id)=>{
        fetch("http://localhost:3000/todos/"+id,{
            method:"DELETE",
        }).then(res=>{
            res.json().then(data=>{
                console.log(data);
                location.reload();
            })
        })
    });
    return(
        <div>
            {todo.map(todo=>{
                return <div key={todo.id}>
                    {todo.title} <br/>
                    {todo.description} <br />
                    <button onClick={()=>handleDelete(todo.id)}>Delete</button>
                </div>
            })}
        </div>
    )
}

export default Alltodos;
