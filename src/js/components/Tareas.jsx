import React from 'react';
import { useState, useEffect } from "react";



const Tareas = () => {


  const [tareaNueva, setTareaNueva] = useState(""); //  esta es cada tarea nueva que entra
  const [tareas, setTareas] = useState([]); //esta es la lista de tareas
  const [editarIndice, setEditarIndice] = useState(null);

  useEffect(() => {
    crearUsuario();
  }, []);


  function crearUsuario() {
    fetch("https://playground.4geeks.com/todo/users/heidydb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([])
    })
      .then(response => {
        if (response.status === 400) {
          console.log("Usuario ya existe, obteniendo tareas...");
          getTodos();
        } else if (!response.ok) {
          throw new Error("Error al crear usuario");
        } else {
          console.log("Usuario creado");
          getTodos();
        }
      })
      .catch(error => console.error("Error creando usuario:", error));
  }


  function getTodos() {
    //la URI, el metodo. lleva coma entre la URI y el metodo
    //fetch hace la peticion 
    fetch("https://playground.4geeks.com/todo/users/heidydb",
      {
        method: "GET"
      })
      //el metodo GET no lleva ni body ni headers 

      //codigo del status , info en formato json .
      .then((response) => {
        console.log(response);
        if (!response.ok) throw new Error(`Error al obtener tareas  ${response.status}`);//si el codigo es 400 0 500
        //  enviar error que sera tratado por el catch 
        return response.json(); // sino trae la respuest json convertida a javascript
      })
      //info en formato JavaScript . //  maneja la respuesta si todo va bien (response.ok es un 200)
      .then((data) => {
        console.log(data);
        if (Array.isArray(data.todos)) { //para garntizar que tareas siempre se aun array para luego hacerle .map
        setTareas(data.todos);
      } else {
        setTareas([]);
         }
      })
      //manejo de errores . captura cualquier error 
      .catch((error) => {
        console.error("Error:", error);
        setTareas([]); // Evita que tareas quede undefined
      });
  }

  //MODIFICO CADA FUNCION PARA SINCRONIZAR CON LA API (agregar() con POST, quitar() con DELETE, guardaEdicion() con PUT, realizada() con PUT)
  //********* AGREGAR ********/
  const agregar = () => { // esta tarea se agrega la tarea al dar enter en el teclado
    if (tareaNueva !== "") {
      const nuevasTareas = { label: tareaNueva, is_done: false}; // añado la tarea 
      // nueva a la lista de tareas Susutituyo texto por label, completado por is_done , pues asi esta hecha la API

fetch("https://playground.4geeks.com/todo/todos/heidydb",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevasTareas) // envio la nueva tarea a la API 
      })
      .then((response) => {
        if (!response.ok) throw new Error("Error al guardar tareas");
        return response.json();
      })
      .then((data) => {
        console.log("Tarea sincronizada con la API:", data);
        setTareas([...tareas, data]); // actualiza localmente también el estado agregando la nueva tarea al arreglo 
      })
      .catch((error) => {
        console.error("Error:", error);
      });
        //postTodosApi(nuevasTareas);
      setTareaNueva(""); //limpio el input para la proxima entrada 
    }
  }


  const editar = (index) => { //esta funcion no ncesito modificarla porque ella no hace nada con la API, solo graficamente
    setTareaNueva(tareas[index].label); // carga el texto al input. solos reemplazo .texto por .label 
    setEditarIndice(index); // marca qué tarea se está editando
  };

  //********GUARDAR EDICION *******/
  const guardarEdicion = () => { // esta funcion guarda despues de modificar una tarea. y usa el PUT para guardar en la API
    if (tareaNueva.trim() === "") return;
    const tareaEditada = { ...tareas[editarIndice], label: tareaNueva }
    fetch(`https://playground.4geeks.com/todo/todos/${tareaEditada.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tareaEditada)
      })
      .then((response) => {
        if (!response.ok) throw new Error(`Error al actualizar la tarea con id ${tareaEditada.id}`);
        return response.json();
      })
      .then((data) => {
        console.log("Tarea sincronizada con la API:", data); 
        const nuevasTareas = [...tareas];
        nuevasTareas[editarIndice] = data;
        setTareas(nuevasTareas); //actualizo el estado 
        setTareaNueva(""); //limpio el input donde edite el texto
        setEditarIndice(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

    //**********ELIMINAR**************************
    const quitar = (indiceEliminar) => { // esta tarea se quitara con el evento onClick a la X
    const tareaAEliminar = { ...tareas[indiceEliminar] } // aqui esta solo el objeto que voy a eliminar 
    console.log("esta es la tarea q quiero eliminar",  tareaAEliminar) 
    console.log("Eliminando tarea con ID:", tareaAEliminar.id, tareaAEliminar);
      fetch(`https://playground.4geeks.com/todo/todos/${tareaAEliminar.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }, 
      })
      .then((response) => {
         console.log("Código de respuesta:", response.status); // estoy probando si hay error 400 o exito 200
        if (!response.ok) throw new Error("error al eliminar la tarea");
        console.log("Tarea eliminada correctamente");
        const arregloSinTarea = tareas.filter((_, index) => index !== indiceEliminar); //se hace un nuevo arreglo
        //sin  el elemento cuyo indice es indiceEliminar , asi se elimina del array
        setTareas(arregloSinTarea); // actializo el estado sin la tarea  
        //con el metodo DELETE no hace falta el segundo .then()
      
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
   

  const realizada = (editarIndice) => { // en esta funcion marco en el CHECKBOX las tareas ya hechas 
    const tareaEditada = { ...tareas[editarIndice], is_done: !tareas[editarIndice].is_done}// si es falso recibe true 
    // ...si ess true recibe falso al marcar y desmarcar  
        
     fetch(`https://playground.4geeks.com/todo/todos/${tareaEditada.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tareaEditada)
      })
      .then((response) => {
        if (!response.ok) throw new Error(`Error al marcar como hecha la tarea con id ${tareaEditada.id}`);
        return response.json();
      })
      .then((data) => {
        console.log("Tareas sincronizadas:", data); 
        const nuevasTareas = [...tareas];
        nuevasTareas[editarIndice] = data;
        setTareas(nuevasTareas);
    
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  


  return (
    <div>

      <div className=" contenedor container s-flex align-items-center " role="alert" >

        <div> {/* introducir un valor (una tarea) al dar enter */}
          <input type="text " className="form-control mt-110px"
            placeholder='What needs to be is is_done?'
            value={tareaNueva}
            onChange={(e) => { setTareaNueva(e.target.value) }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (editarIndice !== null) {
                  guardarEdicion();
                } else {
                  agregar();
                }
              }
            }} />
        </div>

        <div>
          <ul className="list-group mt-3 w-100">
            {/* map recorre el arreglo devolviendo el valor en cada posicion */}
            {tareas.map((todo, index) => (
              <li key={index} className="list-group-item 
                  d-flex justify-content-between align-items-center">
                {/* si completada es true, tacha la tarea */}
                <span className={todo.is_done ? "text-decoration-line-through text-muted" : ""}>
                  {todo.label}
                </span>

                {/* ckeckbox para marca tarea como hecha */}
                <div className="form-check">
                  <input className=" me-2 m-auto form-check-input" type="checkbox" value=""
                    id="checkDefault" checked={todo.is_done}
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
        <div className="">{tareas.length} Item left</div>
      </div>
    </div>
  )

}
export default Tareas;