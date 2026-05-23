from dataclasses import dataclass

from pydantic.networks import EmailStr
from sqlalchemy import text


@dataclass
class AlumnoDto:
    nombre: str
    apellido: str
    email: EmailStr
    carrera: str
    dni: str
    fecha_inicio: str
    estado: str
    score: float


def Post_Alumno(alumno: AlumnoDto, db):

    # SQL QUERY INSERT INTO alumnos VALUES ()
    query = text(
        """INSERT INTO "Alumnos" (dni, nombre, apellido, email, fecha_inicio) VALUES (:dni, :nombre, :apellido, :email, :fecha_inicio) ON CONFLICT (dni) DO NOTHING"""
    )
    db.execute(
        query,
        {
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "email": alumno.email,
            "dni": alumno.dni,
            "fecha_inicio": alumno.fecha_inicio,
        },
    )

    return  # db.commit()


def Get_alumno(dni: str, db) -> AlumnoDto:
    # SQL QUERY SELECT * FROM alumnos WHERE dni = ? VALUES(dni)
    query = text("""SELECT * FROM "Alumnos" WHERE dni = :dni""")

    return AlumnoDto(**(db.execute(query, {"dni": dni}).mappings().fetchone()))


def Get_alumnos(db) -> list[AlumnoDto]:
    # SQL QUERY SELECT * FROM alumnos ORDER BY nombre
    alumnos = []
    query = text("""SELECT * FROM "Alumnos" ORDER BY nombre""")
    fetched = (db.execute(query)).mappings().fetchall()
    for row in fetched:
        alumnos.append(AlumnoDto(**row))
    return alumnos


def set_state(dni: str, estado: str, score: float, db):
    # SQL QUERY UPDATE alumnos SET estado = ? WHERE dni = ? VALUES(estado, dni)
    query = text(
        """UPDATE "Alumnos" SET estado = :estado, score = :score WHERE dni = :dni"""
    )
    db.execute(query, {"estado": estado, "dni": str(dni), "score": score})
    return


def get_score(dni: str, db) -> float:
    query = text("""SELECT score FROM "Alumnos" WHERE dni = :dni""")
    result = db.execute(query, {"dni": dni}).fetchone()
    print("score", result)
    return result[0]
