from dataclasses import dataclass
from sqlalchemy import text

@dataclass
class Log:
    dni_usuario: str
    tipo_accion: str
    descripcion: str
    fecha: str

def post_Log(log: 'Log', db):
        query = text(
            """INSERT INTO "Logs" (dni_usuario, tipo_accion, descripcion, fecha) VALUES (:dni_usuario, :tipo_accion, :descripcion, :fecha) ON CONFLICT (dni_usuario) DO NOTHING"""
        )
        db.execute(
            query,
            {
                "dni_usuario": log.dni_usuario,
                "tipo_accion": log.tipo_accion,
                "descripcion": log.descripcion,
                "fecha": log.fecha,
            },
        )
        return db.commit()

def get_logs(db):
        query = text("""SELECT * FROM "Logs" """)
        result = db.execute(query).fetchall()
        logs = []
        for row in result:
            logs.append(Log(
                dni_usuario=row[0],
                tipo_accion=row[1],
                descripcion=row[2],
                fecha=row[3]
            ))
        return logs