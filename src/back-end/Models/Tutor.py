from dataclasses import dataclass
from sqlalchemy import text
from datetime import datetime, date
from Models import Alumno

@dataclass
class Tutor:
    dni: str
    nombre: str
    apellido: str
    email: str

def get_tutores(db):
    query = text("""SELECT * FROM "Tutores" """)
    result = db.execute(query)
    tutores = result.fetchall()
    return tutores

def get_tutor_by_dni(dni: str, db):
    query = text("SELECT * FROM Tutores WHERE dni = :dni")
    result = db.execute(query, {"dni": dni})
    tutor = result.fetchone()
    return tutor

def post_tutor(tutor: Tutor, db):
    query = text("INSERT INTO Tutores (dni, nombre, apellido, email) VALUES (:dni, :nombre, :apellido, :email)")
    db.execute(query, {
        "dni": tutor.dni,
        "nombre": tutor.nombre, 
        "apellido": tutor.apellido, 
        "email": tutor.email
    })
    return db.commit()

def get_alumnos_by_tutor(dni: str, db):
    alumnosPorTutor = []
    
    query = text("SELECT * FROM Tutor-Alumno WHERE dni_tutor = :dni")
    result = db.execute(query, {"dni_tutor": dni})
    alumnos = result.fetchall()
    for alumno in alumnos:
        alumnosPorTutor.append(Alumno.Get_alumnos_with_stats(db, dni=alumno.dni))
    return alumnosPorTutor