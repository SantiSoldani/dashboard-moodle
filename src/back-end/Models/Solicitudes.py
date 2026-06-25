from dataclasses import dataclass
from datetime import datetime
from sqlalchemy import text

@dataclass
class Solicitud:
    id: int
    dni_alumno: str
    dni_tutor: str | None
    leida: bool
    created_at: datetime

def crear_solicitud(dni_alumno: str, dni_tutor: str | None, db):
    query = text("""
        INSERT INTO "Solicitudes" (dni_alumno, dni_tutor, leida, created_at)
        VALUES (:dni_alumno, :dni_tutor, False, :created_at)
        RETURNING id, dni_alumno, dni_tutor, leida, created_at
    """)
    
    result = db.execute(query, {
        "dni_alumno": dni_alumno,
        "dni_tutor": dni_tutor,
        "created_at": datetime.now()
    }).fetchone()
    db.commit()
    if result:
        return Solicitud(
            id=result.id,
            dni_alumno=result.dni_alumno,
            dni_tutor=result.dni_tutor,
            leida=result.leida,
            created_at=result.created_at
        )
    return None

def marcar_leida(id: int, db):
    query = text("""UPDATE "Solicitudes" SET leida = True WHERE id = :id""")
    db.execute(query, {"id": id})
    db.commit()
    return

def eliminar_solicitud(id: int, db):
    query = text("""DELETE FROM "Solicitudes" WHERE id = :id""")
    db.execute(query, {"id": id})
    db.commit()
    return

def obtener_solicitudes(db):
    query = text("""SELECT id, dni_alumno, dni_tutor, leida, created_at FROM "Solicitudes" WHERE leida = False""")
    results = db.execute(query).fetchall()
    
    solicitudes = []
    for row in results:
        solicitudes.append(SolicitudDto(
            id=row[0],
            dni_alumno=row[1],
            dni_tutor=row[2],
            leida=row[3],
            created_at=row[4]
        ))
    return solicitudes

def obtener_solicitudes_tutor(dni: str, db):
    query = text("""SELECT id, dni_alumno, dni_tutor, leida, created_at FROM "Solicitudes" WHERE dni_tutor = :dni AND leida = False""")
    results = db.execute(query, {"dni": dni}).fetchall()
    
    solicitudes = []
    for row in results:
        solicitudes.append(SolicitudDto(
            id=row[0],
            dni_alumno=row[1],
            dni_tutor=row[2],
            leida=row[3],
            created_at=row[4]
        ))
    return solicitudes
