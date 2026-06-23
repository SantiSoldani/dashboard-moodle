import { getConfig } from "../config.js";

export async function Handle_get_Notas() {
  try {
    let response = await fetch(`${getConfig().apiUrl}/notas/all`, { headers: { "ngrok-skip-browser-warning": "69420" } });
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
      `${getConfig().apiUrl}/notas/stats/${indicador}/${alumno}`, { headers: { "ngrok-skip-browser-warning": "69420" } }
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
    let response = await fetch(`${getConfig().apiUrl}/notas/alumno/${alumno}`, { headers: { "ngrok-skip-browser-warning": "69420" } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    else {
      let data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function Handle_get_promedio_general() {
  try {
    let response = await fetch(`${getConfig().apiUrl}/notas/promedio`, { headers: { "ngrok-skip-browser-warning": "69420" } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    else {
      let data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
}
