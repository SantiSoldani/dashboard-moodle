from dataclasses import dataclass
from datetime import date, datetime

from Models import Alumno
from sqlalchemy import text


@dataclass
class TutorDTO:
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


def post_tutor(tutor: TutorDTO, db):
    query = text(
        "INSERT INTO Tutores (dni, nombre, apellido, email) VALUES (:dni, :nombre, :apellido, :email)"
    )
    db.execute(
        query,
        {
            "dni": tutor.dni,
            "nombre": tutor.nombre,
            "apellido": tutor.apellido,
            "email": tutor.email,
        },
    )
    return db.commit()


def get_alumnos_by_tutor(dni: str, db):
    alumnosPorTutor = []

    query = text("SELECT * FROM Tutor-Alumno WHERE dni_tutor = :dni")
    result = db.execute(query, {"dni_tutor": dni})
    alumnos = result.fetchall()
    for alumno in alumnos:
        alumnosPorTutor.append(Alumno.Get_alumnos_with_stats(db, dni=alumno.dni))
    return alumnosPorTutor


def delete_tutor(dni: str, db):
    query = text("DELETE FROM Tutores WHERE dni = :dni")
    db.execute(query, {"dni": dni})
    return db.commit()
