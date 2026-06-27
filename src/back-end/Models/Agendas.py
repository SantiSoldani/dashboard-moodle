from dataclasses import dataclass
from datetime import datetime
from sqlalchemy import text

@dataclass
class Agenda():
    id: int #Es autoincremental, no se pasa por parametro
    dni_alumno: str 
    dni_entrevistador: str
    fecha_agendada: str
    pendiente: bool
    created_at: str

def buscar_entrevista(dni_alumno, db):
    query = text("""
    SELECT * FROM "Agendas" 
    WHERE dni_alumno = :dni_alumno AND pendiente = True
    ORDER BY created_at DESC, id DESC
    LIMIT 1
    """)
    result = db.execute(query, {"dni_alumno": dni_alumno}).fetchone()
    
    if result:
        return Agenda(
            id=result.id,
            dni_alumno=result.dni_alumno,
            dni_entrevistador=result.dni_entrevistador,
            fecha_agendada=result.fecha_agendada,
            pendiente=result.pendiente,
            created_at=result.created_at
        )
    return None

def crear_entrevista(dni_alumno, dni_entrevistador, fecha_agendada, db):
    query = text("""
    INSERT INTO "Agendas" (dni_alumno, dni_entrevistador, fecha_agendada, pendiente, created_at) 
    VALUES (:dni_alumno, :dni_entrevistador, :fecha_agendada, :pendiente, :created_at)
    """)
    db.execute(query, {
        "dni_alumno": dni_alumno,
        "dni_entrevistador": dni_entrevistador,
        "fecha_agendada": fecha_agendada,
        "pendiente": True,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    return db.commit()

def marcar_entrevista(id_entrevista, db):
    query = text("""
    UPDATE "Agendas" SET pendiente = False 
    WHERE id = :id_entrevista
    """)
    db.execute(query, {"id_entrevista": id_entrevista})
    return db.commit()
