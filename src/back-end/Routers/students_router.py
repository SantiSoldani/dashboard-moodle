import json
import server
from Controllers import AlumnoController
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/alumnos",
    tags=["alumnos"],
)


@router.get("/get/stats", status_code=200)
async def get_students_with_stats(db: Session = Depends(server.get_db)):
    try:
        alumnos = AlumnoController.Get_alumnos_with_stats(db)
        return [a.__dict__ for a in alumnos]
    except Exception as e:
        print(f"Error en get_students_with_stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get/byDNI/{student_dni}")
async def get_student(student_dni: str, db: Session = Depends(server.get_db)):
    alumno = AlumnoController.Get_alumno_Bydni(student_dni, db)
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    return alumno.__dict__

@router.get("/get", status_code=200)
async def get_students(db: Session = Depends(server.get_db)):
    try:
        alumnos = AlumnoController.Get_alumnos(db)
        return [a.__dict__ for a in alumnos]
    except Exception as e:
        print(f"Error en get_students: {e}")
        raise HTTPException(status_code=500, detail=str(e))