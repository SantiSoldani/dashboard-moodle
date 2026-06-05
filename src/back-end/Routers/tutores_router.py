from fastapi import APIRouter, Depends
from Controllers import TutoresController
import server
from sqlalchemy.orm import Session
from Models import Tutor

router = APIRouter(
    prefix="/tutor",
    tags=["Tutor"]
)

@router.get("/get")
def get_tutores(db: Session = Depends(server.get_db)):
    return TutoresController.get_tutores(db)

@router.get("/get/{dni}")
def get_tutor_by_dni(dni: str, db: Session = Depends(server.get_db)):
    return TutoresController.get_tutor_by_dni(dni, db)

@router.get("/get/alumnos/{dni}")
def get_alumnos_by_tutor(dni:str, db: Session = Depends(server.get_db)):
    return TutoresController.get_alumnos_by_tutor(dni, db)

@router.post("/post")
def add_tutor(tutor: Tutor.Tutor, db: Session = Depends(server.get_db)):
    return TutoresController.add_tutor(tutor, db)

@router.delete("/del/{dni}")
def delete_tutor_by_dni(dni:str, db: Session = Depends(server.get_db)):
    return TutoresController.delete_tutor(dni,db)



