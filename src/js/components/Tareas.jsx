import React from 'react';
import { useState, useEffect } from "react";



const Tareas = () => {


  const [tareaNueva, setTareaNueva] = useState(""); //  esta es cada tarea nueva que entra
  const [tareas, setTareas] = useState([]); //esta es la lista de tareas
  const [editarIndice, setEditarIndice] = useState(null);
  // const [todos, setTodos] = useState([]);

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
      //no lleva ni body ni headers 
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
        setTareas(data.todos);
      })
      //manejo de errores . captura cualquier error 
      .catch((error) => {
        console.error("Error:", error);
      });
  }


  //AGREGAR, ACTUALIZAR TAREAS ***********
  function postTodosApi(nuevasTareas) {
    console.log(JSON.stringify(nuevasTareas, null, 2) );

    fetch("https://playground.4geeks.com/todo/todos/heidydb",
      {
        method: "POST",
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

   function putTodosApi(nuevasTareas) { //actualizar uba tarea 
    console.log(nuevasTareas )

    fetch("https://playground.4geeks.com/todo/todos/heidydb",
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


 /* function deleteTodosApi(nuevasTareas) {
    fetch("https://playground.4geeks.com/todo/users/heidydb",
      {
        method: "DELETE",
      })
      .then((response) => {
        if (!response.ok) throw new Error("Error al ELIMINAR tareas");
        return response.json();
      })
      .then((data) => {
        console.log("Tarea eliminada:", data);
        setTareas(nuevasTareas); // 
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      }*/
  

  //MODIFICO CADA FUNCION PARA SINCRONIZAR CON LA API (agregar(), quitar(), guardaEdicion(), realizada())

  const agregar = () => { // esta tarea se agrega al dar enter en el teclado
    if (tareaNueva !== "") {
      const nuevasTareas =  { label: tareaNueva, is_done: false }; // añado la tarea 
      // nueva a la lista de tareas Susutituyo texto por label, completado por is_done , pues asi esta hecha la API
      postTodosApi(nuevasTareas);
      setTareaNueva(""); //limpio el input para la proxima entrada 
    }
  }

  const editar = (index) => {

    setTareaNueva(tareas[index].label); // carga el texto al input. reemplazo texto por label 
    setEditarIndice(index); // marca qué tarea se está editando
  };

  const guardarEdicion = () => {
    if (tareaNueva.trim() === "") return;
    const nuevasTareas = [...tareas]; // asigno nueva direccion de memoria al array , no uso el que ya existe sino una copia
    nuevasTareas[editarIndice].label = tareaNueva;
    postTodosApi(nuevasTareas);
    setTareaNueva("");
    setEditarIndice(null);
  };

 /* const quitar = (indiceEliminar) => { // esta tarea se quitara con el evento onClick a la X
    const nuevasTareas = tareas.filter((_, index) => index !== indiceEliminar); //se hace un nuevo arreglo
    //sin  el elemento cuyo indice es indiceEliminar
    postTodosApi(nuevasTareas); // no uso el useState  setTareas, sino que trabajo en la API 
  }*/

  const realizada = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index].is_done = !nuevasTareas[index].is_done; // si es falso recibe true ...si ess true recibe falso
   postTodosApi(nuevasTareas);
    setTareas(nuevasTareas); //esto era para trabajar local con estado 
     // ahora trabajo en la API para no perder los valores 
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