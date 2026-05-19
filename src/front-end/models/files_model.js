/**ARCHIVO MODELO DE PERSISTENCIA DE ARCHIVOS DESDE EL DATA ENTRY

    IMPORTAR ESTE ARCHIVO EN TUS CONTROLLERS PARA USAR LAS FUNCIONES DE PERSISTENCIA
    Ejemplo: import { Post_csv } from '../models/files_model.js';
*/

import { getConfig } from "../config/config.js";

export async function Post_csv(file, which_file) {
  const formData = new FormData();
  formData.append("file", file);

  console.log(`${getConfig().env.api_url}/data/UploadData`);
  try {
    const response = await fetch(
      `${getConfig().env.api_url}/data/Upload${which_file} `,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Archivo cargado correctamente:", data);
    return true;
  } catch (error) {
    console.error("Error al cargar los archivos:", error);
    return false;
  }
}
