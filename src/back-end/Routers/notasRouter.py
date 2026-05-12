from fastapi import FastAPI, APIRouter
import os
import json

from dotenv import load_dotenv
from .moodleRequest import moodle_request
load_dotenv()

#http://localhost/webservice/rest/server.php?wstoken=de92cb293ac5e52b972227c3d11d4a70&moodlewsrestformat=json&wsfunction=core_enrol_get_enrolled_users&courseid=2

TOKEN = os.getenv("MOODLE_TOKEN")
BASE_URL = os.getenv("MOODLE_BASE_URL") # http://localhost
COURSE_ID = os.getenv("MOODLE_COURSE_ID")

router = APIRouter (
    prefix="/notas",
    tags=["notas"]
)

@router.get('/promedio')
def getPromedio():
#TRAERA TODA LA INFORMACION ALMACENADA EN EL CURSO 'RENDIMIENTO'   
        data = moodle_request('core_enrol_get_enrolled_users', {'courseid': 2})
        grupos = moodle_request('core_group_get_course_groups', {'courseid' : 2} )
        
        
        id_grupo_primero = next((g["id"] for g in grupos if g['name'] == 'Primer Año'), None )
        id_alumnos_primero = [
            user["id"] 
            for user in data 
            if any(group["id"] == id_grupo_primero for group in user["groups"])]
        
        # Tenemos el id del grupo de alumnos de primer año. 
        # Con este id podemos buscar sus notas y luego hacer el promedio.
        materias = []
        for id_alumno in id_alumnos_primero:
             
            materias_x_alumno = moodle_request('core_enrol_get_users_courses', {'userid': id_alumno})
            materias.extend(materias_x_alumno)
            
            materias_unicas = list({m["id"]: m for m in materias if m["id"] != 2}.values())

            
        notas = []
        for id_alumno in id_alumnos_primero:
            suma = 0
            cantidad_materias = 0   
            for materia in materias_unicas:
                alumno_notas = moodle_request ('gradereport_user_get_grade_items', {'courseid': materia["id"], 'userid': id_alumno})
                cantidad_materias += 1
                #notas.append(alumno_notas["usergrades"])
                for alumno in alumno_notas["usergrades"]:
                    for grade in alumno["gradeitems"]:
                        if grade["graderaw"] is not None:
                            notas.append(grade["graderaw"])

                
            
            
        return {"grupos": grupos, "IDS alumnos de Primero": id_alumnos_primero, "Notas" : notas}
