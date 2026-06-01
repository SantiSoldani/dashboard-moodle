import os
import shutil

import server
from Controllers import DataController
from fastapi import APIRouter, Depends, File, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Directorios relativos al archivo actual para portabilidad
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "raw_data")

router = APIRouter(prefix="/data")

# Este router lo que va a recibir es una de 3 archivos
# resultados encuestas
# alumnos
# notas
# vamos a crear un endpoint para cada uno de estos archivos


'''
@router.post("/Uploadalumnos", status_code=201)
async def upload_alumnos(
    file: UploadFile = File(...), db: Session = Depends(server.get_db)
):
    """
    Recibe un archivo CSV de alumnos cargado desde el front, lo guarda en una carpeta de datos sin procesar en la seccion de raw_data
    ,donde sera procesado por el servicio de limpieza de datos
    """
    try:
        upload_dir = UPLOAD_DIR
        os.makedirs(upload_dir, exist_ok=True)

        if file.filename:
            file_path = os.path.join(upload_dir, file.filename)
        else:
            file_path = os.path.join(upload_dir, "alumnos.csv")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Aca es donde le paso la ruta donde guarde el arcivo a la seccion de tratamiento de datos
        DataController.Handle_alumnos(file_path, db)
        return {
            "status": "success",
            "message": f"Archivo '{file.filename}' cargado correctamente",
            "filename": file.filename,
            "file_path": file_path,
        }
    except Exception as e:
        return {"status": "error", "message": f"Error al cargar el archivo: {str(e)}"}


@router.post("/Uploadnotas", status_code=201)
async def upload_notas(
    file: UploadFile = File(...), db: Session = Depends(server.get_db)
):
    """
    Recibe un archivo CSV de notas cargado desde el front, lo guarda en una carpeta de datos sin procesar en la seccion de raw_data
    una, donde sera procesado por el servicio de limpieza de datos
    """
    try:
        upload_dir = UPLOAD_DIR
        os.makedirs(upload_dir, exist_ok=True)

        if file.filename:
            file_path = os.path.join(upload_dir, "notas.csv")
        else:
            file_path = os.path.join(upload_dir, "upload.csv")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Aca es donde le paso la ruta donde guarde el arcivo a la seccion de tratamiento de datos
        status = DataController.Handle_notas(file_path, db)
        return {
            "status": "success",
            "message": f"Archivo '{file.filename}' cargado correctamente",
            "filename": file.filename,
            "file_path": file_path,
        }
    except Exception as e:
        return {"status": "error", "message": f"Error al cargar el archivo: {str(e)}"}


@router.post("/UploadEncuestas", status_code=201)
async def upload_encuestas(
    file: UploadFile = File(...), db: Session = Depends(server.get_db)
):
    try:
        upload_dir = UPLOAD_DIR
            os.makedirs(upload_dir, exist_ok=True)

        if file.filename:
            file_path = os.path.join(upload_dir, "encuestas.csv")
        else:
            file_path = os.path.join(upload_dir, "upload.csv")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        # Aca es donde le paso la ruta donde guarde el arcivo a la seccion de tratamiento de datos
        DataController.Handle_encuesta_cuatrimestral(file_path, db)
        return {
            "status": "success",
            "message": f"Archivo '{file.filename}' cargado correctamente",
            "filename": file.filename,
            "file_path": file_path,
        }
'''

#ESTA NUEVA RUTA RECIBE COMO PARAMETRO {TYPE} Y DE AHI DISTRIBUYE AL CONTROLADOR ??
@router.post("/upload/{type}", status_code=201)
async def Upload(type:str, file: UploadFile = File(...), session: Session = Depends(server.get_db)):
    try:
        print(type)
        match type:
            case "notas":
                print("ESTAS PASANDO POR NOTAS")
                #return upload_notas(file, session)
                pass
            case "alumnos":
                print("ESTAS PASANDO POR ALUMNOS")
                #return upload_alumnos(file, session)
                pass
            case "encuestaInicial":
                print("ESTAS PASANDO POR ENCUESTA INICIAL")
                #return upload_encuestas(file, session)
                pass
            case "encuestaPeriodica":
                print("ESTAS PASANDO POR ENCUESTA PERIODICA")
                #return upload_encuestas(file, session)
                pass
            case "entrevista":
                print("ESTAS PASANDO POR ENTREVISTA")
                #return upload_entrevistas(file, session)
                pass
            case _:
                return {"status": "error", "message": "Tipo de archivo no reconocido"}


    except Exception as e:
        return {"status": "error", "message": f"Error al cargar el archivo: {str(e)}"}
