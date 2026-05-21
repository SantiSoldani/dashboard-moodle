from dataclasses import dataclass

from pydantic.networks import EmailStr


@dataclass
class AlumnoDto:
    id: int
    nombre: str
    apellido: str
    email: EmailStr
    dni: str
    estado: str
    fecha_inicio: str


def Post_Alumno(alumnos: AlumnoDto, db):

    # SQL QUERY INSERT INTO alumnos VALUES ()
    query = "INSERT INTO alumnos VALUES (?, ?, ?, ?, ?, ?, ?) IF NOT EXISTS"
    db.execute(
        query,
        (
            alumnos.id,
            alumnos.nombre,
            alumnos.apellido,
            alumnos.email,
            alumnos.dni,
            alumnos.estado,
            alumnos.fecha_inicio,
        ),
    )

    return db.commit().rowcount == 1


def Get_alumno(dni: str, db) -> AlumnoDto:
    # SQL QUERY SELECT * FROM alumnos WHERE dni = ? VALUES(dni)
    query = "SELECT * FROM alumnos WHERE dni = ?"
    return AlumnoDto(**db.execute(query, (dni,)).fetchone()[1])


def Get_alumnos(db) -> list[AlumnoDto]:
    # SQL QUERY SELECT * FROM alumnos ORDER BY nombre
    return


def set_state(dni: str, estado: str, db):
    # SQL QUERY UPDATE alumnos SET estado = ? WHERE dni = ? VALUES(estado, dni)
    return
