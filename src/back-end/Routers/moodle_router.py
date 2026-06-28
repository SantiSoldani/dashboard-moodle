from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from datetime import datetime

import server
from Models import Usuario, Alumno, Semaforo

router = APIRouter(tags=["moodle"])

#ROLES: LEARNER - INSTRUCTOR - ADMIN(?) AUN NO CONFIRMADO

def capitalize_names(name:str):
    parts = name.split()
    for i in range(len(parts)):
        if i == 0:
            parts[i] = parts[i].lower().capitalize()
        else:
            parts[i] = parts[i].lower().capitalize()
    return " ".join(parts)
    
@router.post("/moodle/lti/launch")
async def lti_launch(request: Request, db: Session = Depends(server.get_db)):
    form_data = await request.form()

    # Moodle LTI 1.1 suele mandar estos campos estándar
    dni_moodle = form_data.get("ext_user_username") 
    email_moodle = form_data.get("lis_person_contact_email_primary")
    nombre_moodle = capitalize_names(form_data.get("lis_person_name_given"))
    apellido_moodle = capitalize_names(form_data.get("lis_person_name_family"))
    rol_moodle = form_data.get("roles") # Return Instructor | Learner; Usamos el rol que da moodle para ahorrar pasos.
    
    print("DNI: ", dni_moodle, " | Nombre: ", nombre_moodle, " | Apellido: ", apellido_moodle, " | Rol: ", rol_moodle)
    
    # Intentamos buscar al alumno. Usamos un try/except porque el Get_alumno actual lanza TypeError si el fetchone() retorna None.
    try:
        usuario = Usuario.get_usuario_by_dni(dni_moodle, db)
    except Exception:
        usuario = None

    if not usuario:
        # Usuario nuevo
        # Instanciamos el DTO del Usuario y Alumno en caso de serlo 
        nuevo_usuario = Usuario.UsuarioDTO(
            dni = dni_moodle,
            rol = rol_moodle,
            nombre = nombre_moodle,
            apellido = apellido_moodle,
            email = email_moodle,
            ult_coneccion = str(datetime.now()),
            created_at = str(datetime.now()),
        )

        Usuario.post_Usuario(nuevo_usuario, db)

        if rol_moodle == "Learner":
            #Si además, es Estudiante, se le da de alta.
            nuevo_alumno = Alumno.AlumnoDto(
                nombre = nombre_moodle,
                apellido = apellido_moodle,
                email = email_moodle or "",
                dni = dni_moodle,
                fecha_inicio = str(datetime.now().year),
                carrera = "industrial",
                score=0,
            )

            semaforo_nuevo = Semaforo.semaforoDTO(
                dni_alumno = dni_moodle,
                color="gris",
                score=0,
                created_at= None
            )
            
            Alumno.Post_Alumno(nuevo_alumno, db)
            semaforoDTO.Post_Semaforo(semaforo_nuevo, db)
        
        # Lo guardamos en la base de datos
        
        db.commit()
    else:
        #El usuario ya fué encontrado, por lo que el rol lo define la tabla de Usuarios
        rol_moodle = usuario.rol

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
        localStorage.setItem('nombreUsuario', '{nombre_moodle}');
        localStorage.setItem('apellidoUsuario', '{apellido_moodle}');
        localStorage.setItem('rol', '{rol_moodle}');
        localStorage.setItem('dniUsuario', '{dni_moodle}');
        </script>
        <iframe src="/" style="width: 100%; height: 90vh; border: none;" allow="fullscreen"></iframe>
    </body>
    </html>
        """
    return HTMLResponse(content=html)

    
    

    
    