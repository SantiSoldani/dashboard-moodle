from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
import server
from Models import Tutor_Alumno

router = APIRouter(
    prefix="/tutor_alumno",
    tags=["tutor_alumno"]
)

@router.get("/get/alumnos_by_tutor_dni/{dni}")
def get_alumnos_by_tutor_dni(dni: str, db: Session = Depends(server.get_db)):
    return Tutor_Alumno.get_alumnos_by_tutor_dni(dni,db)

@router.get("/get/tutor_by_alumno_dni/{dni}")
def get_tutor_by_alumno_dni(dni, db: Session = Depends(server.get_db)):
    return Tutor_Alumno.get_tutor_by_alumno_dni(dni,db)

@router.post("/post/tutor_alumno")
def post_tutor_alumno(tutor_dni, alumno_dni, db: Session = Depends(server.get_db)):
    return Tutor_Alumno.post_tutor_alumno(tutor_dni,alumno_dni,db)

@router.delete("/delete/tutor_alumno")
def delete_tutor_alumno(tutor_dni, alumno_dni, db: Session = Depends(server.get_db)):
    return Tutor_Alumno.delete_tutor_alumno(tutor_dni,alumno_dni,db)