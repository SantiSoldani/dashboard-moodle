// Detect the base URL automatically to fix iframe and ngrok routing issues
const BACKEND_URL = window.location.origin !== "null" ? window.location.origin : '';

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