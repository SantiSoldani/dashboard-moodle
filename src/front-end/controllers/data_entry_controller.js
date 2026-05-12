
/**ARCHIVO CONTROLADOR DEL MODULO IFRAME DEL DATA ENTRY
 * 
 * -PERMITIR LA CARGA DE ARCHIVOS CSV / EXCEL PARA LA INGESTA DE DATOS
 * -PERMITIR LA INGESTA DE DATOS A MANO EN CASO DE SER NECESARIO
 * -OTORGAR FLAGS DE QUE LOS DATOS FUERON CARGADOS EXITOSAMENTE
 */





async function procesarArchivos(){
 
    //revisar que al menos uno de los archivos haya sido cargado

    const alumnos_file = document.getElementById('alumnosFile');
    const notas_file = document.getElementById('notasFile');

    if(!alumnos_file.files[0] && !notas_file.files[0]){
        msj_conteiner = document.getElementById('conteiner');
        error_msj('Debe cargar al menos un archivo');
        return;
    }

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

async function data_preview() {

    try {
        const tbody = document
            .getElementById('tablaResultados')
            .querySelector('tbody');
        console.log('Mostrando previsualización de los datos...');

        let alumnosCSV = [];

        if(document.getElementById('alumnosFile').files[0]) {

            alumnosCSV = await leerCSV(
                document.getElementById('alumnosFile').files[0]
            );
        }

        for(let i = 1; i < alumnosCSV.length; i++) {
            const [id, nombre, apellido] = alumnosCSV[i];
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${id}</td>
                <td>${nombre}</td>
                <td>${apellido}</td>
            `;
            tbody.appendChild(fila);
        }
    } catch(error) {

        console.error(
            'Error al mostrar la previsualización:',
            error
        );
    }
}

const submit = document.getElementById('x');

submit.addEventListener('click', function(event){
    event.preventDefault();
    procesarArchivos();
    data_preview();
})