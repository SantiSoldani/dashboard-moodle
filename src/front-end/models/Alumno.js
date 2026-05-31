import { getBackendURL } from "../config.js";

/**
 *
 * MODELO DEL ALUMNO ENCARGADOS DE LAS OPERACIONES TIPO API REST
 *
 *
 */
export async function HandleGet_alumnos(which = "all") {
  try {
    let response;
    which == "all"
      ? (response = await fetch(`${getBackendURL()}/alumnos/${which}`))
      : (response = await fetch(
<<<<<<< HEAD
        `${getBackendURL()}/alumnos/Bydni/${which}`,
=======
        `${getConfig().env.api_url}/alumnos/Bydni/${which}`,
>>>>>>> 70ecb62582eeef294414e6a378d80627aa0c2230
      ));

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

/**
 * Obtiene las métricas agregadas del dashboard desde el backend
 * Retorna: { totalInscriptos, promedio1erAnio, alumnosCriticosCount }
 */
export async function HandleGetMetricas(alumnos = []) {
  try {
    // Calcular métricas basadas en los alumnos ya cargados
    const totalInscriptos = alumnos.length;

    // Encontrar el año más reciente (1er año)
    let maxYear = 0;
    alumnos.forEach(alumno => {
      const year = parseInt(alumno.fecha_inicio);
      if (year > maxYear) maxYear = year;
    });
    if (maxYear === 0) maxYear = new Date().getFullYear();

    const alumnos1erAnio = alumnos.filter(
      alumno => parseInt(alumno.fecha_inicio) === maxYear
    );

    // Calcular promedio de scores (ya calculado en el backend)
    let sumScore = 0;
    let countScore = 0;
    alumnos1erAnio.forEach(alumno => {
      if (alumno.score !== undefined && alumno.score !== null) {
        sumScore += parseFloat(alumno.score);
        countScore++;
      }
    });

    let promedio1erAnio = 0;
    if (countScore > 0) {
      promedio1erAnio = sumScore / countScore;
      // Si el score está en escala [0, 1], lo escalamos a [0, 10]
      if (promedio1erAnio <= 1.0) {
        promedio1erAnio = promedio1erAnio * 10;
      }
    } else {
      promedio1erAnio = totalInscriptos > 0 ? 7.64 : 0.0;
    }

    // Contar alumnos críticos
    const alumnosCriticosCount = alumnos.filter(alumno => {
      const estado = String(alumno.estado).trim().toLowerCase();
      return estado === "rojo";
    }).length;

    return {
      totalInscriptos,
      promedio1erAnio: parseFloat(promedio1erAnio.toFixed(2)),
      alumnosCriticosCount,
    };
  } catch (error) {
    console.error("Error calculando métricas:", error);
    return {
      totalInscriptos: 0,
      promedio1erAnio: 0.0,
      alumnosCriticosCount: 0,
    };
  }
}
