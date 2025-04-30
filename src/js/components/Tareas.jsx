import React from 'react';
import { useState } from "react";



const Tareas = () => {


  const [tareaNueva, setTareaNueva] = useState(""); //  
  const [tareas, setTareas] = useState(["estudiar", "trabajar"]); //este es el arreglo de tareas


  const agregar = () => { // esta tarea se agrega al dar enter en el teclado
    if (tareaNueva !== "") {
      setTareas([...tareas, tareaNueva]); // añado la tarea nueva al arreglo de tareas
      setTareaNueva("");
    }
  }


  /*const quitar = () => { // esta tarea se quitara con el evento hover cdo de click a la X
    let selecc = setTareas[0];
    while (let i < setTareas.length) {
      if (selecc === setTareas[i]) {
        setTareas[i] = " ";
      } else { i++ }
    }
  }   */

  return (
    <div>

      <div className="container s-flex align-items-center " role="alert" >
       
      <div>
            <input type="text " className = "form-control mt-100px"
              placeholder='What needs to be done?'
              onChange={(e) => { setTareaNueva(e.target.value) }} 
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  agregar();
                }}} />

          </div>
          <div>
            <ul className="list-group mt-3 w-100">

              {tareas.map((value, index, array) => ( 
                <li key={index} className="list-group-item 
                d-flex justify-content-between align-items-center">
                {value}
                <button type="button" className="btn-close me-2 m-auto" aria-label="Close" 
                onClick={() => eliminar(index)}></button>

                </li>
              ))}  { /*  cuando es codigo java script lo ponemos entre llaves */ }
            </ul>
          </div>
          <div className="">{tareas.length}Item left</div>

          
        </div>
        </div>

      )
}

      export default Tareas;