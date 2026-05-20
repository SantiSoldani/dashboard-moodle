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


def Post_Alumnos(alumnos: list[AlumnoDto]):

    # SQL QUERY INSERT INTO alumnos VALUES ()

    return


def Get_alumno(dni: str) -> AlumnoDto:
    # SQL QUERY SELECT * FROM alumnos WHERE dni = ? VALUES(dni)
    return


def Get_alumnos() -> list[AlumnoDto]:
    # SQL QUERY SELECT * FROM alumnos ORDER BY nombre
    return


def set_state(dni: str, estado: str):
    # SQL QUERY UPDATE alumnos SET estado = ? WHERE dni = ? VALUES(estado, dni)
    return
