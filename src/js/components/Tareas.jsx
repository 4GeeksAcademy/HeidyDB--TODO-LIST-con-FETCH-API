import React from 'react';
import { useState } from "react";



const Tareas = () => {


  const [tareaNueva, setTareaNueva] = useState(""); //  esta es cada tarea nueva que entra
  const [tareas, setTareas] = useState([]); //esta es la lista de tareas

  const agregar = () => { // esta tarea se agrega al dar enter en el teclado
    if (tareaNueva !== "") {
      setTareas([...tareas, tareaNueva]); // añado la tarea nueva a la lista de tareas
      setTareaNueva(""); //limpio el input para la proxima entrada 
    }
  }

  const quitar = (indiceEliminar) => { // esta tarea se quitara con el evento onClick a la X
      setTareas(tareas.filter((_, index) => index !== indiceEliminar)); //se hace un nuevo arreglo
      //sin  
  }   

  return (
    <div>

      <div className="container s-flex align-items-center " role="alert" >

        <div> {/* introducir un valor (una tarea) */}
          <input type="text " className="form-control mt-100px"
            placeholder='What needs to be done?'
            value={tareaNueva} 
            onChange={(e) => { setTareaNueva(e.target.value) }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                agregar();
              }
            }} />
        </div>
        <div>
          <ul className="list-group mt-3 w-100">
            {/* recorro el arreglo devolviendo el valor en cada posicion */}
            {tareas.map((value, index) => (
              <li key={index} className="list-group-item 
                d-flex justify-content-between align-items-center">
                {value}
                <button type="button" className="btn-close me-2 m-auto" aria-label="Close"
                  onClick={() => quitar(index)}></button>
              </li>
            ))}  { /*  cuando es codigo java script lo ponemos entre llaves */}
          </ul>
        </div>
        <hr className="my-2 border border-ligth" /> 
        <div className="">{tareas.length}   Item left</div>
     </div>
    </div>
  )
}

export default Tareas;