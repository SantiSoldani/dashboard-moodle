from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import server
from Controllers import LogController

router = APIRouter(
    prefix="/logs",
    tags=["logs"],
)

@router.post("/")
async def add_log(log_data: dict, db: Session = Depends(server.get_db)):
    """
    Ruta para agregar un nuevo log.
    """
    nuevo_log = LogController.add_log(log_data, db)
    return {"message": "Log agregado correctamente", "log": nuevo_log}

@router.get("/")
async def get_logs(db: Session = Depends(server.get_db)):
    """
    Ruta para extraer los logs.
    """
    logs = LogController.get_logs(db)
    return {"logs": logs}
