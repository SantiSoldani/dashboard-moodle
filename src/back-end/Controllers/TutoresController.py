from Models import Tutor

def add_tutor(tutor: Tutor, db):
    Tutor.post_tutor(tutor, db)

def delete_tutor(dni: str, db):

    Tutor.delete_tutor(dni, db)

def get_alumnos_by_tutor(tutor_dni: str, db):
    return Tutor.get_alumnos_by_tutor(tutor_dni, db)

def get_tutor_by_dni(dni: str, db):

    return Tutor.get_tutor_by_dni(dni, db)

def get_tutores(db):
    return Tutor.get_tutores(db)

