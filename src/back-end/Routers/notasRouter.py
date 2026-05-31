import json
import os

import server
from Controllers import DataController, NotasController
from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from pydantic.types import SecretType
from sqlalchemy.orm import Session

load_dotenv()

router = APIRouter(prefix="/notas", tags=["notas"])


@router.get("/all")
async def get_all_notas(db: Session = Depends(server.get_db)):
    try:
        notas = NotasController.fetch_notas(db)
        notas = json.dumps([nota for nota in notas])
    except Exception as e:
        return {"error": str(e)}

    return notas


@router.get("/alumno/{dni}")
async def get_notas_alumno(dni: str, db: Session = Depends(server.get_db)):
    try:
        notas = NotasController.fetch_notas_alumno(db, dni)
        notas = json.dumps([nota for nota in notas])
    except Exception as e:
        return {"error": str(e)}

    return notas


@router.get("/stats/{indicador}/{dni}")
async def get_stats(indicador: str, dni: str, db: Session = Depends(server.get_db)):
    try:
        stats = NotasController.get_stats(indicador, dni, db)
        stats = json.dumps(stats)
    except Exception as e:
        return {"error": str(e)}

    return stats
