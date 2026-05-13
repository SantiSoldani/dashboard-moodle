/**CONTROLADOR DE EL IFRAME DE LOS SEMAFOROS -> TRABAJOS:
 * 
 * - COMUNICARSE CON EL MODELO DE ALUMNOS PARA OBTENER LOS DATOS DE LOS SEMAFOROS DE LOS ALUMNOS
 * - CARGAR LOS SEMAFOROS Y LA INFORMACION DE CADA ALUMNOS POR MEDIO DE UN IFRAME
 * - ACTUALIZAR LOS SEMAFOROS EN TIEMPO REAL SI ES NECESARIO
 * - PODRIA DESARROLLARSE ALGUN CAMPO PARA FILTRAR LOS ALUMNOS POR NOMBRE, Y SITUACION DEL SEMAFORO
 * 
 * 
 */





//IMPORTAR DATOS DE TODOS LOS ALUMNOS DE LA BASE DE DATOS



//------------------------------------------------SECTOR DE EVENT LISTENERS--------------------------------------------------------------------------------------------

Document.getElementById('searchAlumno').addEventListener('change', function(event){
    event.preventDefault();
    //todas las funciones cuando se ingresa algo en el buscador, por ejemplo, habilitar el boton de busqueda, o realizar una busqueda en tiempo real

})

Document.getElementById('filterValue').addEventListener('change', function(event){
    event.preventDefault();
    //todas las funciones relacionadas al valor que puede ser tomado como filtro para los alumnos por ejemplo estado_semaforo == rojo
})

Document.getElementById('btnBuscar').addEventListener('click', function(event){
    event.preventDefault();
    //todo las funciones a realizar cuando se realiza la busqueda de un alumno en particular
})

Document.getElementById('filterField').addEventListener('click', function(event){

    event.preventDefault();
    //todas las funciones relacionadas al filtro de los alumnos, por ejemplo, mostrar solo los alumnos con semaforo rojo, o mostrar solo los alumnos con semaforo verde, etc

})

Document.getElementById('btnLimpiarFiltros').addEventListener('click', function(event){
    event.preventDefault();
    //todas las funciones relacionadas a limpiar los filtros, vacia la lista de filtros cuando se presiona el boton
})

document.getElementById('btnAgregarFiltro').addEventListener('click', function(event){
    event.preventDefault();
    //todas las funciones relacionadas a agregar un filtro, se habilita cuando haya al menos un campo seleccionado y cuando se presiona toma los valores del filtro y .los agrega a lista de filtros
})


//------------------------------------------------SECTOR DE FUNCIONES PRINCIPALES--------------------------------------------------------------------------------


//--------------------------------SECTOR DE FUNCIONES SECUNDARIAS-------------------------------------------------------------------------------------------------------