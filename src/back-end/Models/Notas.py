from pydantic import BaseModel
from typing import Optional

class Nota(BaseModel):
    materia_id: int
    alumno_id: int
    calificacion: float
    comentarios: Optional[str] = None
