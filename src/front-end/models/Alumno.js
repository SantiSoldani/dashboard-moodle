import { getConfig } from "../config/config.js";

/**
 *
 * MODELO DEL ALUMNO ENCARGADOS DE LAS OPERACIONES TIPO API REST
 *
 *
 */
export async function HandleGet_alumnos(which = "all") {
  try {
    const response = await fetch(`${getConfig().env.api_url}/alumnos/${which}`);

    if (!response.ok) {
      throw new Error("Error en el fetch de los alumnos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error al traer los alumnos del back", error);
    return [];
  }
}
