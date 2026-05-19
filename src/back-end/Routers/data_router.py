import os
import shutil

from fastapi import APIRouter, File, UploadFile, status
from pydantic import BaseModel

router = APIRouter(prefix="/data")

# Este router lo que va a recibir es una de 3 archivos
# resultados encuestas
# alumnos
# notas
# vamos a crear un endpoint para cada uno de estos archivos


@router.post("/Uploadalumnos", status_code=201)
async def upload_alumnos(file: UploadFile = File(...)):
    """
    Recibe un archivo CSV de alumnos cargado desde el front, lo guarda en una carpeta de datos sin procesar en la seccion de raw_data
    ,donde sera procesado por el servicio de limpieza de datos
    """
    try:
        upload_dir = "/var/www/html/dashboard-moodle/src/back-end/raw_data"
        os.makedirs(upload_dir, exist_ok=True)

        if file.filename:
            file_path = os.path.join(upload_dir, file.filename)
        else:
            file_path = os.path.join(upload_dir, "upload.csv")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {
            "status": "success",
            "message": f"Archivo '{file.filename}' cargado correctamente",
            "filename": file.filename,
            "file_path": file_path,
        }
    except Exception as e:
        return {"status": "error", "message": f"Error al cargar el archivo: {str(e)}"}


@router.post("/Uploadnotas", status_code=201)
async def upload_notas(file: UploadFile = File(...)):
    """
    Recibe un archivo CSV de notas cargado desde el front, lo guarda en una carpeta de datos sin procesar en la seccion de raw_data
    una, donde sera procesado por el servicio de limpieza de datos
    """
    try:
        upload_dir = "/var/www/html/dashboard-moodle/src/back-end/raw_data"
        os.makedirs(upload_dir, exist_ok=True)

        if file.filename:
            file_path = os.path.join(upload_dir, file.filename)
        else:
            file_path = os.path.join(upload_dir, "upload.csv")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {
            "status": "success",
            "message": f"Archivo '{file.filename}' cargado correctamente",
            "filename": file.filename,
            "file_path": file_path,
        }
    except Exception as e:
        return {"status": "error", "message": f"Error al cargar el archivo: {str(e)}"}
