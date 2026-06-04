let BACKEND_URL = 'http://localhost:8000';

// Si estamos sirviendo el front desde FastAPI (la ruta incluye /app/)
// usamos una URL relativa para evitar problemas de CORS o Mixed Content
if (window.location.href.includes('/app')) {
    BACKEND_URL = '';
}

export function getBackendURL() {
    return BACKEND_URL;
}

export function getConfig() {
    const strObj = new String(BACKEND_URL);
    strObj.apiUrl = BACKEND_URL;
    strObj.env = {
        api_url: BACKEND_URL
    };
    return strObj;
}