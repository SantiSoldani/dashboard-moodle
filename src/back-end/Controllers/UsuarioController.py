from ssl import create_default_context
from venv import create

from Models import Semaforo, Usuario
from Models.Usuario import UsuarioDTO
from numpy._core.numeric import roll
from sqlalchemy.orm.attributes import create_proxied_attribute


def add_usuario(usuario_data: dict, db):

    rol_aux = usuario_data.get("rol")
    nuevo_usuario = UsuarioDTO(
        dni=usuario_data.get("dni"),
        rol=rol_aux,
        ult_coneccion=usuario_data.get("ult_coneccion"),
        created_at=usuario_data.get("created_at"),
    )
    Usuario.post_Usuario(nuevo_usuario, db)

    # Si el usuario nuevo es Estudiante, se le crea un semaforo
    if rol_aux == "Learner":
        semaforo = Semaforo.semaforoDTO(
            dni_alumno=usuario_data.get("dni"),
            color="gris",
            score=0,
        )
        Semaforo.Post_Semaforo(semaforo, db)
    return nuevo_usuario


def delete_usuario(dni: str, db):
    Usuario.delete_usuario(dni, db)


def update_rol(dni: str, nuevo_rol: str, db):
    Usuario.update_rol(dni, nuevo_rol, db)


def get_usuario_by_dni(dni: str, db):
    return Usuario.get_usuario_by_dni(dni, db)


def get_usuarios_by_rol(rol: str, db):
    return Usuario.get_usuarios_by_rol(rol, db)

def esTutor(dni: str, db):
    return Usuario.esTutor(dni, db)

