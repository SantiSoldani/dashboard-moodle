import { getBackendURL } from "../config.js";

const loginForm = document.getElementById("loginForm");
const dniInput = document.getElementById("dni");
const claveInput = document.getElementById("clave");
const btnLogin = document.getElementById("btnLogin");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dni = dniInput.value.trim();
  const clave = claveInput.value.trim();

  if (!dni || !clave) {
    showMessage("Por favor, ingresá tu usuario y contraseña.", "error");
    return;
  }

  btnLogin.disabled = true;
  btnLogin.innerHTML = `<span class="material-symbols-outlined" style="font-size: 20px; animation: spin 1s linear infinite; vertical-align: middle;">sync</span> Ingresando...`;

  try {
    const url = `${getBackendURL()}/alumnos/login/${dni}/${clave}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        throw new Error("Credenciales inválidas. Intentá de nuevo.");
      }
      throw new Error("Error en la conexión con el servidor.");
    }

    const data = await response.json();
    showMessage("¡Sesión iniciada con éxito!", "success");

    // Redirigir a Alumnos_stats.html con el parámetro de alumno (DNI)
    setTimeout(() => {
      window.location.href = `../iframes/Alumnos_stats.html?alumno=${encodeURIComponent(dni)}`;
    }, 1500);

  } catch (error) {
    console.error("Error de login:", error);
    showMessage(error.message || "Ocurrió un error inesperado.", "error");
  } finally {
    btnLogin.disabled = false;
    btnLogin.innerHTML = `Iniciar Sesión <span class="material-symbols-outlined">chevron_right</span>`;
  }
});

function showMessage(text, type = "info") {
  const container = document.getElementById("mensaje");
  if (!container) return;

  container.innerHTML = "";
  const div = document.createElement("div");
  div.style.padding = "10px 16px";
  div.style.borderRadius = "8px";
  div.style.fontSize = "13px";
  div.style.fontWeight = "600";
  div.style.width = "100%";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";

  if (type === "success") {
    div.style.background = "var(--success-subtle)";
    div.style.color = "var(--success)";
    div.style.border = "1px solid var(--success)";
  } else if (type === "error") {
    div.style.background = "var(--critical-subtle)";
    div.style.color = "var(--critical)";
    div.style.border = "1px solid var(--critical)";
  } else {
    div.style.background = "var(--surface-container)";
    div.style.color = "var(--on-surface-variant)";
    div.style.border = "1px solid var(--outline-variant)";
  }

  div.innerText = text;
  container.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 4000);
}
