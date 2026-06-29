from types import SimpleNamespace

from Models import Notas
from Models.Notas import NotasDto


def fetch_notas(db):
    return Notas.get_notas(db)


def fetch_notas_alumno(db, dni):
    return Notas.get_nota_by_dni(db, dni)


def get_promedio_general(db):
    return Notas.get_promedio_general(db)


def post_notas(db, notas: list[SimpleNamespace]):
    try:
        Notas.post_notas(
            [
                NotasDto(
                    id=0,
                    dni_alumno=str(nota.dni_alumno),
                    id_materia=nota.id_materia,
                    nota=nota.nota,
                )
                for nota in notas
            ],
            db,
        )
        # print("volvi de la funcion")
        return
    except Exception as e:
        db.rollback()
        print(f"error al insertar {e}")
        raise


def get_stats(indicador: str, dni: str, db):

    if dni == "all":
        notas = fetch_notas(db)
    else:
        notas = fetch_notas_alumno(db, dni)

    if indicador == "prom":
        return [sum(nota.nota for nota in notas) / len(notas)]

    else:
        return 0


def get_promedio_materias(db):
    return Notas.get_promedio_materias(db)
