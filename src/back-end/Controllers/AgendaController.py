from Models import Agendas

def buscar_entrevista(dni, db):
    return Agendas.buscar_entrevista(dni, db)

def crear_entrevista(dni_alumno, dni_entrevistador, fecha_agendada, db):
    return Agendas.crear_entrevista(dni_alumno, dni_entrevistador, fecha_agendada, db)

def marcar_entrevista(id_entrevista, db):
    return Agendas.marcar_entrevista(id_entrevista, db)