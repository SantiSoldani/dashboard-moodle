# SE INICIA EL SERVIDOR CON EL COMANDO:
# uvicorn main:app --reload
import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from Routers import data_router, moodle_router, notasRouter, students_router
import os

app = FastAPI(title="API Proyecto Travesía")

# Construimos la ruta absoluta hacia la carpeta front-end
frontend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "front-end")

# Montamos la carpeta front-end en la ruta /app del servidor
app.mount("/app", StaticFiles(directory=frontend_path), name="front-end")

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


load_dotenv()

TOKEN = os.getenv("MOODLE_TOKEN")
BASE_URL = os.getenv("MOODLE_BASE_URL")


@app.get("/")
def root():
    return {"mensaje": "Conectado"}


    


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, port=8001)
