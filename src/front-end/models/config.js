import { getBackendURL } from '../config.js';

export async function Post_Config_Iniciales(data) {
    try {
        const baseUrl = getBackendURL();
        const res = await fetch(`${baseUrl}/config/post/indicadores/iniciales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error al actualizar coeficientes iniciales');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function Post_Config_Cuatrimestrales(data) {
    try {
        const baseUrl = getBackendURL();
        const res = await fetch(`${baseUrl}/config/post/indicadores/cuatrimestrales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error al actualizar coeficientes cuatrimestrales');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function Post_Config_Materias(data) {
    try {
        const baseUrl = getBackendURL();
        const res = await fetch(`${baseUrl}/config/post/pesos/materias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error al actualizar pesos de materias');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
