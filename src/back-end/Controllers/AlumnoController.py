from collections import defaultdict
from types import SimpleNamespace

from Models import Alumno, Semaforo
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
                materias_aprobadas=0,
                pre=0,
                plan_de_estudios=2024,
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


def Get_alumno_Bydni(dni: str, db) -> SimpleNamespace:
    alumno = Alumno.Get_alumno_by_dni(dni, db)
    return SimpleNamespace(**alumno.__dict__)


def toState(aprobacion: float) -> str:

    if aprobacion < 0.2:
        return "rojo"
    elif aprobacion <= 0.6:
        return "amarillo"
    else:
        return "verde"


def get_score(dni: str, db) -> float:
    return Alumno.get_score(dni, db)

def get_color(dni: str, db) -> str:
    return Alumno.get_color(dni, db)


def actualizar_Cuatrimestre(db):

    Alumno.aumentar_cuatrimestre(db)
    return db.commit()


def fetch_semaforos(db, dni):

    return Alumno.fetch_semaforos(db, dni)


def indicadoresXcohorte(cohorte, db):

    return Alumno.fetch_indicadoresXcohorte(cohorte, db)


def cuatrimestrales_filtrados(db, filtro, valor):

    raw = Alumno.get_cuatrimestrales_filtrados(db, filtro, valor)

    return raw


def iniciales_filtrados(db, filtro, valor):

    raw = Alumno.get_iniciales_filtrados(db, filtro, valor)

    return raw


def get_evolucion_semaforos(db, filtro, valor, piso, techo):

    raw = Semaforo.get_evolucion(db, filtro, valor, piso, techo)

    return raw

def get_criticos(db):
    return Semaforo.get_criticos(db)
