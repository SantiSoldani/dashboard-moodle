import { getBackendURL } from "../config.js";

const entrevistaAPI = `${getBackendURL()}/entrevista`;

export async function post_entrevistaForm(payload) {
  console.log("payload a enviar:", JSON.stringify(payload));
  try {
    const response = await fetch(`${entrevistaAPI}/post_entrevista`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },

      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.error("[Entrevista] Error al guardar entrevista:", error);
    return { ok: false, error: error.message };
  }
}

export async function get_puntajeEntrevista(dni) {
  try {
    const response = await fetch(`${entrevistaAPI}/get_puntaje/${dni}`, {
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.error("[Entrevista] Error al consultar puntaje:", error);
    return { ok: false, error: error.message };
  }
}

export async function put_puntajeEntrevista(dni, puntaje) {
  try {
    const response = await fetch(
      `${entrevistaAPI}/update_puntaje/${dni}/${parseFloat(puntaje)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.error("[Entrevista] Error al actualizar puntaje:", error);
    return { ok: false, error: error.message };
  }
}
