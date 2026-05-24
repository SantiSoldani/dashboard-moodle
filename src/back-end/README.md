# Backend — Arquitectura por capas

## Estructura de carpetas

```
backend/
├── main.py                  # Punto de entrada, registra routers
├── server.py               # Configuración de BD (SessionLocal, engine)
├── Routers/                # Rutas HTTP
├── Controllers/            # Coordinadores de flujo
├── Models/                 # DTOs y queries SQL
└── Services/               # Lógica de negocio
```

---

## Responsabilidad de cada capa

| Capa | Carpeta | Qué hace | Qué NO hace |
|---|---|---|---|
| **Router** | `Routers/` | Define las rutas HTTP (`GET`, `POST`, etc.) y recibe requests. Llama al controller y retorna la respuesta JSON. | Lógica de negocio. Si hay un `if` o `for`, pertenece al controller. |
| **Controller** | `Controllers/` | Coordina el flujo: valida datos, llama a Models y Services, arma la respuesta. Convierte SimpleNamespace en DTOs. Conoce HTTP. | Queries SQL directas. Lógica de negocio compleja. |
| **Service** | `Services/` | Toda la inteligencia y cálculos complejos: transformaciones de datos, orquestación. Calcula scores, scores de riesgo, etc. | Importar FastAPI. Acceder a BD. Sabe que existe HTTP. |
| **Model** | `Models/` | Estructura de datos (DTOs con `@dataclass`) y queries SQL. Es la única capa que habla con la base de datos. | Lógica de negocio. Cálculos complejos. Solo persiste y recupera datos. |

---

## Flujo de un request

```
GET /alumnos/all
    │
    ▼
Routers/students_router.py    → recibe la ruta, valida Depends(get_db)
    │ Llama a: AlumnoController.Get_alumnos(db)
    ▼
Controllers/AlumnoController.py → coordina, llama a Models
    │ Llama a: Alumno.Get_alumnos(db)
    ▼
Models/Alumno.py              → ejecuta query SQL
    │ Query: SELECT * FROM "Alumnos" ORDER BY nombre
    ▼
server.py (SessionLocal)       → conexión a BD
    │
    ▼
Response JSON
```

---

## Ejemplo real: `GET /alumnos/Bydni/{student_dni}`

### `Routers/students_router.py`
```python
@router.get("/Bydni/{student_dni}")
async def get_student(student_dni: str, db: Session = Depends(server.get_db)):
    alumno = AlumnoController.Get_alumno_Bydni(student_dni, db)
    json_alumno = json.dumps(alumno.__dict__)
    return json_alumno
```
✅ Solo define la ruta y delega. Sin lógica.

---

### `Controllers/AlumnoController.py`
```python
def Get_alumno_Bydni(dni: str, db) -> SimpleNamespace:
    # Llama al Model para obtener los datos
    alumno = Alumno.Get_alumno(dni, db)
    # Convierte DTO a SimpleNamespace para el frontend
    return SimpleNamespace(**alumno.__dict__)
```
✅ Coordina: obtiene del Model y transforma para responder.

---

### `Models/Alumno.py`
```python
@dataclass
class AlumnoDto:
    nombre: str
    apellido: str
    email: EmailStr
    carrera: str
    dni: str
    fecha_inicio: str
    estado: str
    score: float

def Get_alumno(dni: str, db) -> AlumnoDto:
    query = text("""SELECT * FROM "Alumnos" WHERE dni = :dni""")
    return AlumnoDto(**(db.execute(query, {"dni": dni}).mappings().fetchone()))
```
✅ Define estructura (DTO) y query SQL. Nada más.

---

## Ejemplo completo: `POST /alumnos` (crear varios)

### `Routers/data_router.py`
```python
@router.post("/UploadData")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(server.get_db)):
    # Lee el CSV
    contents = await file.read()
    # Llama al controller
    return DataController.upload_data(contents, db)
```

### `Controllers/DataController.py`
```python
def upload_data(contents: bytes, db):
    # Transforma CSV a lista de SimpleNamespace
    alumnos = Data_transformer.To_object_list(contents)
    # Llama al controller específico
    AlumnoController.Post_alumnos(alumnos, db)
    return {"status": "success"}
```

### `Services/Data_transformer.py`
```python
def To_object_list(csv_path: str) -> list[SimpleNamespace]:
    """Convierte CSV a lista de objetos dinámicos"""
    df = pd.read_csv(csv_path)
    records = df.to_dict(orient='records')
    return [SimpleNamespace(**record) for record in records]
```
✅ Lógica de transformación centralizada. No importa FastAPI.

### `Controllers/AlumnoController.py`
```python
def Post_alumnos(Alumnos: list[SimpleNamespace], db):
    for alumno in Alumnos:
        Alumno.Post_Alumno(
            Alumno.AlumnoDto(
                nombre=str(alumno.nombre),
                apellido=str(alumno.apellido),
                email=str(alumno.email),
                dni=str(alumno.dni),
                fecha_inicio=alumno.fecha_inicio,
                carrera=alumno.carrera,
                estado="",
            ),
            db,
        )
    return db.commit()
```
✅ Convierte SimpleNamespace a DTO y coordina inserciones.

### `Models/Alumno.py`
```python
def Post_Alumno(alumno: AlumnoDto, db):
    query = text(
        """INSERT INTO "Alumnos" (dni, nombre, apellido, email, fecha_inicio) 
           VALUES (:dni, :nombre, :apellido, :email, :fecha_inicio) 
           ON CONFLICT (dni) DO NOTHING"""
    )
    db.execute(query, {
        "nombre": alumno.nombre,
        "apellido": alumno.apellido,
        "email": alumno.email,
        "dni": alumno.dni,
        "fecha_inicio": alumno.fecha_inicio,    
    })
```
✅ Ejecuta SQL. Nada más.

---

## Flujo visual: POST alumnos

```
CSV file (50 alumnos)
    │
    ▼
Data_transformer.To_object_list()     → 50 SimpleNamespace
    │
    ▼
AlumnoController.Post_alumnos()       → iteramos cada uno
    │ Para cada SimpleNamespace:
    ▼
    AlumnoController convierte → AlumnoDto
        │
        ▼
    Alumno.Post_Alumno(dto, db)       → INSERT query
        │
        ▼
db.commit()                           → todas al BD juntas
    │
    ▼
Response: {"status": "success"}
```

---

## Reglas del equipo

- ✅ **Nunca saltear capas**: Router → Controller → Model (o Service)
- ✅ **Un archivo por entidad**: `Routers/students_router.py`, `Controllers/AlumnoController.py`, etc.
- ✅ **Los Services no importan FastAPI**: si ves `from fastapi import ...`, está mal.
- ✅ **Los Models solo tienen DTOs y queries**: si ves lógica de negocio, está mal.
- ✅ **Commit al final del flujo**: no hagas commit en cada iteración.
- ✅ **DTOs para estructurar datos**: usar `@dataclass` con tipos definidos.
- ✅ **SimpleNamespace para datos dinámicos**: cuando el schema viene de un CSV.

---

## Startup

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar con reload (desarrollo)
uvicorn main:app --reload --port 8001

# O desde main.py
python main.py
```

Está configurado en `main.py` línea 36:
```python
if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, port=8001)
```
