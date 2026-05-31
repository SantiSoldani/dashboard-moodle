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
    color: str
    score: float
    legajo: str


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

def Get_alumnos_with_stats(db) -> list[AlumnoDto]:
    '''
    Trae a todos los alumnos pero agregar la informacion de la nueva tabla 'Semaforo'
    '''
    alumnos = []
    query = text("""
        SELECT 
            "Alumnos".nombre, 
            "Alumnos".apellido, 
            "Alumnos".email, 
            "Alumnos".carrera, 
            "Alumnos".dni, 
            "Alumnos".fecha_inicio, 
            "Alumnos".legajo, 
            "Semaforo".color, 
            "Semaforo".score 
        FROM "Alumnos" 
        LEFT JOIN "Semaforo" ON "Alumnos".dni = "Semaforo".dni_alumno 
        ORDER BY "Alumnos".nombre
    """)
    fetched = (db.execute(query)).mappings().fetchall()
    for row in fetched:
        data = dict(row)
        if data.get("color") is None:
            data["color"] = "gris"
        if data.get("score") is None:
            data["score"] = -1.0
        alumnos.append(AlumnoDto(**data))
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
