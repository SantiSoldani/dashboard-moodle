import { getConfig } from "../config.js";

/**
 *
 * MODELO DEL ALUMNO ENCARGADOS DE LAS OPERACIONES TIPO API REST
 *
 *
 */

const alumnosAPI = `${getConfig()}/alumnos`;
const solicitudesAPI = `${getConfig()}/solicitudes`;
const tutoresAPI = `${getConfig()}/tutor_alumno`;


export async function HandleGet_alumnos(dni = null, which = "get") {
  try {
    const rol = localStorage.getItem("rol") || "Instructor";
    const headers = {
      "ngrok-skip-browser-warning": "69420",
      "X-Role": rol
    };

    let response;

    if (which == "get")
      response = await fetch(`${alumnosAPI}/get`, { headers }); // Trae todos los alumnos
    else if (which == "byDNI")
      response = await fetch(`${alumnosAPI}/get/byDNI/${dni}`, { headers });
    else if (which == "stats" || which == "criticos")
      // Trae los alumnos + Datos de su Semaforo o los criticos
      response = await fetch(`${alumnosAPI}/get/${which}`, { headers });
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

export async function HandleGet_tutor(dni_alumno) {
  // @router.get("/get/tutor_by_alumno_dni/{dni}")
  try {
    const response = await fetch(`${tutoresAPI}/get/tutor_by_alumno_dni/${dni_alumno}`);
    if (!response.ok) {
      throw new Error("Error en el fetch del tutor");
    }
    const data = await response.json();
    console.log("DATA", data)
    return data;
  } catch (error) {
    console.error("Error al traer el tutor", error);
    return [];
  }
}

export async function HandleCreate_solicitud(dni_alumno, dni_tutor = null) {
  try {
    console.log("HANDLE GET SOLICITUDES", dni_alumno, dni_tutor)
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    };
    const response = await fetch(`${solicitudesAPI}/crear`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ dni_alumno, dni_tutor })
    });

    if (!response.ok) {
      throw new Error("Error al intentar crear una solicitud DPSOA")
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar crear una solicitud", error);
  }
}

export async function HandleGet_indicadores_iniciales(tipo, filtro, anio) {
  try {
    const rol = localStorage.getItem("rol") || "Admin";
    const headers = {
      "ngrok-skip-browser-warning": "69420",
      "X-Role": rol
    };

    // El endpoint es: alumnos/get/indicadores/iniciales/"fecha_inicio"/<año de cohorte>
    const response = await fetch(`${alumnosAPI}/get/indicadores/${tipo}/${filtro}/${anio}`, { headers });

    if (!response.ok) {
      throw new Error(`Error en el fetch de indicadores iniciales: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer los indicadores iniciales", error);
    return null;
  }
}

export async function HandleGet_semaforosXpre(anio) {
  try {
    const rol = localStorage.getItem("rol") || "Admin";
    const headers = {
      "ngrok-skip-browser-warning": "69420",
      "X-Role": rol
    };
    
    // ruta de la api = alumnos/get/semaforosXpre/<año de cohorte>
    const response = await fetch(`${alumnosAPI}/get/semaforosXpre/${anio}`, { headers });
    
    if (!response.ok) {
      throw new Error(`Error en el fetch de semaforosXpre: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer semaforosXpre", error);
    return [];
  }
}

export async function HandleGet_scoreXcohorte() {
  try {
    const rol = localStorage.getItem("rol") || "Admin";
    const headers = {
      "ngrok-skip-browser-warning": "69420",
      "X-Role": rol
    };
    
    // ruta de la api = alumnos/get/scoreXcohorte
    const response = await fetch(`${alumnosAPI}/get/scoreXcohorte`, { headers });
    
    if (!response.ok) {
      throw new Error(`Error en el fetch de scoreXcohorte: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer scoreXcohorte", error);
    return [];
  }
}



