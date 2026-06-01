import { Post_csv } from "../models/Files.js";

const uploadZone = document.getElementById("uploadZone");
const mainFileInput = document.getElementById("mainFileInput");
const uploadZoneText = document.getElementById("uploadZoneText");
const selectFileType = document.getElementById("selectFileType");
const btnClearFile = document.getElementById("btnClearFile");
const btnUpload = document.getElementById("x");
const emptyMessage = document.getElementById("emptyMessage");
const tablaResultados = document.getElementById("tablaResultados");
const headerRow = document.getElementById("headerRow");
const tbody = tablaResultados.querySelector("tbody");

// Controles de Paginación
const paginationControls = document.getElementById("paginationControls");
const btnPrevPage = document.getElementById("btnPrevPage");
const btnNextPage = document.getElementById("btnNextPage");
const pageIndicator = document.getElementById("pageIndicator");

let selectedFile = null;
let parsedRows = []; // Almacena todas las filas leídas (incluyendo cabeceras en index 0)
let currentPage = 1;
const rowsPerPage = 20;

// Click en la zona abre el buscador de archivos
uploadZone.addEventListener("click", () => {
  mainFileInput.click();
});

// Cambiar archivo seleccionado desde el explorador
mainFileInput.addEventListener("change", () => {
  if (mainFileInput.files[0]) {
    handleFileSelect(mainFileInput.files[0]);
  }
});

// Procesar archivo seleccionado
function handleFileSelect(file) {
  selectedFile = file;
  uploadZoneText.innerHTML = `Archivo seleccionado: <span style="color:var(--primary); font-weight:700;">${file.name}</span>`;
  btnClearFile.classList.remove("hidden");

  // Mostrar previsualización instantánea del archivo
  mostrarPreview(file);
}

// Previsualizar cualquier CSV de manera dinámica y automática
async function mostrarPreview(file) {
  try {
    const text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = () => reject("Error leyendo archivo");
      reader.readAsText(file);
    });

    // Dividir en líneas limpiando retornos de carro
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0 || lines[0].trim() === "") {
      emptyMessage.style.display = "block";
      tablaResultados.style.display = "none";
      paginationControls.style.display = "none";
      return;
    }

    // Detectar si el separador es punto y coma (;) o coma (,)
    const separator = lines[0].includes(";") ? ";" : ",";

    // Dividir en filas y columnas y guardar en buffer global
    parsedRows = lines.map(row =>
      row.split(separator).map(cell => cell.trim().replace(/^["']|["']$/g, "")) // Limpiar comillas
    );

    // Generar cabeceras
    headerRow.innerHTML = "";
    parsedRows[0].forEach(col => {
      headerRow.innerHTML += `<th>${col}</th>`;
    });

    // Inicializar paginación
    currentPage = 1;
    renderActivePage();

    emptyMessage.style.display = "none";
    tablaResultados.style.display = "table";
  } catch (error) {
    console.error("Error al previsualizar el archivo:", error);
    showMessage("Error al intentar previsualizar el archivo CSV", "error");
  }
}

// Renderizar la página actual de la previsualización
function renderActivePage() {
  const dataRows = parsedRows.slice(1); // Excluir la cabecera
  const totalPages = Math.ceil(dataRows.length / rowsPerPage) || 1;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const activePageData = dataRows.slice(startIndex, endIndex);

  // Generar cuerpo de la tabla
  tbody.innerHTML = "";
  activePageData.forEach(row => {
    // Saltar filas vacías
    if (row.length === 0 || row.join("") === "") return;
    const tr = document.createElement("tr");
    row.forEach(cell => {
      tr.innerHTML += `<td>${cell}</td>`;
    });
    tbody.appendChild(tr);
  });

  // Actualizar textos y estados de botones
  pageIndicator.innerText = `Página ${currentPage} de ${totalPages}`;
  btnPrevPage.disabled = currentPage === 1;
  btnNextPage.disabled = currentPage === totalPages;

  // Mostrar u ocultar barra de paginación
  if (dataRows.length > rowsPerPage) {
    paginationControls.style.display = "flex";
  } else {
    paginationControls.style.display = "none";
  }
}

// Listeners para controles de paginación
btnPrevPage.addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentPage > 1) {
    currentPage--;
    renderActivePage();
  }
});

