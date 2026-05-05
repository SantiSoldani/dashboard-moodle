#SE INICIA EL SERVIDOR CON EL COMANDO:
# uvicorn main:app --reload

from fastapi import FastAPI

app = FastAPI(title="API Proyecto Travesía")

@app.get("/")
def read_root():
    return {"status": "ok", "mensaje": "¡El backend está vivo!"}