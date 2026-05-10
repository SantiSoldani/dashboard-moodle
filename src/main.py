#SE INICIA EL SERVIDOR CON EL COMANDO:
# uvicorn main:app --reload
import os
import uvicorn

from fastapi import FastAPI
from dotenv import load_dotenv
from Routers import notasRouter

app = FastAPI(title="API Proyecto Travesía")

app.include_router(notasRouter.router)

load_dotenv()

TOKEN = os.getenv("MOODLE_TOKEN")
BASE_URL = os.getenv("MOODLE_BASE_URL")

@app.get("/")
def root():
    return {
        "mensaje": "Conectado",
        "token": TOKEN,
        "base_url": BASE_URL
    }

if __name__ == '__main__':
    uvicorn.run("main:app", reload = True , port= 8001)