import React,{ useState } from 'react';
import Alltodos from './Alltodos';
import Todoinput from './Todoinput';
// import useParams from 'react-router-dom';
function App() {
  return (
    <>
      <div>
        <h1>Todo App</h1>
          <Todoinput></Todoinput>
          <Alltodos></Alltodos>
      </div>
    </>
  )
}
export default App
