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
    // Hará un fetch POST a rutas similares a:
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

export async function Get_Database() {
  try {
    const response = await fetch(`${getBackendURL()}/data/download/database`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "69420"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // El browser va a manejar el blob como archivo y mostrar el propmt de descarga real
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database_dashboard.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return true;
  } catch (error) {
    console.error("Error al descargar la base de datos:", error);
    return false;
  }
}
