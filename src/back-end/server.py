from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus
from dotenv import load_dotenv
import os

load_dotenv() #carga variables de entorno

# Construimos la URL de conexión de forma segura
SQLALCHEMY_DATABASE_URL = f"{os.getenv("DATABASE_URL")}" #mantiene la url en variable de entorno. Los .env no se suben a github

# Creamos el motor de base de datos
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Creamos una clase para las sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Dependencia para obtener la sesión de la base de datos (útil para inyectar en FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Bloque de prueba de conexión
if __name__ == "__main__":
    try:
        # Intentamos conectarnos a la base de datos y hacer un query básico
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()
            print("¡Conexión exitosa a la base de datos!")
            print("Versión de PostgreSQL:", version[0])
    except Exception as e:
        print("Error al conectar a la base de datos:", e)
