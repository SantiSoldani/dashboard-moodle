/**ARCHIVO MODELO DE PERSISTENCIA DE ARCHIVOS DESDE EL DATA ENTRY

    IMPORTAR ESTE ARCHIVO EN TUS CONTROLLERS PARA USAR LAS FUNCIONES DE PERSISTENCIA
    Ejemplo: import { Post_csv } from '../models/files_model.js';
*/

import { getBackendURL } from "../config.js";

export async function Post_csv(file, which_file, subject = null) {
  const formData = new FormData();
  formData.append("file", file);
  if (subject) {
    formData.append("materia", subject);
  }
  try {
    // Hará un fetch a rutas similares a:
    // data/upload/notas;
    // data/upload/alumnos;
    // data/upload/encuestaInicial;
    // data/upload/encuestaPeriodica;
    // data/upload/entrevista
    const response = await fetch(
      `${getBackendURL()}/data/upload/${which_file}`,
      {
        method: "POST",
        body: formData,
        headers: {
          "ngrok-skip-browser-warning": "69420"
        }
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} `);
    }

    const data = await response.json();
    console.log("Archivo cargado correctamente:", data);
    return true;
  } catch (error) {
    console.error("Error al cargar los archivos:", error);
    return false;
  }
}
