from Controllers import AgendaController
from fastapi import APIRouter, Request, Depends
from sqlmodel import Session
import server

router = APIRouter(
    prefix="/agendas"
)

@router.get("/buscar/{dni_alumno}")
def buscar_entrevista(dni_alumno, db : Session = Depends(server.get_db)):
    return AgendaController.buscar_entrevista(dni_alumno, db)

@router.post("/crear")
async def crear_entrevista(request: Request, db : Session = Depends(server.get_db)):
    data = await request.json()
    dni_alumno = data.get("dni_alumno")
    dni_entrevistador = data.get("dni_entrevistador")
    fecha_agendada = data.get("fecha_agendada")
    return AgendaController.crear_entrevista(dni_alumno, dni_entrevistador, fecha_agendada, db)

@router.post("/marcar")
async def marcar_entrevista(request: Request, db : Session = Depends(server.get_db)):
    data = await request.json()
    id_entrevista = data.get("id_entrevista")
    return AgendaController.marcar_entrevista(id_entrevista, db)
