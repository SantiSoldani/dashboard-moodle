import { getConfig } from "../config.js";

/**
 *
 * MODELO DEL ALUMNO ENCARGADOS DE LAS OPERACIONES TIPO API REST
 *
 *
 */

const alumnosAPI = `${getConfig()}/alumnos/`;

export async function HandleGet_alumnos(which = "all") {
  try {
    let response;
    if (which == "all") {
      (response = await fetch(`${alumnosAPI}${which}`)) // Si witch es == all, trae todos los alumnos
    }
    else if (which == "all-stats") {
      (response = await fetch(`${alumnosAPI}${which}`))
    }
    else {
      (response = await fetch(
        `${alumnosAPI}Bydni/${which}`,
      ))
    }
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
