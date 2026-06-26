from types import SimpleNamespace

from Models import Alumno, Entrevista


def post_entrevista(db, entrevista):

    entrevista.score = (
        ((entrevista.pse - 1) / 4)
        + ((entrevista.ic - 1) / 4)
        + ((entrevista.pep - 1) / 4)
        + ((entrevista.cl - 1) / 4)
        + ((entrevista.cv - 1) / 4)
        + ((entrevista.loc - 1) / 4)
        + ((entrevista.ra - 1) / 4)
    ) / 7

    Entrevista.post_entrevista(db, entrevista)


def get_puntaje(db, dni):
    return Entrevista.get_puntaje(db, dni)


def set_pre(db, dni, score):
    Alumno.reset_pre(db, dni, score)
