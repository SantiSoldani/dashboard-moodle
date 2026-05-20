import json

from Controllers import AlumnoController
from fastapi import APIRouter

router = APIRouter(
    prefix="/students",
    tags=["students"],
)


@router.get("/{student_dni}")
async def get_student(student_dni: str):

    alumno = AlumnoController.Get_alumno_Bydni(student_dni)
    json_alumno = json.dumps(alumno)

    return json_alumno


@router.get("/all", status_code=200)
async def get_students():
    """
    la idea es dependiendo del url param del front obtener un estudiante particualar o traer todos los estudiantes
    para reciclar codigo. Tal vez vamos a necesitar una clase que tenga una coleccion de alumnos por ejemplo.
    """
    try:
        alumnos = AlumnoController.Get_alumnos()
        json_alumnos = json.dumps(alumnos)
        return json_alumnos
    except Exception as e:
        print(e)
