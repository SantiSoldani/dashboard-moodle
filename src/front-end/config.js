// Detecta automáticamente si estás en desarrollo o producción
const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BACKEND_URL = isDevelopment
  ? "http://localhost:8000" // En desarrollo
  : window.location.origin; // En producción

export function getBackendURL() {
  return BACKEND_URL;
}

export function getConfig() {
  const strObj = new String(BACKEND_URL);
  strObj.apiUrl = BACKEND_URL;
  strObj.env = {
    api_url: BACKEND_URL,
  };
  return strObj;
}
