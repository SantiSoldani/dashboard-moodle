import { getConfig } from "../config.js";

/**
 *
 * MODELO DEL ALUMNO ENCARGADOS DE LAS OPERACIONES TIPO API REST
 *
 *
 */

const alumnosAPI = `${getConfig()}/alumnos`;

export async function HandleGet_alumnos(dni = null, which = "get") {
  try {
    let response;
    const headers = { "ngrok-skip-browser-warning": "69420" };
    if (which == "get")
      (response = await fetch(`${alumnosAPI}/get`, { headers })); // Trae todos los alumnos
    else if (which == "byDNI")
      (response = await fetch(`${alumnosAPI}/get/byDni/${dni}`, { headers }));

    else if (which == "stats") // Trae los alumnos + Datos de su Semaforo.
      (response = await fetch(`${alumnosAPI}/get/${which}`, { headers }))
    if (!response.ok) {
      throw new Error("Error en el fetch de los alumnos");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error al traer los alumnos", error);
    return [];
  }
}
