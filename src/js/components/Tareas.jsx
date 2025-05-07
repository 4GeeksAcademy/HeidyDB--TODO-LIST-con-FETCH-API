import React from 'react';
import { useState } from "react";



const Tareas = () => {


  const [tareaNueva, setTareaNueva] = useState(""); //  esta es cada tarea nueva que entra
  const [tareas, setTareas] = useState([]); //esta es la lista de tareas
  const [editarIndice, setEditarIndice] = useState(null);

 // const apiUrl = "https://playground.4geeks.com/todo/users/heidydb";


 /*useEffect(() => {
  // Verifica si el usuario existe, si no, lo crea
  fetch(apiUrl)
    .then((res) => {
      if (res.status === 404) {
        return fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        });
      }
      return res;
    })
    .then(() => getTodos())
    .catch((err) => console.error("Error al inicializar usuario:", err));
}, []);*/

  function getTodos(){
    //la URI, el metodo. lleva coma entre la URI y el metodo
    //fetch hace la peticion 
    fetch("https://playground.4geeks.com/todo/users/heidydb" ,
      {
        method: "GET"
      })
      //codigo del status , info en formato json .
    .then((response) => {
      if (!response.ok) throw new Error("Error al obtener tareas");//si el codigo es 400 0 500
      //  enviar error que sera tratado por el catch 
      return response.json();
    })
    //info en formato JavaScript . //  maneja la respuesta si todo va bien (response.ok es un 200)
    .then((data) => {
      setTareas(data.todos);
    })
    //manejo de errores . captura cualquier error 
    .catch((error) => {
      console.error("Error:", error);
    });
  }
  }
 
//AGREGAR TAREAS ***********
  function syncTareasConAPI(nuevasTareas) {
    fetch("https://playground.4geeks.com/todo/users/heidydb", 
      {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevasTareas)
    })
    .then((response) => {
      if (!response.ok) throw new Error("Error al guardar tareas");
      return response.json();
    })
    .then((data) => {
      console.log("Tareas sincronizadas:", data);
      setTareas(nuevasTareas); // actualiza localmente también
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }
  
//MODIFICO CADA FUNCION PARA SINCRONIZAR CON LA API (agregar(), quitar(), guardaEdicio(), realizada())

   const agregar = () => { // esta tarea se agrega al dar enter en el teclado
    if (tareaNueva !== "") {
      const nuevasTareas = [...tareas, { label: tareaNueva, done: false }]; // añado la tarea 
      // nueva a la lista de tareas Susutituyo texto por label, completado por done , pues asi esta hecha la API
      syncTareasConAPI(nuevasTareas);
      setTareaNueva(""); //limpio el input para la proxima entrada 
    }
   }

   const editar =(index)=> {
    
      setTareaNueva(tareas[index].label); // carga el texto al input. reemplazo texto por label 
      setEditarIndice(index); // marca qué tarea se está editando
   };

   const guardarEdicion = () => {
      if (tareaNueva.trim() === "") return;
      const nuevasTareas = [...tareas]; // asigno nueva direccion de memoria al array , no uso el que ya existe sino una copia
      nuevasTareas[editarIndice].label = tareaNueva;
      syncTareasConAPI(nuevasTareas);
      setTareaNueva("");
      setEditarIndice(null);
   };

   const quitar = (indiceEliminar) => { // esta tarea se quitara con el evento onClick a la X
   const nuevasTareas= tareas.filter((_, index) => index !== indiceEliminar); //se hace un nuevo arreglo
    //sin  el elemento cuyo indice es indiceEliminar
    syncTareasConAPI(nuevasTareas); // no0 uso el useState  setTareas, sino que trabajo en la API 
   }    

   const realizada = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index].done = !nuevasTareas[index].done; // si es falso recibe true ...si ess true recibe falso
    //setTareas(nuevasTareas); esto era para trabajar local con estado 
    syncTareasConAPI(nuevasTareas); // ahora trabajo en la API para no perder los valores 
  };

   
  return (
    <div>

      <div className=" contenedor container s-flex align-items-center " role="alert" >

        <div> {/* introducir un valor (una tarea) al dar enter */}
          <input type="text " className="form-control mt-110px"
            placeholder='What needs to be done?'
            value={tareaNueva}
            onChange={(e) => { setTareaNueva(e.target.value) }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (editarIndice !== null) {
                  guardarEdicion();
                } else {
                  agregar();
              }
            }}} />
        </div>

        <div>
            <ul className="list-group mt-3 w-100">
            {/* map recorre el arreglo devolviendo el valor en cada posicion */}
            {tareas.map((tarea, index) => (
              <li key={index} className="list-group-item 
                  d-flex justify-content-between align-items-center">
                  {/* si completada es true, tacha la tarea */}
                  <span className={tarea.done ? "text-decoration-line-through text-muted" : ""}>
                  {tarea.label}
                  </span>

                  {/* ckeckbox para marca tarea como hecha */}
                  <div className="form-check">
                    <input className=" me-2 m-auto form-check-input" type="checkbox" value=""
                    id="checkDefault" checked={tarea.done}
                    onChange={() => realizada(index)} />

                   {/* boton editar tarea */}
                   <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary me-2"
                    aria-label="Edit"
                    onClick={() => editar(index)} >
                    <i className="fa-solid fa-pencil"></i>
                   </button>


                  {/* X para cerrar tarea */}
                   <button type="button" className="btn-close me-2 m-auto" aria-label="Close"
                    onClick={() => quitar(index)}></button>
                  </div>

              </li>
            ))}  { /*  cierro el map, (cuando es codigo java script lo ponemos entre llaves) */}
          </ul>
        </div>
        <hr className="my-2 border border-ligth" />
        <div className="">{tareas.length}   Item left</div>
      </div>
    </div>
  )
}

export default Tareas;