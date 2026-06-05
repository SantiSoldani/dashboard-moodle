import { getConfig } from "../config.js";

/**
 *
 * MODELO DEL ALUMNO ENCARGADOS DE LAS OPERACIONES TIPO API REST
 *
 *
 */

const tutorAPI = `${getConfig()}/tutor`;

export async function HandleGet_Tutor(dni = null, which = "get") {
    try {
        let response;
        const headers = { "ngrok-skip-browser-warning": "69420" };
        if (which == "get") {
            if (dni != null)
                (response = await fetch(`${tutorAPI}/get/${dni}`, { headers }))
            else
                (response = await fetch(`${tutorAPI}/get`, { headers }))
        }
        else if (which == "alumnos") {
            (response = await fetch(
                `${tutorAPI}/get/alumnos/${dni}`, { headers }
            ))
        }
        else if (which == "post") {
            (response = await fetch(`${tutorAPI}/post`, { headers }))
        }
        else if (which == "delete") {
            (response = await fetch(`${tutorAPI}/del/${dni}`, { headers }))
        }
        if (!response.ok) {
            throw new Error("Error en el fetch de los tutores");
        }

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error("Error al traer los tutores", error);
        return [];
    }
}
/*
RUTAS POSIBLES 
----
router = APIRouter(
    prefix="/tutor",
    tags=["Tutor"]
)

@router.get("/get")
@router.get("/get/{dni}")
@router.get("/get/alumnos/{dni}")
@router.post("/post")
@router.delete("/del/{dni}")
*/