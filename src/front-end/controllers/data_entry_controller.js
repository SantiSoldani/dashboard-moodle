
/**ARCHIVO CONTROLADOR DEL MODULO IFRAME DEL DATA ENTRY
 * 
 * -PERMITIR LA CARGA DE ARCHIVOS CSV / EXCEL PARA LA INGESTA DE DATOS
 * -PERMITIR LA INGESTA DE DATOS A MANO EN CASO DE SER NECESARIO
 * -OTORGAR FLAGS DE QUE LOS DATOS FUERON CARGADOS EXITOSAMENTE
 */



//------------------------------------SECTOR DE FUNCIONES PRINCIPALES----------------------------------------------------
async function procesarArchivos(){
 
    //revisar que al menos uno de los archivos haya sido cargado

    const alumnos_file = document.getElementById('alumnosFile');
    const notas_file = document.getElementById('notasFile');

    if(!alumnos_file.files[0] && !notas_file.files[0]){
        msj('Debe cargar al menos un archivo', 'error', 2000, 'mensaje');
        document.getElementById('x').disabled = true;
        await new Promise(resolve => setTimeout(resolve, 2000));
        document.getElementById('x').disabled = false;
        return;
    }

    msj('procesado correctamente...', 'success', 3000, 'mensaje');
    
    /** trabajo del modelo cuando sea creado
 
    const formData = new FormData();
    
    if(alumnos_file.files[0]){ formData.append('alumnos', alumnos_file.files[0]);}

    if(notas_file.files[0]){ formData.append('notas', notas_file.files[0] );}

    try{
        fetch( //url de la api
        {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => console.log(data))

    }
    catch(error){
        console.error('Error al cargar los archivos:', error);
    }
*/
}


 function leerCSV(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = function(event) {
                    const texto = event.target.result;
                    const filas = texto.trim().split('\n');

                    const datos = filas.map(fila =>
                        fila.split(',').map(campo => campo.trim())
                    );

                    resolve(datos);
                };

                reader.onerror = function() {
                    reject('Error leyendo el archivo');
                };

                reader.readAsText(file);
            });
}

/*async function data_preview() {

    try {
        const tbody = document
            .getElementById('tablaResultados')
            .querySelector('tbody');
        
        // No limpiar automáticamente, solo mostrar según la vista activa
        console.log('Previsualización disponible para actualizar');
        
    } catch(error) {

        console.error(
            'Error al mostrar la previsualización:',
            error
        );
    }
}
*/
async function mostrarAlumnos() {
    try {
        const tbody = document
            .getElementById('tablaResultados')
            .querySelector('tbody');
        const headerRow = document.getElementById('headerRow');
        const tabla = document.getElementById('tablaResultados');
        const emptyMessage = document.getElementById('emptyMessage');
        const btnLimpiar = document.getElementById('btnLimpiarAlumnos');
        
        // Verificar si hay archivo cargado
        if(!document.getElementById('alumnosFile').files[0]) {
            emptyMessage.style.display = 'block';
            tabla.style.display = 'none';
            btnLimpiar.classList.add('hidden');
            return;
        }
        
        // Mostrar botón de limpiar
        btnLimpiar.classList.remove('hidden');
        
        // Limpiar tabla
        tbody.innerHTML = '';
        

        console.log('Mostrando previsualización de alumnos...');

        let alumnosCSV = [];

        if(document.getElementById('alumnosFile').files[0]) {

            alumnosCSV = await leerCSV(
                document.getElementById('alumnosFile').files[0]
            );
        }
        headerRow.innerHTML = '';
        campos = alumnosCSV[0];
        for(let i = 0; i < campos.length; i++) {
            campos[i] = campos[i].toLowerCase();
            headerRow.innerHTML += `<th>${campos[i]}</th>`;
        }

        for(let i = 1; i < alumnosCSV.length; i++) {
            const filas = alumnosCSV[i];
            const fila = document.createElement('tr');
            for(let j = 0; j < filas.length; j++) {
                fila.innerHTML += `<td>${filas[j]}</td>`;
            }
            tbody.appendChild(fila);
        }
        
        // Mostrar tabla y ocultar mensaje vacío
        emptyMessage.style.display = 'none';
        tabla.style.display = 'table';
    } catch(error) {
        console.error('Error al mostrar alumnos:', error);
    }
}

