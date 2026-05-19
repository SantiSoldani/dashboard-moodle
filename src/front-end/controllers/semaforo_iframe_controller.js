/**CONTROLADOR DE EL IFRAME DE LOS SEMAFOROS -> TRABAJOS:
 * 
 * - COMUNICARSE CON EL MODELO DE ALUMNOS PARA OBTENER LOS DATOS DE LOS SEMAFOROS DE LOS ALUMNOS
 * - CARGAR LOS SEMAFOROS Y LA INFORMACION DE CADA ALUMNOS POR MEDIO DE UN IFRAME
 * - ACTUALIZAR LOS SEMAFOROS EN TIEMPO REAL SI ES NECESARIO
 * - PODRIA DESARROLLARSE ALGUN CAMPO PARA FILTRAR LOS ALUMNOS POR NOMBRE, Y SITUACION DEL SEMAFORO
 * 
 * 
 */

import { HandleGet_alumnos } from '../models/Alumno.js';



//IMPORTAR DATOS DE TODOS LOS ALUMNOS DE LA BASE DE DATOS
//POR AHORA USO EL SIGUIENTE DATA_SET DE PRUEBA, PERO SE DEBERIA REEMPLAZAR POR UNA CONSULTA A LA BASE DE DATOS PARA OBTENER LOS DATOS REALES DE LOS ALUMNOS Y SUS SEMAFOROS
var alumnos = [
    { id: 1, nombre: 'Mateo', apellido: 'González', documento: '44322111', carrera: 'Ingeniería Civil', curso: '1er año', estado: 'Verde' },
    { id: 2, nombre: 'Sofía', apellido: 'Pérez', documento: '45133445', carrera: 'Ingeniería Industrial', curso: '2do año', estado: 'Amarillo' },
    { id: 3, nombre: 'Lucas', apellido: 'Rodríguez', documento: '46988723', carrera: 'Ingeniería Informática', curso: '3er año', estado: 'Rojo' },
    { id: 4, nombre: 'Camila', apellido: 'Fernández', documento: '47222345', carrera: 'Ingeniería Electrónica', curso: '1er año', estado: 'Verde' },
    { id: 5, nombre: 'Martín', apellido: 'Gómez', documento: '48111222', carrera: 'Ingeniería Mecánica', curso: '4to año', estado: 'Amarillo' },
    { id: 6, nombre: 'Valentina', apellido: 'López', documento: '49233456', carrera: 'Ingeniería Química', curso: '2do año', estado: 'Verde' },
    { id: 7, nombre: 'Nicolás', apellido: 'Martínez', documento: '50344567', carrera: 'Ingeniería Ambiental', curso: '3er año', estado: 'Rojo' },
    { id: 8, nombre: 'Florencia', apellido: 'Sánchez', documento: '51788990', carrera: 'Ingeniería de Sistemas', curso: '1er año', estado: 'Verde' },
    { id: 9, nombre: 'Federico', apellido: 'Romero', documento: '52333444', carrera: 'Ingeniería en Telecomunicaciones', curso: '5to año', estado: 'Amarillo' },
    { id: 10, nombre: 'Antonella', apellido: 'Díaz', documento: '53222111', carrera: 'Ingeniería Biomédica', curso: '2do año', estado: 'Verde' },
    { id: 11, nombre: 'Diego', apellido: 'García', documento: '54122333', carrera: 'Ingeniería Civil', curso: '3er año', estado: 'Rojo' },
    { id: 12, nombre: 'Mía', apellido: 'Ruiz', documento: '55111234', carrera: 'Ingeniería Industrial', curso: '1er año', estado: 'Amarillo' },
    { id: 13, nombre: 'Bruno', apellido: 'Morales', documento: '56144567', carrera: 'Ingeniería Informática', curso: '4to año', estado: 'Verde' },
    { id: 14, nombre: 'Martina', apellido: 'Jiménez', documento: '57133444', carrera: 'Ingeniería Electrónica', curso: '2do año', estado: 'Rojo' },
    { id: 15, nombre: 'Thiago', apellido: 'Gutiérrez', documento: '58155678', carrera: 'Ingeniería Mecánica', curso: '1er año', estado: 'Verde' },
    { id: 16, nombre: 'Lucía', apellido: 'Alonso', documento: '59122334', carrera: 'Ingeniería Química', curso: '3er año', estado: 'Amarillo' },
    { id: 17, nombre: 'Benjamín', apellido: 'Torres', documento: '60233445', carrera: 'Ingeniería Ambiental', curso: '2do año', estado: 'Verde' },
    { id: 18, nombre: 'Isabella', apellido: 'Vargas', documento: '61344556', carrera: 'Ingeniería de Sistemas', curso: '5to año', estado: 'Rojo' },
    { id: 19, nombre: 'Julián', apellido: 'Castro', documento: '62155667', carrera: 'Ingeniería en Telecomunicaciones', curso: '1er año', estado: 'Amarillo' },
    { id: 20, nombre: 'Santiago', apellido: 'Rivas', documento: '63166778', carrera: 'Ingeniería Biomédica', curso: '4to año', estado: 'Verde' },
    { id: 21, nombre: 'Agustina', apellido: 'Núñez', documento: '64277889', carrera: 'Ingeniería Civil', curso: '2do año', estado: 'Rojo' },
    { id: 22, nombre: 'Matías', apellido: 'Silva', documento: '65388990', carrera: 'Ingeniería Industrial', curso: '3er año', estado: 'Verde' },
    { id: 23, nombre: 'Amelia', apellido: 'Mendoza', documento: '66111223', carrera: 'Ingeniería Informática', curso: '1er año', estado: 'Amarillo' },
    { id: 24, nombre: 'Andrés', apellido: 'Paz', documento: '67222334', carrera: 'Ingeniería Electrónica', curso: '2do año', estado: 'Verde' },
    { id: 25, nombre: 'Camilo', apellido: 'Cortés', documento: '68333445', carrera: 'Ingeniería Mecánica', curso: '5to año', estado: 'Rojo' },
    { id: 26, nombre: 'Florencia', apellido: 'Medina', documento: '69444556', carrera: 'Ingeniería Química', curso: '4to año', estado: 'Amarillo' },
    { id: 27, nombre: 'Emiliano', apellido: 'Ramos', documento: '70555667', carrera: 'Ingeniería Ambiental', curso: '1er año', estado: 'Verde' },
    { id: 28, nombre: 'Catalina', apellido: 'Silva', documento: '71666778', carrera: 'Ingeniería de Sistemas', curso: '3er año', estado: 'Rojo' },
    { id: 29, nombre: 'Lautaro', apellido: 'Cano', documento: '72777889', carrera: 'Ingeniería en Telecomunicaciones', curso: '2do año', estado: 'Verde' },
    { id: 30, nombre: 'Priscila', apellido: 'Soto', documento: '73888990', carrera: 'Ingeniería Biomédica', curso: '1er año', estado: 'Amarillo' },
    { id: 31, nombre: 'Maximiliano', apellido: 'Ortega', documento: '74999001', carrera: 'Ingeniería Civil', curso: '4to año', estado: 'Verde' },
    { id: 32, nombre: 'Luciana', apellido: 'Marín', documento: '75111122', carrera: 'Ingeniería Industrial', curso: '2do año', estado: 'Rojo' },
    { id: 33, nombre: 'Diego', apellido: 'Herrera', documento: '76222233', carrera: 'Ingeniería Informática', curso: '3er año', estado: 'Verde' },
    { id: 34, nombre: 'Renata', apellido: 'Ayala', documento: '77333344', carrera: 'Ingeniería Electrónica', curso: '1er año', estado: 'Amarillo' },
    { id: 35, nombre: 'Federico', apellido: 'Luna', documento: '78444455', carrera: 'Ingeniería Mecánica', curso: '2do año', estado: 'Verde' },
    { id: 36, nombre: 'Paula', apellido: 'Vega', documento: '79555566', carrera: 'Ingeniería Química', curso: '5to año', estado: 'Rojo' },
    { id: 37, nombre: 'Nicolás', apellido: 'Paredes', documento: '80666677', carrera: 'Ingeniería Ambiental', curso: '3er año', estado: 'Amarillo' },
    { id: 38, nombre: 'Mara', apellido: 'Cáceres', documento: '81777788', carrera: 'Ingeniería de Sistemas', curso: '4to año', estado: 'Verde' },
    { id: 39, nombre: 'Valentín', apellido: 'Fuentes', documento: '82888899', carrera: 'Ingeniería en Telecomunicaciones', curso: '2do año', estado: 'Rojo' },
    { id: 40, nombre: 'Romina', apellido: 'Avellaneda', documento: '83999900', carrera: 'Ingeniería Biomédica', curso: '3er año', estado: 'Verde' },
    { id: 41, nombre: 'Tomás', apellido: 'Estrada', documento: '84111001', carrera: 'Ingeniería Civil', curso: '1er año', estado: 'Amarillo' },
    { id: 42, nombre: 'Cecilia', apellido: 'Ponce', documento: '85222112', carrera: 'Ingeniería Industrial', curso: '4to año', estado: 'Verde' },
    { id: 43, nombre: 'Santiago', apellido: 'Bustos', documento: '86333223', carrera: 'Ingeniería Informática', curso: '5to año', estado: 'Rojo' },
    { id: 44, nombre: 'María', apellido: 'Arroyo', documento: '87444334', carrera: 'Ingeniería Electrónica', curso: '3er año', estado: 'Verde' },
    { id: 45, nombre: 'Iván', apellido: 'Rojas', documento: '88555445', carrera: 'Ingeniería Mecánica', curso: '2do año', estado: 'Amarillo' },
    { id: 46, nombre: 'Alejandra', apellido: 'Campos', documento: '89666556', carrera: 'Ingeniería Química', curso: '1er año', estado: 'Verde' },
    { id: 47, nombre: 'Brenda', apellido: 'Silvestre', documento: '90777667', carrera: 'Ingeniería Ambiental', curso: '5to año', estado: 'Rojo' },
    { id: 48, nombre: 'Fabián', apellido: 'Nadal', documento: '91888778', carrera: 'Ingeniería de Sistemas', curso: '2do año', estado: 'Verde' },
    { id: 49, nombre: 'Marcos', apellido: 'Olivares', documento: '92999889', carrera: 'Ingeniería en Telecomunicaciones', curso: '3er año', estado: 'Amarillo' },
    { id: 50, nombre: 'Noelia', apellido: 'Barrios', documento: '94000990', carrera: 'Ingeniería Biomédica', curso: '4to año', estado: 'Verde' }
];

