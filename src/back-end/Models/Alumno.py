from this import d
from pydantic import BaseModel
from typing import List, Optional

from pydantic.networks import EmailStr

class Alumno(BaseModel):

    id: int
    dni: str
    nombre: str
    apellido: str
    email: EmailStr
    estado: str
    anio: int
    carrera: str


  #definicion de los metodos propios de los alumnos

  def alumno_by_dni(dni: str) -> Alumno:

    #seccion de sql query a la base de datos donde se busca el alumno por dni



    return alumno;
