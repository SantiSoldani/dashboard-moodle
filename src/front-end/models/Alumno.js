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
    const dni_usuario = localStorage.getItem("dni") || null;
    const headers = {
      "ngrok-skip-browser-warning": "69420",
      "X-Role": rol
    };

    if (rol === "Tutor" && dni_usuario) {
      headers["x-tutor-dni"] = dni_usuario;
    }

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

export async function HandleGet_indicadores_Bydni(tipo, dni) {
  try {
    const rol = localStorage.getItem("rol") || "Instructor";
    const headers = {
      "ngrok-skip-browser-warning": "69420",
      "X-Role": rol
    };

    const response = await fetch(`${alumnosAPI}/get/indicadores_Bydni/${tipo}/${dni}`, { headers });
    if (!response.ok) {
      throw new Error(`Error en el fetch de indicadores por dni: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer los indicadores por dni", error);
    return null;
  }
}

export async function HandleGet_encuesta_ByDni(dni) {
  try {
    const rol = localStorage.getItem("rol") || "Instructor";
    const headers = {
      "ngrok-skip-browser-warning": "69420",
      "X-Role": rol
    };
    const response = await fetch(`${getConfig()}/encuesta/ByDni/${dni}`, { headers });
    if (!response.ok) {
      throw new Error(`Error en el fetch de encuesta por dni: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer la encuesta por dni", error);
    return [];
  }
}

export async function HandleGet_evolucion_semaforos(dni) {
  try {
    const rol = localStorage.getItem("rol") || "Instructor";
    const headers = {
      "ngrok-skip-browser-warning": "69420",
      "X-Role": rol
    };
    const response = await fetch(`${alumnosAPI}/get/evolucion_semaforos/${dni}`, { headers });
    if (!response.ok) {
      throw new Error(`Error en el fetch de evolucion semaforos: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer la evolucion de semaforos", error);
    return [];
  }
}

export async function HandleGet_rendimiento_academico(dni) {
  try {
    const rol = localStorage.getItem("rol") || "Instructor";
    const headers = {
      "ngrok-skip-browser-warning": "69420",
      "X-Role": rol
    };
    const response = await fetch(`${alumnosAPI}/get/rendimiento_academico/${dni}`, { headers });
    if (!response.ok) {
      throw new Error(`Error en el fetch de rendimiento academico: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer el rendimiento academico", error);
    return [];
  }
}

export async function HandleGet_agenda_pendiente(dni_alumno) {
  try {
    const headers = {
      "ngrok-skip-browser-warning": "69420"
    };
    const response = await fetch(`${getConfig()}/agendas/buscar/${dni_alumno}`, { headers });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Error al buscar agenda: ${response.status}`);
    }
    const data = await response.json();
    return data; // Puede ser null o un objeto Agenda
  } catch (error) {
    console.error("Error al buscar agenda pendiente", error);
    return null;
  }
}

export async function HandleGet_usuario_by_dni(dni_usuario) {
  try {
    const headers = {
      "ngrok-skip-browser-warning": "69420"
    };
    const response = await fetch(`${getConfig()}/usuarios/dni/${dni_usuario}`, { headers });
    if (!response.ok) {
      throw new Error(`Error al buscar usuario: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al buscar usuario por dni", error);
    return null;
  }
}

export async function HandleGet_solicitud_pendiente(dni_alumno) {
  try {
    const headers = {
      "ngrok-skip-browser-warning": "69420"
    };
    const response = await fetch(`${solicitudesAPI}/buscar/${dni_alumno}`, { headers });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Error al buscar solicitud: ${response.status}`);
    }
    const data = await response.json();
    return data; // Puede ser null o un objeto Solicitud
  } catch (error) {
    console.error("Error al buscar solicitud pendiente", error);
    return null;
  }
}

export async function HandleCreate_agenda(dni_alumno, dni_entrevistador, fecha_agendada) {
  try {
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420"
    };
    const body = JSON.stringify({ dni_alumno, dni_entrevistador, fecha_agendada });
    const response = await fetch(`${getConfig()}/agendas/crear`, { method: "POST", headers, body });
    if (!response.ok) {
      throw new Error(`Error al crear agenda: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear agenda", error);
    return null;
  }
}

export async function HandleMarcar_agenda(id_entrevista) {
  try {
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420"
    };
    const body = JSON.stringify({ id_entrevista });
    const response = await fetch(`${getConfig()}/agendas/marcar`, { method: "POST", headers, body });
    if (!response.ok) {
      throw new Error(`Error al marcar agenda: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al marcar agenda", error);
    return null;
  }
}

export async function HandleGet_conteo_semaforos(fecha_techo) {
  try {
    const rol = localStorage.getItem("rol") || "Admin";
    const headers = {
      "ngrok-skip-browser-warning": "69420",
      "X-Role": rol
    };
    const response = await fetch(`${alumnosAPI}/get/semaforos/${fecha_techo}`, { headers });
    if (!response.ok) {
      throw new Error(`Error en el fetch de conteo semaforos: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al traer conteo semaforos", error);
    return [];
  }
}
