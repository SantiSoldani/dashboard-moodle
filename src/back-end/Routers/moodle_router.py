from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from datetime import datetime

import server
from Models import Alumno

router = APIRouter(tags=["moodle"])

@router.post("/moodle/lti/launch")
async def lti_launch(request: Request, db: Session = Depends(server.get_db)):
    form_data = await request.form()
    
    # Moodle LTI 1.1 suele mandar estos campos estándar
    dni_alumno = form_data.get("ext_user_username") 
    email_alumno = form_data.get("lis_person_contact_email_primary")
    nombre_completo = form_data.get("lis_person_name_full")

    # --- LÓGICA DE JIT PROVISIONING (UPSERT) ---
    
    # Intentamos buscar al alumno. Usamos un try/except porque el Get_alumno
    # actual lanza TypeError si el fetchone() retorna None.
    try:
        alumno_db = Alumno.Get_alumno(dni_alumno, db)
    except Exception:
        alumno_db = None
    
    if not alumno_db:
        # ¡Es la primera vez que entra! Lo damos de alta en el momento
        nombre = ""
        apellido = ""
        if nombre_completo:
            if "," in nombre_completo:
                parts = [p.strip() for p in nombre_completo.split(",", 1)]
                apellido = parts[0]
                nombre = parts[1]
            else:
                parts = nombre_completo.split()
                if len(parts) >= 2:
                    nombre = parts[0]
                    apellido = " ".join(parts[1:])
                elif len(parts) == 1:
                    nombre = parts[0]

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
            legajo=dni_alumno
        )
        
        # Lo guardamos en la base de datos
        Alumno.Post_Alumno(nuevo_alumno, db)
        db.commit()
        print(f"Alumno {dni_alumno} dado de alta automáticamente.")
    else:
        print(f"El alumno {dni_alumno} ya existía en nuestra DB.")

    # --------------------------------------------
    
    # Finalmente devolvemos el HTML inyectándole el DNI
    # El front-end detectará el DNI desde el localStorage
    # Finalmente devolvemos el HTML con un iframe en lugar de redireccionar
    # para controlar mejor las dimensiones dentro de Moodle.
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
            localStorage.setItem('estudianteDNI', '{dni_alumno}');
        </script>
        <iframe src="/app/iframes/Alumnos_stats.html" style="width: 100%; height: 900px; border: none;"></iframe>
    </body>
    </html>
    """
    return HTMLResponse(content=html)