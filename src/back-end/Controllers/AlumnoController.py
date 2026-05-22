from types import SimpleNamespace

from Models import Alumno


def Post_alumnos(Alumnos: list[SimpleNamespace], db):

    for alumno in Alumnos:
        Alumno.Post_Alumno(
            Alumno.AlumnoDto(
                nombre=str(alumno.nombre),
                apellido=str(alumno.apellido),
                email=str(alumno.email),
                dni=str(alumno.dni),
                fecha_inicio=alumno.fecha_inicio,
                carrera=alumno.carrera,
                estado="",
            ),
            db,
        )

    return


def Actualizar_estado(alumnos: list[tuple], db):

    for alumno in alumnos:
        Alumno.set_state(toState(alumno[0]), alumno[1], db)
    return


def Get_alumnos(db) -> list[dict]:
    alumnos = Alumno.Get_alumnos(db)
    return alumnos


def Get_alumno_Bydni(dni: str, db) -> SimpleNamespace:
    alumno = Alumno.Get_alumno(dni, db)
    return SimpleNamespace(**alumno.__dict__)


def toState(aprobacion: float) -> str:

    if aprobacion < 0.2:
        return "rojo"
    elif aprobacion <= 0.6:
        return "amarillo"
    else:
        return "verde"
