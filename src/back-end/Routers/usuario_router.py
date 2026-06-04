from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import server
from Controllers import UsuarioController

router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"],
)

@router.post("/")
async def add_usuario(usuario_data: dict, db: Session = Depends(server.get_db)):
    """
    Ruta para agregar un usuario.
    """
    usuario = UsuarioController.add_usuario(usuario_data, db)
    return {"message": "Usuario agregado correctamente", "usuario": usuario}

@router.delete("/{dni}")
async def delete_usuario(dni: str, db: Session = Depends(server.get_db)):
    """
    Ruta para eliminar un usuario por DNI.
    """
    UsuarioController.delete_usuario(dni, db)
    return {"message": f"Usuario {dni} eliminado correctamente"}

@router.put("/{dni}/rol")
async def update_rol(dni: str, nuevo_rol: str, db: Session = Depends(server.get_db)):
    """
    Ruta para cambiar el rol de un usuario.
    """
    UsuarioController.update_rol(dni, nuevo_rol, db)
    return {"message": f"Rol del usuario {dni} actualizado a {nuevo_rol}"}

@router.get("/dni/{dni}")
async def get_usuario_by_dni(dni: str, db: Session = Depends(server.get_db)):
    """
    Ruta para traer un usuario por su DNI.
    """
    usuario = UsuarioController.get_usuario_by_dni(dni, db)
    return {"usuario": usuario} if usuario else {"message": "Usuario no encontrado"}

@router.get("/rol/{rol}")
async def get_usuarios_by_rol(rol: str, db: Session = Depends(server.get_db)):
    """
    Ruta para traer todos los usuarios por su rol (ej: Instructor).
    """
    usuarios = UsuarioController.get_usuarios_by_rol(rol, db)
    return {"usuarios": usuarios}
