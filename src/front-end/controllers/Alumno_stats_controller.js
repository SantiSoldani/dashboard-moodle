/**
 * ARCHIVO CONTROLADOR DEL MODULO DE ESTADISTICAS EMBEBIDAS DEL ALUMNO
 * 
 * A TRAVES DE LOS PARAMETROS DE LA URL LLAMADA LA IDEA ES FILTRAR POR SI EL QUE LE LLAMA ES UN ALUMNO O UN PROFESOR APRA PROTEGER INFORMACION SENSIBLE
 * 
 * ADEMAS USAMOS LOS URL PARAMS PARA AVERIGUAR CUAL ES EL ALUMNO DEL CUAL SE QUIERA VER LA INFORMACION
 * 
 */

import {HandleGet_alumnos} from "../models/Alumno.js"

const params = new URLSearchParams(window.location.search); //parametros esperados -> alumno && modo

const modo = params.get('modo') ; const alumno_dni = params.get('alumno');
/** 
const alumno = HandleGet_alumnos(alumno_dni)
alumno = alumno[0]; //como la funcion devuelve un arreglo entonces me quedo con el primero porque es el unico que trae, podria verificar si que es que me trae algo
*/
var alumno = {
    nombre: "fulano",
    apellido:"fernandez",
    documento: "31243214",
    carrera:"ingenieria civil",
    curso:"1er anio",
    email:"a@x.com",
    telefono:"123456",
    estado:"amarillo"
}

window.addEventListener('load', func =>{

        set_state_panel();
        set_info_panel();
        //set_encuestas(); //funcion a desarrollar

})

function set_state_panel(){
    const stats = document.getElementById('status-section');
    const estados = document.querySelectorAll(".estado-verde")
    estados.forEach(estado =>{
        estado.classList.replace("estado-verde",`estado-${alumno.estado}`);

        if(estado.querySelector("strong")){
           estado.querySelector("strong").textContent = estado.querySelector("strong").textContent.replace("Verde", alumno.estado)
        }
        else if(estado.querySelector(".status-card-state")){
            estado.querySelector(".status-card-state").textContent = estado.querySelector(".status-card-state").textContent.replace("Verde", alumno.estado)
        }
        //const texto = estado.querySelector("strong") || estado.querySelector("p .status-card-state")
        //texto.textContent.replace("Verde", alumno.estado);
        
    })    

    let nombre = stats.querySelector("h1");
    nombre.textContent = alumno.nombre; 
    
   


    
}
function set_info_panel(){

    const info_panel = document.querySelectorAll("#info-panel .info-item");

        info_panel.forEach(panel =>{
            switch(panel.querySelector("span").textContent){
                    case 'Nombre':
                        panel.querySelector("strong").textContent = alumno.nombre + alumno.apellido;
                        break;
                    
                    case  'Documento':
                        panel.querySelector("strong").textContent = alumno.documento;
                        break;
                    
                    case 'Carrera':
                        panel.querySelector("strong").textContent = alumno.carrera;
                        break;

                    case 'Curso':
                        panel.querySelector("strong").textContent = alumno.curso;
                        break;
                    
                    case 'Email':
                        panel.querySelector("strong").textContent = alumno.email;
                        break;
                    
                    case 'Telefono':
                        panel.querySelector("strong").textContent = alumno.telefono;
                        break;

                    default: break;
                }
            })
}



