import server
from Controllers import EncuestaController
from fastapi import APIRouter, Depends, File, status
from sqlalchemy.orm import Session
from starlette.exceptions import HTTPException

router = APIRouter(prefix="/encuesta")


@router.get("/ByDni/{dni}", status_code=200)
async def get_ultima_encuesta(dni: str, db: Session = Depends(server.get_db)):

    try:
        Encuesta = EncuestaController.get_encuesta(db, dni)
        return Encuesta
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500)