var alumnos_filtrados = alumnos; //esta variable se actualiza cada vez que se aplica un filtro o una busqueda, y es la que se muestra en pantalla, mientras que la variable alumnos siempre contiene todos los alumnos sin filtrar
//------------------------------------------------SECTOR DE EVENT LISTENERS--------------------------------------------------------------------------------------------

const searchInput = document.getElementById('searchAlumno');
const btnBuscar = document.getElementById('btnBuscar');
const filterField = document.getElementById('filterField');
const filterValue = document.getElementById('filterValue');
const btnAgregarFiltro = document.getElementById('btnAgregarFiltro');
const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');

searchInput.addEventListener('input', () => {
    const value = searchInput.value.trim();
    btnBuscar.disabled = value.length === 0;

    if (value.length === 0) {
        alumnos_filtrados = alumnos;
        mostrar_alumnos(alumnos);
        //mostrar mensaje de error o
        return;
    }

    // muestra resultados parciales mientras se escribe (opcional)
    alumnos_filtrados = alumnos.filter(alumno =>
        alumno.documento.includes(value) || 
        alumno.nombre.toLowerCase().includes(value.toLowerCase()) ||
        alumno.apellido.toLowerCase().includes(value.toLowerCase()) ||
        alumno.carrera.toLowerCase().includes(value.toLowerCase())
    );
});

searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        mostrar_alumnos(alumnos_filtrados)
        //searchInput.value = '';
    }
});
document.getElementById('btnBuscar').addEventListener('click', function(event){
    event.preventDefault();
    mostrar_alumnos(alumnos_filtrados);

});

document.getElementById('filterValue').addEventListener('change', function(event){
    event.preventDefault();
 
    //todas las funciones relacionadas al valor que puede ser tomado como filtro para los alumnos por ejemplo estado_semaforo == rojo
});

filterField.addEventListener('click', function(event){
    event.preventDefault();
    
    filterField.disabled = false;
    //todas las funciones relacionadas al filtro de los alumnos, por ejemplo, mostrar solo los alumnos con semaforo rojo, o mostrar solo los alumnos con semaforo verde, etc
});

btnLimpiarFiltros.addEventListener('click', function(event){
    event.preventDefault();

    alumnos_filtrados = alumnos; //restablece la lista de alumnos filtrados a la lista completa de alumnos
    mostrar_alumnos(alumnos_filtrados);

    //limpiar de la lista de filtrados 
    const filtros = document.querySelectorAll('.filter-tag strong');
    filtros.forEach(filtro => filtro.textContent = ''); //limpia el texto de cada filtro activo
    //todas las funciones relacionadas a limpiar los filtros, vacia la lista de filtros cuando se presiona el boton
});

