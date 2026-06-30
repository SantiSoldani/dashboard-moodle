from dataclasses import dataclass
from datetime import date, datetime

from sqlalchemy import text


@dataclass
class UsuarioDTO:
    dni: str | None
    nombre: str | None
    apellido: str | None
    email: str | None
    rol: str | None
    ult_coneccion: str | None
    created_at: str | None


def post_Usuario(usuario: UsuarioDTO, db):
    query = text(
        """INSERT INTO "Usuarios" (dni, rol, nombre, apellido, email, ult_coneccion, created_at) VALUES (:dni, :rol, :nombre, :apellido, :email, :ult_coneccion, :created_at) ON CONFLICT (dni) DO NOTHING"""
    )
    db.execute(
        query,
        {
            "dni": usuario.dni,
            "rol": usuario.rol,
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "email": usuario.email,
            "ult_coneccion": usuario.ult_coneccion,
            "created_at": datetime.now(),
        },
    )
    return db.commit()


def delete_usuario(dni: str, db):
    query = text("""DELETE FROM "Usuarios" WHERE dni = :dni""")
    db.execute(query, {"dni": dni})
    return db.commit()


def update_rol(dni: str, nuevo_rol: str, db):
    query = text("""UPDATE "Usuarios" SET rol = :rol WHERE dni = :dni""")
    db.execute(query, {"rol": nuevo_rol, "dni": dni})
    if nuevo_rol == 'Tutor' and not esTutor(dni,db):
        query = text("""UPDATE "Usuarios" SET "esTutor" = True WHERE dni = :dni""")
        db.execute(query, {"dni": dni})
    return db.commit()


def get_usuario_by_dni(dni: str, db):
    query = text("""SELECT * FROM "Usuarios" WHERE dni = :dni""")
    result = db.execute(query, {"dni": dni}).fetchone()
    if result:
        return UsuarioDTO(
            dni = result.dni, rol=result.rol, ult_coneccion=result.ult_coneccion, created_at=result.created_at, nombre=result.nombre, apellido=result.apellido, email=result.email
        )
    return None


def get_usuarios_by_rol(rol: str, db):
    query = text("""SELECT * FROM "Usuarios" WHERE rol = :rol""")
    result = db.execute(query, {"rol": rol}).fetchall()
    usuarios = []
    print(result)
    for row in result:
        usuarios.append(
            {"dni": row.dni, "nombre": row.nombre, "apellido": row.apellido, "email": row.email}
        )
    
    return usuarios

def esTutor(dni,db):
    query = text("""SELECT "esTutor" FROM "Usuarios" WHERE dni = :dni""")
    result = db.execute(query, {"dni": dni}).fetchone()
    if result:
        print(result[0])
        return result[0]
    return False