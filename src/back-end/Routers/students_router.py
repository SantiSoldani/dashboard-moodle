import json

import server
from Controllers import AlumnoController
from fastapi import APIRouter, Depends, HTTPException
from pandas._libs.tslibs import timestamps
from sqlalchemy.orm import Session
from starlette.types import HTTPExceptionHandler

router = APIRouter(
    prefix="/alumnos",
    tags=["alumnos"],
)


@router.get("/get/stats", status_code=200)
async def get_students_with_stats(db: Session = Depends(server.get_db)):
    try:
        alumnos = AlumnoController.Get_alumnos_with_stats(db)
        return [a.__dict__ for a in alumnos]
    except Exception as e:
        print(f"Error en get_students_with_stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get/byDNI/{student_dni}")
async def get_student(student_dni: str, db: Session = Depends(server.get_db)):
    alumno = AlumnoController.Get_alumno_Bydni(student_dni, db)
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    return alumno.__dict__


@router.get("/get", status_code=200)
async def get_students(db: Session = Depends(server.get_db)):
    try:
        alumnos = AlumnoController.Get_alumnos(db)
        return [a.__dict__ for a in alumnos]
    except Exception as e:
        print(f"Error en get_students: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get/evolucion_semaforos/{dni}", status_code=200)
async def get_evolucion_semaforo(dni: str, db: Session = Depends(server.get_db)):

    try:
        return AlumnoController.fetch_semaforos(db, dni)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get/indicadores/{cohorte}", status_code=200)
async def get_indicadores(cohorte: int, db: Session = Depends(server.get_db)):

    try:
        indicadores = AlumnoController.indicadoresXcohorte(db, cohorte)
        return indicadores
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# endpoint para traer los indicadores cuatrimestrales de los alumnos filtrados por algun campo = valor


@router.get("/get/indicadores/{tipo}/{filtro}/{valor}", status_code=200)
async def get_indicadores_filtrados(
    filtro: str, tipo: str, valor: int, db: Session = Depends(server.get_db)
):

    try:
        if tipo == "cuatrimestrales":
            indicadores = AlumnoController.cuatrimestrales_filtrados(db, filtro, valor)
        else:
            indicadores = AlumnoController.iniciales_filtrados(db, filtro, valor)
        return indicadores

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# endpoint para ver la evolucion de los semaforos a lo largo de las encuestas se puede filtrar por campos y si en el filtro se pone none entonces no filtra
# si en el valor se pone -1 entonces agrupa y ordena por el campo a filtrar pero no filtra realmente
# luego en la parte de piso se pone la fecha piso de las encuestas y en techo la fecha techo
# de la misma manera cualquiera de los campos enviados de ser parseados a -1 seran ignorados, si paso todo -1 entonces simplemente traera todos los semaforos
# ejemplo --> get/semaforos/fecha_inicio/-1/20-03-2020/17-07-2027 --> traeria todos los promedios de semaforo ordenados por fecha de inicio, registrados desde el 20 de febrero de 2020 hasta el 17 de julio de 2027
@router.get("/get/semaforos/{filtro}/{valor}/{piso}/{techo}", status_code=200)
async def get_evolucion_semaforos(
    filtro: str, valor: int, piso, techo, db: Session = Depends(server.get_db)
):

    try:
        semaforos = AlumnoController.get_evolucion_semaforos(
            db, filtro, valor, piso, techo
        )
        return semaforos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get/criticos", status_code=200)
async def get_criticos(db: Session = Depends(server.get_db)):
    try:
        criticos = AlumnoController.get_criticos(db)
        return [c.__dict__ for c in criticos]
    except Exception as e:
        print(f"Error en get_criticos: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get/color/{dni}", status_code=200)
async def get_color(dni: str, db: Session = Depends(server.get_db)):
    try:
        color = AlumnoController.get_color(dni, db)
        return color
    except Exception as e:
        print(f"Error en get_color: {e}")
        raise HTTPException(status_code=500, detail=str(e))