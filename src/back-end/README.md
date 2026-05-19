# Backend — Arquitectura por capas

## Estructura de carpetas

```
backend/
├── main.py
├── router/
├── controller/
├── models/
└── services/
```

---

## Responsabilidad de cada capa

| Capa | Carpeta | Qué hace | Qué NO hace |
|---|---|---|---|
| **Router** | `router/` | Define las rutas HTTP (`GET`, `POST`, etc.) y los parámetros que recibe cada endpoint. Recibe el request y lo delega al controller. | Lógica de ningún tipo. Si hay un `if`, algo está mal. |
| **Controller** | `controller/` | Coordina el flujo: valida que los datos estén bien formados, llama a los servicios necesarios y arma la respuesta HTTP. Conoce HTTP. | Queries a la DB ni reglas de negocio complejas. |
| **Service** | `services/` | Toda la inteligencia del sistema vive acá. Calcula promedios, scores de riesgo, decide qué materias incluir en cada cálculo, llama a la API de Moodle, orquesta operaciones. | Importar nada de FastAPI (`Request`, `Response`, etc.). No sabe que existe HTTP. |
| **Model** | `models/` | Define las tablas (SQLAlchemy ORM) y los schemas de validación (Pydantic). Es la única capa que habla con la base de datos. | Lógica de negocio. Solo persiste y recupera datos. |

---

## Flujo de un request

```
Request HTTP
    │
    ▼
router/          → recibe la ruta y llama al controller
    │
    ▼
controller/      → valida, coordina y arma la respuesta
    │
    ▼
services/        → ejecuta la lógica de negocio
    │
    ▼
models/          → accede a la base de datos
    │
    ▼
Response HTTP
```

---

## Ejemplo concreto: `GET /dashboard/{alumno_id}`

### `router/dashboard.py`
```python
@router.get("/dashboard/{alumno_id}")
async def get_dashboard(alumno_id: int, token: str):
    return await dashboard_controller.get(alumno_id, token)
```
Solo define la ruta y delega. Sin lógica.

---

### `controller/dashboard.py`
```python
async def get(alumno_id: int, token: str):
    user = verify_token(token)          # valida identidad
    if user.id != alumno_id:
        raise HTTPException(403)        # controla acceso

    data = await dashboard_service.calcular(alumno_id)
    return JSONResponse(data)           # arma respuesta HTTP
```
Conoce HTTP, pero no sabe cómo se calcula un promedio.

---

### `services/dashboard.py`
```python
async def calcular(alumno_id: int) -> dict:
    materias = alumno_model.get_materias(alumno_id)

    # Solo incluye materias con nota final aprobada
    aprobadas = [m for m in materias if m.nota_final is not None]

    promedio = (
        sum(m.nota_final for m in aprobadas) / len(aprobadas)
        if aprobadas else None
    )

    return {
        "promedio_finales": round(promedio, 2) if promedio else None,
        "materias_aprobadas": len(aprobadas),
        "finales_pendientes": len([m for m in materias if m.estado == "final_pendiente"]),
    }
```
Toda la inteligencia está acá. No importa nada de FastAPI.

---

### `models/alumno.py`
```python
# Tabla (SQLAlchemy)
class Inscripcion(Base):
    __tablename__ = "inscripciones"
    id         = Column(Integer, primary_key=True)
    alumno_id  = Column(Integer, nullable=False)
    materia    = Column(String, nullable=False)
    estado     = Column(String, nullable=False)   # en_curso | final_pendiente | aprobada | no_cursada
    nota_final = Column(Float, nullable=True)

# Query
def get_materias(alumno_id: int) -> list[Inscripcion]:
    return db.query(Inscripcion).filter(Inscripcion.alumno_id == alumno_id).all()
```
Solo define estructura y recupera datos. No decide nada.

---

## Reglas del equipo

- **Nunca saltear capas**: el router no llama directamente al model.
- **Un archivo por entidad**: `router/dashboard.py`, `services/dashboard.py`, etc.
- **Los services no importan FastAPI**: si ves `from fastapi import ...` en `services/`, está mal.
- **Los models no tienen lógica de negocio**: si ves un cálculo en `models/`, está mal.
