from dataclasses import dataclass
from pydantic.networks import EmailStr
from sqlalchemy import text


@dataclass
class AlumnoDto:
    nombre: str
    apellido: str
    email: EmailStr
    dni: str
    fecha_inicio: str
    carrera: str = ""
    color: str = "gris"
    score: float = -1.0
    legajo: str = ""


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


def Get_alumno_by_dni(dni: str, db) -> AlumnoDto:
    
    query = text("""SELECT nombre, apellido, email, dni, fecha_inicio, carrera, legajo FROM "Alumnos" WHERE dni = :dni""")
    alumno_by_dni = db.execute(query, {"dni": dni}).mappings().fetchone()
    if (alumno_by_dni is None):
        return None
    return AlumnoDto(**alumno_by_dni)


def Get_alumnos(db) -> list[AlumnoDto]:
    # SQL QUERY SELECT * FROM alumnos ORDER BY nombre
    alumnos_list = []
    query = text("""SELECT nombre, apellido, email, dni, fecha_inicio, carrera, legajo FROM "Alumnos" ORDER BY dni""")
    fetched_alumnos = (db.execute(query)).mappings().fetchall()
    for alumno in fetched_alumnos:
        alumnos_list.append(AlumnoDto(**alumno))
    return alumnos_list

def Get_alumnos_with_stats(db, dni: str = None) -> list[AlumnoDto]:
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
        ORDER BY "Semaforo".score ASC, "Alumnos".dni ASC
    """)


    if (dni is not None):
        query += text("""
            WHERE "Alumnos".dni = """ + str(dni) + """
        """)

    fetched = (db.execute(query)).mappings().fetchall()
    for row in fetched:
        data = dict(row)
        if data.get("color") is None:
            data["color"] = "gris"
        if data.get("score") is None:
            data["score"] = 0
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
