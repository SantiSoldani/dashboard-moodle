from dataclasses import dataclass
from hashlib import algorithms_available
from math import nan
from pydoc import plain
from types import SimpleNamespace

from pydantic.networks import EmailStr
from sqlalchemy import text
from sqlalchemy.sql.sqltypes import SmallInteger


@dataclass
class AlumnoDto:
    nombre: str
    apellido: str
    email: EmailStr
    dni: str
    fecha_inicio: int
    materias_aprobadas: int
    pre: float
    plan_de_estudios: int
    carrera: str = "Industrial"
    color: str = "gris"


def Post_alumno_FromEncuesta(alumno: AlumnoDto, db):
    query = text(
        """INSERT INTO "Alumnos" (dni, nombre, apellido, email, fecha_inicio, carrera, materias_aprobadas, "PRE", plan_de_estudios) VALUES (:dni, :nombre, :apellido, :email, :fecha_inicio, :carrera, :materias_aprobadas, :pre, :plan_de_estudios)
        ON CONFLICT (dni) DO UPDATE SET materias_aprobadas = :materias_aprobadas, "PRE" = :pre, plan_de_estudios = :plan_de_estudios"""
    )
    db.execute(
        query,
        {
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "email": alumno.email,
            "dni": alumno.dni,
            "fecha_inicio": alumno.fecha_inicio,
            "carrera": "industrial",
            "materias_aprobadas": alumno.materias_aprobadas,
            "pre": alumno.pre,
            "plan_de_estudios": alumno.plan_de_estudios,
        },
    )
    return db.commit()


def Post_Alumno(alumno: AlumnoDto, db):

    # SQL QUERY INSERT INTO alumnos VALUES ()
    query = text(
        """INSERT INTO "Alumnos" (dni, nombre, apellido, email, fecha_inicio, carrera) VALUES (:dni, :nombre, :apellido, :email, :fecha_inicio, :carrera) ON CONFLICT (dni) DO NOTHING"""
    )
    db.execute(
        query,
        {
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "email": alumno.email,
            "dni": alumno.dni,
            "fecha_inicio": alumno.fecha_inicio,
            "carrera": "Industrial",
        },
    )

    return db.commit()


def Get_alumno_by_dni(dni: str, db) -> AlumnoDto:
    print("alumno")
    query = text("""SELECT * FROM "Alumnos" WHERE dni = :dni""")
    alumno_by_dni = db.execute(query, {"dni": dni}).mappings().fetchone()
    print(alumno_by_dni)
    if alumno_by_dni is None:
        # return None
        raise ValueError(f"Alumno con dni {dni} no encontrado")
    return AlumnoDto(
        nombre=alumno_by_dni["nombre"],
        apellido=alumno_by_dni["apellido"],
        email=alumno_by_dni["email"],
        dni=alumno_by_dni["dni"],
        fecha_inicio=alumno_by_dni["fecha_inicio"],
        carrera=alumno_by_dni["carrera"],
        pre=alumno_by_dni["PRE"],
        materias_aprobadas=alumno_by_dni["materias_aprobadas"],
        plan_de_estudios=alumno_by_dni["plan_de_estudios"],
    )


def Get_alumnos(db) -> list[AlumnoDto]:
    # SQL QUERY SELECT * FROM alumnos ORDER BY nombre
    alumnos_list = []
    query = text("""SELECT *  FROM "Alumnos" ORDER BY dni""")
    fetched_alumnos = (db.execute(query)).mappings().fetchall()
    for alumno in fetched_alumnos:
        print(alumno["PRE"] is not nan)
        print(alumno["PRE"])
        alumnos_list.append(
            AlumnoDto(
                nombre=alumno["nombre"],
                apellido=alumno["apellido"],
                email=alumno["email"],
                dni=alumno["dni"],
                fecha_inicio=alumno["fecha_inicio"],
                carrera=alumno["carrera"],
                pre=0,
                materias_aprobadas=alumno["materias_aprobadas"],
                plan_de_estudios=alumno["plan_de_estudios"],
            )
        )
    return alumnos_list


def Get_alumnos_with_stats(db) -> list[AlumnoDto]:
    """
    Trae a todos los alumnos pero agregar la informacion de la nueva tabla 'Semaforo'
    """
    alumnos = []
    query = text("""
        SELECT
            "Alumnos".nombre,
            "Alumnos".apellido,
            "Alumnos".email,
            "Alumnos".carrera,
            "Alumnos".dni,
            "Alumnos".fecha_inicio,
            "Semaforo".color,
            "Semaforo".score,
            "Semaforo".created_at
        FROM "Alumnos"
        LEFT JOIN (
            SELECT *,
                   ROW_NUMBER() OVER (PARTITION BY dni_alumno ORDER BY created_at DESC) as rn
            FROM "Semaforo"
        ) "Semaforo" ON "Alumnos".dni = "Semaforo".dni_alumno AND "Semaforo".rn = 1
        ORDER BY "Alumnos".dni ASC
    """)

    fetched = (db.execute(query)).mappings().fetchall()
    for row in fetched:
        data = dict(row)
        if data.get("color") is None:
            data["color"] = "gris"
        if data.get("score") is None:
            data["score"] = 0
        alumnos.append(SimpleNamespace(**data))
    return alumnos


def set_state(dni: str, color: str, score: float, db):
    # SQL QUERY UPDATE alumnos SET color = ? WHERE dni = ? VALUES(color, dni)
    query = text(
        """UPDATE "Alumnos" SET color = :color, score = :score WHERE dni = :dni"""
    )
    db.execute(query, {"color": color, "dni": str(dni), "score": score})
    return


def get_score(dni: str, db) -> float:
    query = text("""SELECT score FROM "Alumnos" WHERE dni = :dni""")
    result = db.execute(query, {"dni": dni}).fetchone()
    print("score", result)
    return result[0]
