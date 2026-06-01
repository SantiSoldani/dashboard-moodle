from sqlalchemy import text
from dataclasses import dataclass
from datetime import datetime, date


@dataclass
class examenDTO:
    dni_alumno: str
    id_materia: int
    nota: float
