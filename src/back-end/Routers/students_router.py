import json

from fastapi import APIRouter
from Models import Alumno

router = APIRouter(
    prefix="/students",
    tags=["students"],
)


@router.get(f"/{student_dni}")
async def get_student(student_dni: str):

    alumno = Alumno.alumno_by_dni(student_dni)
    json_alumno = json.dumps(alumno)

    return json_alumno


@router.get("/all", status_code=200)
async def get_students():
    """
    la idea es dependiendo del url param del front obtener un estudiante particualar o traer todos los estudiantes
    para reciclar codigo
    """

    return {
        # aca es donde se devuelve un json coleccion de objetos alumno
    }
