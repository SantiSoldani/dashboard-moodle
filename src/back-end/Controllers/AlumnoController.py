from types import SimpleNamespace

from Models import Alumno
from Models.Alumno import AlumnoDto
from sqlalchemy.sql.expression import Null


def Post_alumnos_FromEncuesta(alumno: SimpleNamespace, db):
    print("alumno: ", alumno)
    Alumno.Post_alumno_FromEncuesta(
        Alumno.AlumnoDto(
            nombre=str(alumno.nombre),
            apellido=str(alumno.apellido),
            email=str(alumno.mail),
            dni=str(alumno.dni),
            fecha_inicio=alumno.fecha_inicio,
            carrera=alumno.plan_de_estudios,
            materias_aprobadas=alumno.materias_aprobadas,
            plan_de_estudios=alumno.plan_de_estudios,
            pre=alumno.pre,
        ),
        db,
    )
    print("termine el commit")


def Post_alumnos(Alumnos: list[SimpleNamespace], db):
    for alumno in Alumnos:
        Alumno.Post_Alumno(
            Alumno.AlumnoDto(
                nombre=str(alumno.nombre),
                apellido=str(alumno.apellido),
                email=str(alumno.email),
                dni=str(alumno.dni),
                fecha_inicio=-1,
                carrera=alumno.carrera,
                materias_aprobadas=-1,
                pre=-1,
                plan_de_estudios=-1,
            ),
            db,
        )

    return db.commit()


def Actualizar_estado(alumnos: list[tuple], db):

    for alumno in alumnos:
        Alumno.set_state(alumno[1], str(alumno[0]), alumno[2], db)
        print(alumno[1], str(alumno[0]), alumno[2])
    return db.commit()


def Get_alumnos(db) -> list[AlumnoDto]:
    alumnos = Alumno.Get_alumnos(db)
    return alumnos


def Get_alumnos_with_stats(db) -> list[AlumnoDto]:
    alumnos = Alumno.Get_alumnos_with_stats(db)
    return alumnos


def Get_alumno_Bydni(dni: str, db):
    alumno = Alumno.Get_alumno_by_dni(dni, db)
    return alumno

def toState(aprobacion: float) -> str:

    if aprobacion < 0.2:
        return "rojo"
    elif aprobacion <= 0.6:
        return "amarillo"
    else:
        return "verde"


def get_score(dni: str, db) -> float:
    return Alumno.get_score(dni, db)
