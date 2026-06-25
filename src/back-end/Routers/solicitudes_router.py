from fastapi import APIRouter, Depends, Request
from sqlmodel import Session
import server
from Controllers import SolicitudesController

router = APIRouter(
    prefix="/solicitudes"
)

@router.get("/listar")
async def listar_solicitudes(db: Session = Depends(server.get_db)):
    return SolicitudesController.obtener_solicitudes(db)

@router.get("/listar/{dni_tutor}", status_code=200)
async def listar_solicitudes_tutor(dni_tutor:str , db: Session = Depends(server.get_db)):
    return SolicitudesController.obtener_solicitudes_tutor(dni_tutor,db)

@router.post("/crear", status_code=200)
async def crear_solicitud(request: Request, db: Session = Depends(server.get_db)):
    data = await request.json()
    dni_alumno = data.get("dni_alumno")
    dni_tutor = data.get("dni_tutor")
    return SolicitudesController.crear_solicitud(dni_alumno,dni_tutor,db)

@router.put("/marcar_leida/{id}", status_code=200)
async def marcar_leida(id:int , db: Session = Depends(server.get_db)):
    return SolicitudesController.marcar_leida(id,db)

@router.delete("/{id}")
async def eliminar_solicitud(id:int, db: Session = Depends(server.get_db)):
    return SolicitudesController.eliminar_solicitud(id,db)
