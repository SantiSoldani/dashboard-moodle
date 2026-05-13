/**ARCHIVO MODELO DE PERSISTENCIA DE ARCHIVOS DESDE EL DATA ENTRY
 
    IMPORTAR ESTE ARCHIVO EN TUS CONTROLLERS PARA USAR LAS FUNCIONES DE PERSISTENCIA
    Ejemplo: import { Post_csv } from '../models/files_model.js';
*/

import { getConfig } from '../config/config.js';

export function Post_csv(file, fileName){

     const formData = new FormData();
     let success = true
    
    formData.append(fileName, file);

    try{
        fetch( getConfig().env.api_url + '/upload_csv',
        {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => console.log(data))

    }
    catch(error){
        console.error('Error al cargar los archivos:', error);
        success = false;
    }

    return success;
    
}
