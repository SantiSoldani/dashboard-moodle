from pydantic import BaseModel
from typing import Optional

class Materia(BaseModel):
    id: int
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
