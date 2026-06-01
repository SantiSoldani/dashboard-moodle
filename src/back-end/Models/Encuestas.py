from sqlalchemy import text
from dataclasses import dataclass
from datetime import datetime, date


@dataclass
class encuestasDTO:
    dni_alumno: str
    score: int
    peso: int
    created_at: datetime
    observaciones: str