document.getElementById('btnAgregarFiltro').addEventListener('click', function(event){
    event.preventDefault();
    const campo = filterField.value;
    const valor = filterValue.value;
    console.log('Campo seleccionado:', campo);
    console.log('Valor ingresado:', valor);
    console.log('Alumnos antes de aplicar filtro:', alumnos_filtrados);
    if(campo === '' || valor === ''){
        //mostrar mensaje de error o algo asi, porque no se puede agregar un filtro sin campo o sin valor
        return;
    }
    else{
        alumnos_filtrados = alumnos_filtrados.filter(alumno => {
            switch(campo){
                case 'nombre':
                    return alumno.nombre.toLowerCase() === valor.toLowerCase();
                case 'apellido':
                    return alumno.apellido.toLowerCase() === valor.toLowerCase();
                case 'carrera':
                    return alumno.carrera.toLowerCase() === valor.toLowerCase();
                case 'estado':
                    return alumno.estado.toLowerCase() === valor.toLowerCase();
                default:
                    return false; // Si el campo no coincide, no filtrar
            }
        });
        document.getElementById(`filterTag${campo.charAt(0).toUpperCase() + campo.slice(1)}`).querySelector('strong').textContent = valor;
        mostrar_alumnos(alumnos_filtrados);
    } 

    //todas las funciones relacionadas a agregar un filtro, se habilita cuando haya al menos un campo seleccionado y cuando se presiona toma los valores del filtro y .los agrega a lista de filtros
});

document.getElementById('studentsTable').querySelector('tbody').addEventListener('click', function(event){

    event.preventDefault();

    const fila = event.target.closest('tr');
    if (!fila || fila.classList.contains('placeholder-row')) return; // Ignorar clics fuera de filas o en filas de mensaje

    const dni = fila.cells[3].textContent; // Suponiendo que el DNI está en la cuarta columna (índice 3)
    console.log('DNI del alumno seleccionado:', dni);
    console.log(fila.cells[1].textContent)
    window.location.href = `../iframes/Alumnos_stats.html?modo=x&alumno=${fila.cells[1].textContent}`; // Agregar en el controlador un url param para identificar el alumno del que debe cargar los datos

    //aqui tendria una especie de logica para abrir otra pagina que me muestre las metricas personales del alumno, con su rendimiento academico

})

//------------------------------------------------SECTOR DE FUNCIONES PRINCIPALES--------------------------------------------------------------------------------


function cargar_alumnos(){

    //traer alumnos del modelo que devolveria un arreglo de alumnos 
    //alumnos = HandleGet_alumnos();
    //mostrarlos abajo
    mostrar_alumnos(alumnos);


}

function mostrar_alumnos(alumnos){

    /**
     * esta funcion es llamada cada vez que se actualizan los datos de los alaumnos, ya sea por una busqueda, o por un filtro, o por una actualizacion en tiempo real, etc.
     */

    const Tbody = document.getElementById('studentsTable').querySelector('tbody');
    Tbody.innerHTML = '';

    if (alumnos.length === 0) {
        const filaMensaje = document.createElement('tr');
        filaMensaje.classList.add('placeholder-row');
        filaMensaje.innerHTML = `<td colspan="7">No se encontraron alumnos para la búsqueda.</td>`;
        Tbody.appendChild(filaMensaje);
        actualizarTotalAlumnos(0);
        return;
    }
    console.log(alumnos);
    alumnos.forEach(alumno =>{
        const fila = document.createElement('tr');
        const claseEstado = obtenerClaseEstado(alumno.estado);
        fila.innerHTML += `<td>${alumno.id}</td>`;
        fila.innerHTML += `<td>${alumno.nombre}</td>`;
        fila.innerHTML += `<td>${alumno.apellido}</td>`;
        fila.innerHTML += `<td>${alumno.documento}</td>`;
        fila.innerHTML += `<td>${alumno.carrera}</td>`;
        fila.innerHTML += `<td>${alumno.curso}</td>`;
        fila.innerHTML += `<td class="estado-text ${claseEstado}">${alumno.estado}</td>`;
        Tbody.appendChild(fila);
    });

    actualizarTotalAlumnos(alumnos.length);
}

function obtenerClaseEstado(estado) {
    const valor = String(estado).trim().toLowerCase();
    switch (valor) {
        case 'verde':
            return 'estado-verde';
        case 'amarillo':
            return 'estado-amarillo';
        case 'rojo':
            return 'estado-rojo';
        default:
            return 'estado-desconocido';
    }
}

function actualizarTotalAlumnos(cantidad) {
    const totalCount = document.getElementById('totalAlumnosCount');
    if (totalCount) {
        totalCount.textContent = cantidad;
    }
}


//--------------------------------SECTOR DE FUNCIONES SECUNDARIAS-------------------------------------------------------------------------------------------------------



window.addEventListener('load', cargar_alumnos);