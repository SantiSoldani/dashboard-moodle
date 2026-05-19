import os

from Controllers.DataController import DataController
from dotenv import load_dotenv
from fastapi import APIRouter

load_dotenv()

TOKEN = os.getenv("MOODLE_TOKEN")
BASE_URL = os.getenv("MOODLE_BASE_URL")  # http://localhost
COURSE_ID = os.getenv("MOODLE_COURSE_ID")

router = APIRouter(prefix="/notas", tags=["notas"])


@router.get("/promedio")
def getPromedio():
    # El Router ahora está "limpio". Solo se encarga de definir la ruta
    # y llamar al Controlador que contiene la lógica de negocio.
    return DataController.obtener_promedios_primer_anio()
