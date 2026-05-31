import json

import server
from Controllers import AlumnoController
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/alumnos",
    tags=["alumnos"],
)


@router.get("/Bydni/{student_dni}")
async def get_student(student_dni: str, db: Session = Depends(server.get_db)):

    alumno = AlumnoController.Get_alumno_Bydni(student_dni, db)
    json_alumno = json.dumps(alumno.__dict__)
    print(json_alumno)

    return json_alumno


@router.get("/all", status_code=200)
async def get_students(db: Session = Depends(server.get_db)):
    """
    la idea es dependiendo del url param del front obtener un estudiante particualar o traer todos los estudiantes
    para reciclar codigo. Tal vez vamos a necesitar una clase que tenga una coleccion de alumnos por ejemplo.
    """
    try:
        alumnos = AlumnoController.Get_alumnos(db)
        json_alumnos = json.dumps([a.__dict__ for a in alumnos], indent=4)
        # print(json_alumnos)
        return json_alumnos
    except Exception as e:
        print(e)

@router.get("/all-stats", status_code=200)
async def get_students_with_stats(db: Session = Depends(server.get_db)):
    try:
        alumnos = AlumnoController.Get_alumnos_with_stats(db)
        return [a.__dict__ for a in alumnos]
    except Exception as e:
        print(f"Error en get_students_with_stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))