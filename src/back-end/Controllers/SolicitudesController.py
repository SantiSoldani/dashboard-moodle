from Models import Solicitudes
from sqlmodel import Session


def crear_solicitud(dni_alumno:str, dni_tutor:str , db: Session):
    return Solicitudes.crear_solicitud(dni_alumno,dni_tutor,db)

def buscar_solicitud(dni_alumno:str , db: Session):
    return Solicitudes.buscar_solicitud(dni_alumno,db)

def marcar_leida(id: int, db: Session, ):
    return Solicitudes.marcar_leida(id,db)

def eliminar_solicitud(id:int , db : Session):
    return Solicitudes.eliminar_solicitud(id,db)

def obtener_solicitudes(db: Session):
    return Solicitudes.obtener_solicitudes(db)

def obtener_solicitudes_tutor(dni:str , db:Session ):
    return Solicitudes.obtener_solicitudes_tutor(dni,db)
