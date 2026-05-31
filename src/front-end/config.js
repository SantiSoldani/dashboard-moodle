const BACKEND_URL = 'http://localhost:8000';

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