from Models.Log import Log

def add_log(log_data: dict, db):
    """
    Agrega un nuevo log.
    """
    nuevo_log = Log(
        dni_usuario=log_data.get("dni_usuario"),
        tipo_accion=log_data.get("tipo_accion"),
        descripcion=log_data.get("descripcion"),
        fecha=log_data.get("fecha")
    )
    Log.post_Log(nuevo_log, db)
    return nuevo_log

def get_logs(db):
    """
    Obtiene todos los logs.
    """
    return Log.get_logs(db)