btnNextPage.addEventListener("click", (e) => {
  e.stopPropagation();
  const dataRows = parsedRows.slice(1);
  const totalPages = Math.ceil(dataRows.length / rowsPerPage) || 1;
  if (currentPage < totalPages) {
    currentPage++;
    renderActivePage();
  }
});

// Limpiar el archivo y restablecer la vista
btnClearFile.addEventListener("click", (e) => {
  e.stopPropagation();
  resetUploadState();
});

function resetUploadState() {
  selectedFile = null;
  parsedRows = [];
  currentPage = 1;
  mainFileInput.value = "";
  uploadZoneText.innerText = "Arrastrá o hacé clic para buscar un archivo CSV";
  btnClearFile.classList.add("hidden");

  // Ocultar tabla y mostrar vacío
  tbody.innerHTML = "";
  headerRow.innerHTML = "<th>ID</th><th>Nombre</th><th>Apellido</th>";
  emptyMessage.style.display = "block";
  tablaResultados.style.display = "none";
  paginationControls.style.display = "none";
}

// Botón de subir archivo al servidor
btnUpload.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (!selectedFile) {
    showMessage("Por favor, selecciona un archivo CSV primero.", "error");
    return;
  }

  const type = selectFileType.value;
  // Mapeamos el tipo del frontend al endpoint correcto del backend
  let backendType = null;
  if (type === "alumnos") backendType = "alumnos";
  if (type === "notas") backendType = "notas";
  if (type === "encuestaInicial") backendType = "encuestaInicial";
  if (type === "encuestaPeriodica") backendType = "encuestaPeriodica";
  if (type === "entrevista") backendType = "entrevista";

  if (!backendType) {
    showMessage("Por favor, selecciona una clase (tipo de archivo) antes de subir.", "error");
    return;
  }

  btnUpload.disabled = true;
  btnUpload.innerHTML = `<span class="material-symbols-outlined" style="font-size: 20px;">sync</span> Subiendo...`;

  try {
    const success = await Post_csv(selectedFile, backendType);
    if (success) {
      showMessage("¡Archivo cargado y procesado exitosamente!", "success");
      resetUploadState();
    } else {
      showMessage("Error al cargar el archivo en el servidor. Revisa el formato.", "error");
    }
  } catch (error) {
    console.error("Error al subir:", error);
    showMessage("Ocurrió un error inesperado al subir el archivo.", "error");
  } finally {
    btnUpload.disabled = false;
    btnUpload.innerHTML = `<span class="material-symbols-outlined">publish</span> Subir Archivo`;
  }
});

// Soporte de Drag and Drop
uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.style.borderColor = "var(--primary)";
  uploadZone.style.background = "var(--surface-container)";
});

uploadZone.addEventListener("dragleave", () => {
  uploadZone.style.borderColor = "var(--outline-variant)";
  uploadZone.style.background = "var(--surface-container-low)";
});

uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadZone.style.borderColor = "var(--outline-variant)";
  uploadZone.style.background = "var(--surface-container-low)";

  if (e.dataTransfer.files.length > 0) {
    handleFileSelect(e.dataTransfer.files[0]);
  }
});

// Función para mostrar mensajes tipo toast en el contenedor
function showMessage(text, type = "info") {
  const container = document.getElementById("mensaje");
  if (!container) return;

  container.innerHTML = "";
  const div = document.createElement("div");
  div.style.padding = "8px 16px";
  div.style.borderRadius = "8px";
  div.style.fontSize = "14px";
  div.style.fontWeight = "600";
  div.style.display = "inline-block";

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
  }, 5000);
}