import json
import os

import server
from Controllers import DataController, MateriasController, NotasController
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
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


@router.get("/promedio")
async def get_promedio_general(db: Session = Depends(server.get_db)):
    try:
        promedio = NotasController.get_promedio_general(db)
    except Exception as e:
        return {"error": str(e)}
    return promedio


@router.get("/promedio/materias")
def get_promedio_materias(db: Session = Depends(server.get_db)):
    try:
        promedio = NotasController.get_promedio_materias(db)
    except Exception as e:
        return {"error": str(e)}
    return promedio


@router.get("/stats/{indicador}/{dni}")
async def get_stats(indicador: str, dni: str, db: Session = Depends(server.get_db)):
    try:
        stats = NotasController.get_stats(indicador, dni, db)
        stats = json.dumps(stats)
    except Exception as e:
        return {"error": str(e)}

    return stats


@router.get("/materias/promedio", status_code=200)
async def get_promedioXmateria(db: Session = Depends(server.get_db)):
    try:
        return MateriasController.get_promedioXmateria(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
