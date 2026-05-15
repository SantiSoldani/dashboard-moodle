from pydantic import BaseModel
from typing import List, Optional

class Alumno(BaseModel):
    id: int
    nombre: Optional[str] = None
    email: Optional[str] = None
    grupos: List[int] = []
