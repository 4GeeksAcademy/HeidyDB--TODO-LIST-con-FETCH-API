import React from "react";
import Tareas from "./Tareas";


//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	return (
		<div >
           
		   <h1  class="display-5 text-center"> To Do List</h1>
			<Tareas />
			
		</div>
	);
};

export default Home;