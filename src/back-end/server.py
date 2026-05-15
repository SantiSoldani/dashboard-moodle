from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus

# Credenciales de la base de datos Supabase
# Se recomienda usar urllib.parse.quote_plus para la contraseña ya que contiene un caracter especial '?'
#USER = "postgres"
#PASSWORD = quote_plus("Altiora2026?")
#HOST = "db.bqbqlebnoxlqxwdovwhq.supabase.co"
#PORT = "5432"
#DBNAME = "postgres"

# Construimos la URL de conexión de forma segura
SQLALCHEMY_DATABASE_URL = f"postgresql://postgres.bqbqlebnoxlqxwdovwhq:Altiora2026?@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"

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
