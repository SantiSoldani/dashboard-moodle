from Models.Usuario import Usuario

def add_usuario(usuario_data: dict, db):
    """
    Agrega un nuevo usuario.
    """
    nuevo_usuario = Usuario(
        dni=usuario_data.get("dni"),
        rol=usuario_data.get("rol"),
        ult_coneccion=usuario_data.get("ult_coneccion"),
        created_at=usuario_data.get("created_at")
    )
    Usuario.post_Usuario(nuevo_usuario, db)
    return nuevo_usuario

def delete_usuario(dni: str, db):
    """
    Elimina un usuario de la base de datos por su DNI.
    """
    Usuario.delete_usuario(dni, db)

def update_rol(dni: str, nuevo_rol: str, db):
    """
    Actualiza el rol de un usuario existente.
    """
    Usuario.update_rol(dni, nuevo_rol, db)

def get_usuario_by_dni(dni: str, db):
    """
    Obtiene un usuario especifico por su DNI.
    """
    return Usuario.get_usuario_by_dni(dni, db)

def get_usuarios_by_rol(rol: str, db):
    """
    Obtiene todos los usuarios que posean un rol específico (ej: Docentes).
    """
    return Usuario.get_usuarios_by_rol(rol, db)
