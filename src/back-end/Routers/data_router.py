import server

from Controllers import DataController
from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/data")


@router.post("/Uploadalumnos", status_code=201)
async def upload_alumnos(
    file: UploadFile = File(...), db: Session = Depends(server.get_db)
):
    """
    Recibe un archivo CSV de alumnos cargado desde el front y lo procesa
    directamente en memoria sin guardarlo en disco.
    """
    try:
        DataController.Handle_alumnos(file.file, db)
        return {
            "status": "success",
            "message": f"Archivo '{file.filename}' cargado correctamente",
            "filename": file.filename,
        }
    except Exception as e:
        return {"status": "error", "message": f"Error al cargar el archivo: {str(e)}"}


@router.post("/Uploadnotas", status_code=201)
async def upload_notas(
    file: UploadFile = File(...), db: Session = Depends(server.get_db)
):
    """
    Recibe un archivo CSV de notas cargado desde el front y lo procesa
    directamente en memoria sin guardarlo en disco.
    """
    try:
        DataController.Handle_notas(file.file, db)
        return {
            "status": "success",
            "message": f"Archivo '{file.filename}' cargado correctamente",
            "filename": file.filename,
        }
    except Exception as e:
        return {"status": "error", "message": f"Error al cargar el archivo: {str(e)}"}


@router.post("/UploadEncuestas", status_code=201)
async def upload_encuestas(
    file: UploadFile = File(...), db: Session = Depends(server.get_db)
):
    """
    Recibe un archivo CSV de encuestas cuatrimestrales cargado desde el front
    y lo procesa directamente en memoria sin guardarlo en disco.
    """
    try:
        DataController.Handle_encuesta_cuatrimestral(file.file, db)
        return {
            "status": "success",
            "message": f"Archivo '{file.filename}' cargado correctamente",
            "filename": file.filename,
        }
    except Exception as e:
        return {"status": "error", "message": f"Error al cargar el archivo: {str(e)}"}


@router.post("/UploadEncuestaInicial", status_code=201)
async def upload_encuesta_inicial(
    file: UploadFile = File(...), db: Session = Depends(server.get_db)
):
    """
    Recibe un archivo CSV de encuesta inicial cargado desde el front
    y lo procesa directamente en memoria sin guardarlo en disco.
    """
    try:
        DataController.Handle_encuesta_inicial(file.file, db)
        return {
            "status": "success",
            "message": f"Archivo '{file.filename}' cargado correctamente",
            "filename": file.filename,
        }
    except Exception as e:
        return {"status": "error", "message": f"Error al cargar el archivo: {str(e)}"}


@router.post("/upload/{type}", status_code=201)
async def upload_generic(
    type: str,
    file: UploadFile = File(...),
    db: Session = Depends(server.get_db),
):
    """
    Endpoint genérico que recibe un tipo de archivo y lo distribuye
    al controlador correspondiente. Procesa todo en memoria.
    """
    try:
        match type:
            case "notas":
                DataController.Handle_notas(file.file, db)
            case "alumnos":
                DataController.Handle_alumnos(file.file, db)
            case "encuestaCuatrimestral":
                DataController.Handle_encuesta_cuatrimestral(file.file, db)
            case "encuestaInicial":
                DataController.Handle_encuesta_inicial(file.file, db)
            case _:
                return {"status": "error", "message": "Tipo de archivo no reconocido"}

        return {
            "status": "success",
            "message": f"Archivo '{file.filename}' de tipo '{type}' cargado correctamente",
            "filename": file.filename,
        }
    except Exception as e:
        return {"status": "error", "message": f"Error al cargar el archivo: {str(e)}"}
