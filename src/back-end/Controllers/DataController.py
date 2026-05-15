from Routers.moodleRequest import moodle_request

class DataController:
    
    @staticmethod
    def obtener_promedios_primer_anio():
        """
        Contiene toda la lógica de negocio para obtener los promedios
        de los alumnos de primer año.
        """
        # 1. Traemos la información del curso
        data = moodle_request('core_enrol_get_enrolled_users', {'courseid': 2})
        grupos = moodle_request('core_group_get_course_groups', {'courseid': 2})
        
        id_grupo_primero = next((g["id"] for g in grupos if g['name'] == 'Primer Año'), None)
        
        # 2. Filtramos alumnos del grupo de Primer Año
        id_alumnos_primero = []
        if id_grupo_primero:
            id_alumnos_primero = [
                user["id"] 
                for user in data 
                if any(group["id"] == id_grupo_primero for group in user["groups"])
            ]
        
        # 3. Buscamos las materias de esos alumnos
        materias = []
        for id_alumno in id_alumnos_primero:
            materias_x_alumno = moodle_request('core_enrol_get_users_courses', {'userid': id_alumno})
            materias.extend(materias_x_alumno)
            
        materias_unicas = list({m["id"]: m for m in materias if m["id"] != 2}.values())

        # 4. Buscamos las notas de cada alumno en esas materias
        notas = []
        for id_alumno in id_alumnos_primero:
            for materia in materias_unicas:
                alumno_notas = moodle_request('gradereport_user_get_grade_items', {
                    'courseid': materia["id"], 
                    'userid': id_alumno
                })
                
                # Accedemos de forma segura usando .get() por si la respuesta no tiene el formato esperado
                for alumno in alumno_notas.get("usergrades", []):
                    for grade in alumno.get("gradeitems", []):
                        if grade.get("graderaw") is not None:
                            notas.append(grade["graderaw"])
                            
        return {
            "grupos": grupos, 
            "IDS alumnos de Primero": id_alumnos_primero, 
            "Notas": notas
        }
