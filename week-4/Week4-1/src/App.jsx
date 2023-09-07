import React from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function useTodos(){//anything that starts with a use is a hook and anything that starts with a capital letter is a component
  const [todos , setTodos] = React.useState([]);
  React.useEffect(()=>{
    fetch("http://localhost:3000/todos",{
      method : "GET"
    }).then((res)=>{
      res.json().then((data)=>{
        console.log(data);
        setTodos(data);
      })
    });

    setInterval(()=>{
      fetch("http://localhost:3000/todos",{
        method : "GET"
      }).then((res)=>{
        res.json().then((data)=>{
          console.log(data);
          setTodos(data);
        })
      });
    },1000);

  },[]);

  return todos;
}
function App() {
  const todos = useTodos();
  return (
    <>
      {todos.map(todos=>{
        return <div>
          {todos.title}
          <br />
          {todos.description}
          <br />
          <button >Delete</button>
          </div>
      })}
    </>
  )
}
export default App
