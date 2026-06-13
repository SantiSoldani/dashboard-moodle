from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from datetime import datetime

import server
from Models import Usuario, Alumno, Semaforo

router = APIRouter(tags=["moodle"])

def capitalize_names(name:str):
    parts = name.split()
    for i in range(len(parts)):
        if i == 0:
            parts[i] = parts[i].lower().capitalize()
        else:
            parts[i] = parts[i].lower().capitalize()
    return " ".join(parts)

def conversionRoles(rol:str):
    if rol == "Learner":
        return "Estudiante"
    elif rol == "Instructor":
        return "Docente"
    

@router.post("/moodle/lti/launch")
async def lti_launch(request: Request, db: Session = Depends(server.get_db)):
    form_data = await request.form()

    # Moodle LTI 1.1 suele mandar estos campos estándar
    dni_alumno = form_data.get("ext_user_username") 
    email_alumno = form_data.get("lis_person_contact_email_primary")
    nombre = capitalize_names(form_data.get("lis_person_name_given"))
    apellido = capitalize_names(form_data.get("lis_person_name_family"))
    rol = form_data.get("roles") # Return Instructor | Learner  
    rol = conversionRoles(rol) # Convertir el rol a español

    print(nombre)
    print(rol)
    
    with (open("./log.txt", "a")) as archivo:
        archivo.write(dni_alumno + "\n")
        archivo.write(email_alumno + "\n")
        archivo.write(nombre + " " + apellido + "\n")
        archivo.write("rol: " + rol + "\n")
        archivo.write("\n")
    
    # Intentamos buscar al alumno. Usamos un try/except porque el Get_alumno
    # actual lanza TypeError si el fetchone() retorna None.
    try:
        alumno_db = Usuario.get_usuario_by_dni(dni_alumno, db)
    except Exception:
        alumno_db = None

    
    
    if not alumno_db and rol == "Estudiante":
        # ¡Es la primera vez que entra! Lo damos de alta en el momento
        # Instanciamos el DTO del alumno 
        nuevo_alumno = Alumno.AlumnoDto(
            nombre=nombre,
            apellido=apellido,
            email=email_alumno or "",
            dni=dni_alumno,
            fecha_inicio=str(datetime.now().year),
            carrera="Pendiente",
            color="gris",
            score=0,
            legajo=None
        )

        semaforo_nuevo = Semaforo.semaforoDTO(
            dni_alumno= dni_alumno,
            color="gris",
            score=0,
            created_at= None
        )

        nuevo_usuario = Usuario.Usuario(
            dni = dni_alumno,
            rol = rol,
            ult_coneccion = str(datetime.now()),
            created_at = str(datetime.now()),
        )
        
        # Lo guardamos en la base de datos
        Usuario.post_Usuario(nuevo_usuario, db)
        Alumno.Post_Alumno(nuevo_alumno, db)
        semaforoDTO.Post_Semaforo(semaforo_nuevo, db)
        db.commit()

    # --------------------------------------------
    #Se inyecta el index.html, pero además pasamos por localStorage los datos que nos envía moodle para saber que pestaña renderizar
    #Esta ultima eleccion lo hace el frontend.


    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ margin: 0; padding: 0; }}
        </style>
    </head>
    <body>
        <script>
        localStorage.setItem('nombreUsuario', '{nombre}');
        localStorage.setItem('apellidoUsuario', '{apellido}');
        localStorage.setItem('rol', '{rol}');
        localStorage.setItem('dniUsuario', '{dni_alumno}');
        </script>
        <iframe src="/" style="width: 100%; height: 90vh; border: none;" allow="fullscreen"></iframe>
    </body>
    </html>
        """
    return HTMLResponse(content=html)
    

    
    