async function mostrarNotas() {
    try {
        const tbody = document
            .getElementById('tablaResultados')
            .querySelector('tbody');
        const headerRow = document.getElementById('headerRow');
        const tabla = document.getElementById('tablaResultados');
        const emptyMessage = document.getElementById('emptyMessage');
        const btnLimpiar = document.getElementById('btnLimpiarNotas');
        
        // Verificar si hay archivo cargado
        if(!document.getElementById('notasFile').files[0]) {
            emptyMessage.style.display = 'block';
            tabla.style.display = 'none';
            btnLimpiar.classList.add('hidden');
            return;
        }
        
        // Mostrar botón de limpiar
        btnLimpiar.classList.remove('hidden');
        
        // Limpiar tabla
        tbody.innerHTML = '';



    
        console.log('Mostrando previsualización de notas...');

        let notasCSV = [];

        if(document.getElementById('notasFile').files[0]) {

            notasCSV = await leerCSV(
                document.getElementById('notasFile').files[0]
            );
        }
        headerRow.innerHTML = '';
        campos = notasCSV[0];
        for(let i = 0; i < campos.length; i++) {
            campos[i] = campos[i].toLowerCase();
            headerRow.innerHTML += `<th>${campos[i]}</th>`;
        }

        for(let i = 1; i < notasCSV.length; i++) {
            const datos = notasCSV[i];
            const fila = document.createElement('tr');

            for(let j = 0; j < campos.length; j++) {
                fila.innerHTML += `<td>${datos[j]}</td>`;
            }
            tbody.appendChild(fila);
        }
        
        // Mostrar tabla y ocultar mensaje vacío
        emptyMessage.style.display = 'none';
        tabla.style.display = 'table';
    } catch(error) {
        console.error('Error al mostrar notas:', error);
    }
}



//----------------------------------SECTOR DE EVENT LISTENERS Y DISPARADORES DE FUNCIONES----------------------------------------------------
document.getElementById('alumnosFile').addEventListener('change', function(event){
    mostrarAlumnos();
});

document.getElementById('notasFile').addEventListener('change', function(event){
    const btnVerNotas = document.getElementById('btnVerNotas');
    if(btnVerNotas) {
        btnVerNotas.classList.add('active');
    }
    mostrarNotas();
});

// Botones para limpiar archivos
document.getElementById('btnLimpiarAlumnos').addEventListener('click', function(event){
    event.preventDefault();
    document.getElementById('alumnosFile').value = '';
    mostrarAlumnos();
});

document.getElementById('btnLimpiarNotas').addEventListener('click', function(event){
    event.preventDefault();
    document.getElementById('notasFile').value = '';
    mostrarNotas();
});

// Event listeners para los botones de vista
document.getElementById('btnVerAlumnos').addEventListener('click', function(event){
    event.preventDefault();
    document.getElementById('btnVerAlumnos').classList.add('active');
    document.getElementById('btnVerNotas').classList.remove('active');
    mostrarAlumnos();
});

document.getElementById('btnVerNotas').addEventListener('click', function(event){
    event.preventDefault();
    document.getElementById('btnVerNotas').classList.add('active');
    document.getElementById('btnVerAlumnos').classList.remove('active');
    mostrarNotas();
});

const submit = document.getElementById('x');
submit.addEventListener('click', function(event){
    event.preventDefault();
    procesarArchivos();
})

document.addEventListener('DOMContentLoaded', function() {
    mostrarAlumnos();
});


//------------------------------SECTOR DE FUNCIONES UTILES----------------------------------------------------
function msj( texto, tipo = 'info', duracion = 3000, which_container) {

    const container = document.getElementById(which_container);

    if (!container) {
        console.error(
            `No existe el contenedor: ${which_container}`
        );
        return;
    }

    // CREAR MENSAJE
    const mensaje = document.createElement('div');

    // clase dinamica:
    // error / success / warning / info
    mensaje.classList.add(tipo);

    // TEXTO
    const contenido = document.createElement('span');

    contenido.textContent = texto;

    // BOTON
    const boton = document.createElement('button');

    boton.textContent = 'Ok';

    boton.addEventListener('click', () => {
        mensaje.remove();
    });

    // ARMAR MENSAJE
    mensaje.appendChild(contenido);

    mensaje.appendChild(boton);

    // INSERTAR EN EL HTML
    container.appendChild(mensaje);

    // AUTO ELIMINAR
    setTimeout(() => {

        if (mensaje.parentNode) {
            mensaje.remove();
        }

    }, duracion);
}


//faltaria una funcion de handle_post_data que llame al modelo para que haga el fetch de los datos
//revisar los datos que vamos a persistir y definir un formato claro de os csv para la carga y visualizacion de datos

// Inicializar mostrando mensaje de vacío al cargar la página

