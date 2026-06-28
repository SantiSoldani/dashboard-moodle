from dataclasses import dataclass
from datetime import date, datetime
from sqlalchemy import text

def get_alumnos_by_tutor_dni(dni,db):
    query = text("""SELECT * FROM "Tutor-Alumno" WHERE dni_tutor = :dni""")
    return db.execute(query, {"dni": dni}).mappings().fetchall()

def get_tutor_by_alumno_dni(dni,db):
    query = text("""SELECT * FROM "Tutor-Alumno" WHERE dni_alumno = :dni""")
    return db.execute(query, {"dni": dni}).mappings().fetchone()

def post_tutor_alumno(tutor_dni, alumno_dnis, db):
    query = text("""INSERT INTO "Tutor-Alumno" (dni_tutor, dni_alumno) VALUES (:tutor_dni, :alumno_dni)""")
    for alumno_dni in alumno_dnis:
        db.execute(query, {"tutor_dni": tutor_dni, "alumno_dni": alumno_dni})
    db.commit()
    return {"message": f"{len(alumno_dnis)} alumnos asignados al tutor {tutor_dni}"}

def delete_tutor_alumno(tutor_dni, alumno_dni,db):
    query = text("""DELETE FROM "Tutor-Alumno" WHERE dni_tutor = :tutor_dni AND dni_alumno = :alumno_dni""")
    db.execute(query, {"tutor_dni": tutor_dni, "alumno_dni": alumno_dni}).fetchall()
    return db.commit()