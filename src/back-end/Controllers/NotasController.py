from types import SimpleNamespace

from Models import Notas


def fetch_notas(db):
    return Notas.get_notas(db)


def fetch_nota(db, dni):
    return Notas.get_nota_by_dni(db, dni)


def post_notas(db, notas):

    for nota in notas:
        Notas.post_nota(db, nota)
