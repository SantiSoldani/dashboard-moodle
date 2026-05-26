import { getConfig } from "../config/config";

export async function Handle_get_Notas() {
  try {
    let response = await fetch(`${getConfig().apiUrl}/notas/all`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    else {
      let data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function Handle_get_stats(indicador, alumno) {
  try {
    let response = await fetch(
      `${getConfig().apiUrl}/notas/stats/${indicador}/${alumno}`,
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    else {
      let data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function Handle_get_Nota_Alumno(alumno) {
  try {
    let response = await fetch(`${getConfig().apiUrl}/notas/alumno/${alumno}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    else {
      let data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
}
