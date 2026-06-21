from Models import Tutor_Alumno

def get_alumnos_by_tutor_dni(dni, db):
    return Tutor_Alumno.get_alumnos_by_tutor_dni(dni,db)

def get_tutor_by_alumno_dni(dni, db):
    return Tutor_Alumno.get_tutor_by_alumno_dni(dni,db)

def post_tutor_alumno(tutor_dni, alumno_dni, db):
    return Tutor_Alumno.post_tutor_alumno(tutor_dni,alumno_dni,db)

def delete_tutor_alumno(tutor_dni, alumno_dni, db):
    return Tutor_Alumno.delete_tutor_alumno(tutor_dni,alumno_dni,db)