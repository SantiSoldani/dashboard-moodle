import { getConfig } from "../config.js";

const solicitudesAPI = `${getConfig()}/solicitudes`;

export async function HandleGet_solicitudes() {
    try {
        const response = await fetch(`${solicitudesAPI}/listar`);
        if (!response.ok) {
            throw new Error("Error en el fetch de las solicitudes");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al traer las solicitudes", error);
        return [];
    }
}

export async function HandleGet_solicitudes_tutor(dni_tutor) {
    try {
        const response = await fetch(`${solicitudesAPI}/listar/${dni_tutor}`);
        if (!response.ok) {
            throw new Error("Error en el fetch de las solicitudes por tutor");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al traer las solicitudes por tutor", error);
        return [];
    }
}

export async function HandleMarcar_leida(id) {
    try {
        const response = await fetch(`${solicitudesAPI}/marcar_leida/${id}`, {
            method: "PUT"
        });
        if (!response.ok) {
            throw new Error("Error al marcar la solicitud como leída");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al marcar solicitud como leída", error);
        return null;
    }
}
