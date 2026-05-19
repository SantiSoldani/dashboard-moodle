# SE INICIA EL SERVIDOR CON EL COMANDO:
# uvicorn main:app --reload
import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routers import data_router, notasRouter

app = FastAPI(title="API Proyecto Travesía")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notasRouter.router)
app.include_router(data_router.router)

load_dotenv()

TOKEN = os.getenv("MOODLE_TOKEN")
BASE_URL = os.getenv("MOODLE_BASE_URL")


@app.get("/")
def root():
    return {"mensaje": "Conectado"}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, port=8001)
