from dataclasses import dataclass
from sqlalchemy import text

@dataclass
class Usuario:
    dni: str
    rol: str
    ult_coneccion: str
    created_at: str
    
    @staticmethod
    def post_Usuario(usuario: 'Usuario', db):
        query = text(
            """INSERT INTO "Usuarios" (dni, rol, ult_coneccion, created_at) VALUES (:dni, :rol, :ult_coneccion, :created_at) ON CONFLICT (dni) DO NOTHING"""
        )
        db.execute(
            query,
            {
                "dni": usuario.dni,
                "rol": usuario.rol,
                "ult_coneccion": usuario.ult_coneccion,
                "created_at": usuario.created_at,
            },
        )
        return db.commit()

    @staticmethod
    def delete_usuario(dni: str, db):
        query = text("""DELETE FROM "Usuarios" WHERE dni = :dni""")
        db.execute(query, {"dni": dni})
        return db.commit()

    @staticmethod
    def update_rol(dni: str, nuevo_rol: str, db):
        query = text("""UPDATE "Usuarios" SET rol = :rol WHERE dni = :dni""")
        db.execute(query, {"rol": nuevo_rol, "dni": dni})
        return db.commit()

    @staticmethod
    def get_usuario_by_dni(dni: str, db):
        query = text("""SELECT * FROM "Usuarios" WHERE dni = :dni""")
        result = db.execute(query, {"dni": dni}).fetchone()
        if result:
            return Usuario(
                dni=result[0],
                rol=result[1],
                ult_coneccion=result[2],
                created_at=result[3]
            )
        return None

    @staticmethod
    def get_usuarios_by_rol(rol: str, db):
        query = text("""SELECT * FROM "Usuarios" WHERE rol = :rol""")
        result = db.execute(query, {"rol": rol}).fetchall()
        usuarios = []
        for row in result:
            usuarios.append(Usuario(
                dni=row[0],
                rol=row[1],
                ult_coneccion=row[2],
                created_at=row[3]
            ))
        return usuarios
