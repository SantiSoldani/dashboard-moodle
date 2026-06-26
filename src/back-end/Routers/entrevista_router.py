from dataclasses import dataclass
from types import SimpleNamespace

import server
from Controllers import EntrevistaController
from fastapi import APIRouter, Depends, File, status
from pydantic import BaseModel
from pydantic_core.core_schema import definition_reference_schema
from sqlalchemy.orm import Session
from starlette.exceptions import HTTPException

router = APIRouter(prefix="/entrevista")


class RespuestasEntrevista(BaseModel):
    pse: int
    ic: int
    pep: int
    cl: int
    cv: int
    loc: int
    ra: int


class EntrevistaPayload(BaseModel):
    dni: str
    respuestas: RespuestasEntrevista


@router.post("/post_entrevista", status_code=200)
async def post_entrevista(
    payload: EntrevistaPayload, db: Session = Depends(server.get_db)
):
    formulario = {
        "dni": payload.dni,
        "pse": payload.respuestas.pse,
        "ic": payload.respuestas.ic,
        "pep": payload.respuestas.pep,
        "cl": payload.respuestas.cl,
        "cv": payload.respuestas.cv,
        "loc": payload.respuestas.loc,
        "ra": payload.respuestas.ra,
        "score": 0,
    }
    EntrevistaController.post_entrevista(db, SimpleNamespace(**formulario))

    return


@router.get("/get_puntaje/{dni}", status_code=200)
async def get_puntaje(dni: str, db: Session = Depends(server.get_db)):

    try:
        return EntrevistaController.get_puntaje(db, dni)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/update_puntaje/{dni}/{pre}", status_code=200)
async def set_pre(dni: str, pre: float, db: Session = Depends(server.get_db)):
    try:
        EntrevistaController.set_pre(db, dni, pre)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
