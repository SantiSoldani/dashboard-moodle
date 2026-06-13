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

    usuario = UsuarioController.add_usuario(usuario_data, db)
    return usuario

@router.delete("/{dni}")
async def delete_usuario(dni: str, db: Session = Depends(server.get_db)):

    UsuarioController.delete_usuario(dni, db)
    return {"message": f"Usuario {dni} eliminado correctamente"}

@router.put("/{dni}/rol")
async def update_rol(dni: str, nuevo_rol: str, db: Session = Depends(server.get_db)):

    UsuarioController.update_rol(dni, nuevo_rol, db)
    return {"message": f"Rol del usuario {dni} actualizado a {nuevo_rol}"}

@router.get("/dni/{dni}")
async def get_usuario_by_dni(dni: str, db: Session = Depends(server.get_db)):
    usuario = UsuarioController.get_usuario_by_dni(dni, db)
    return usuario

@router.get("/rol/{rol}")
async def get_usuarios_by_rol(rol: str, db: Session = Depends(server.get_db)):
    usuarios = UsuarioController.get_usuarios_by_rol(rol, db)
    return {"usuarios": usuarios}
