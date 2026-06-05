# SE INICIA EL SERVIDOR CON EL COMANDO:
# uvicorn main:app --reload
import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from Routers import data_router, moodle_router, notasRouter, students_router,tutores_router
import os

app = FastAPI()

from fastapi.responses import FileResponse

# Construimos las rutas
src_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
project_root = os.path.dirname(src_path)
frontend_path = os.path.join(src_path, "front-end")

# Montamos solo la carpeta front-end en su ruta correspondiente para que index.html encuentre los assets
app.mount("/src/front-end", StaticFiles(directory=frontend_path), name="front-end")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notasRouter.router)
app.include_router(data_router.router)
app.include_router(students_router.router)
app.include_router(moodle_router.router)
app.include_router(tutores_router.router)

load_dotenv()

TOKEN = os.getenv("MOODLE_TOKEN")
BASE_URL = os.getenv("MOODLE_BASE_URL")


@app.get("/")
def root():
    return FileResponse(os.path.join(project_root, "index.html"))


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, port=8001)
