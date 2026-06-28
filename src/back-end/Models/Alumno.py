from dataclasses import dataclass
from hashlib import algorithms_available
from math import nan
from pydoc import plain
from types import SimpleNamespace

from pydantic.networks import EmailStr
from sqlalchemy import text
from sqlalchemy.sql.selectable import elem
from sqlalchemy.sql.sqltypes import SmallInteger


@dataclass
class AlumnoDto:
    nombre: str
    apellido: str
    email: EmailStr
    dni: str
    fecha_inicio: int
    materias_aprobadas: int
    pre: float
    plan_de_estudios: int
    carrera: str = "Industrial"
    color: str = "gris"


def Post_alumno_FromEncuesta(alumno: AlumnoDto, db):
    query = text(
        """INSERT INTO "Alumnos" (dni, nombre, apellido, email, fecha_inicio, carrera, materias_aprobadas, "PRE", plan_de_estudios) VALUES (:dni, :nombre, :apellido, :email, :fecha_inicio, :carrera, :materias_aprobadas, :pre, :plan_de_estudios)
        ON CONFLICT (dni) DO UPDATE SET materias_aprobadas = :materias_aprobadas, "PRE" = :pre, plan_de_estudios = :plan_de_estudios"""
    )
    db.execute(
        query,
        {
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "email": alumno.email,
            "dni": alumno.dni,
            "fecha_inicio": alumno.fecha_inicio,
            "carrera": "industrial",
            "materias_aprobadas": alumno.materias_aprobadas,
            "pre": alumno.pre,
            "plan_de_estudios": alumno.plan_de_estudios,
        },
    )
    return db.commit()


def Post_Alumno(alumno: AlumnoDto, db):

    # SQL QUERY INSERT INTO alumnos VALUES ()
    query = text(
        """INSERT INTO "Alumnos" (dni, nombre, apellido, email, fecha_inicio, carrera) VALUES (:dni, :nombre, :apellido, :email, :fecha_inicio, :carrera) ON CONFLICT (dni) DO NOTHING"""
    )
    db.execute(
        query,
        {
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "email": alumno.email,
            "dni": alumno.dni,
            "fecha_inicio": alumno.fecha_inicio,
            "carrera": "Industrial",
        },
    )

    return db.commit()


def Get_alumno_by_dni(dni: str, db) -> AlumnoDto:
    print("alumno")
    query = text("""SELECT * FROM "Alumnos" WHERE dni = :dni""")

    alumno_by_dni = db.execute(query, {"dni": dni}).mappings().fetchone()
    print(alumno_by_dni)
    if alumno_by_dni is None:
        # return None
        raise ValueError(f"Alumno con dni {dni} no encontrado")
    return AlumnoDto(
        nombre=alumno_by_dni["nombre"],
        apellido=alumno_by_dni["apellido"],
        email=alumno_by_dni["email"],
        dni=alumno_by_dni["dni"],
        fecha_inicio=alumno_by_dni["fecha_inicio"],
        carrera=alumno_by_dni["carrera"],
        pre=alumno_by_dni["PRE"],
        materias_aprobadas=alumno_by_dni["materias_aprobadas"],
        plan_de_estudios=alumno_by_dni["plan_de_estudios"],
    )


def Get_alumnos(db, tutor_dni=None) -> list[AlumnoDto]:
    # SQL QUERY SELECT * FROM alumnos ORDER BY nombre
    alumnos_list = []
    if tutor_dni:
        query = text("""
            SELECT "Alumnos".* 
            FROM "Alumnos" 
            INNER JOIN "Tutor-Alumno" ON "Alumnos".dni = "Tutor-Alumno".dni_alumno 
            WHERE "Tutor-Alumno".dni_tutor = :tutor_dni
            ORDER BY "Alumnos".dni
        """)
        fetched_alumnos = (db.execute(query, {"tutor_dni": tutor_dni})).mappings().fetchall()
    else:
        query = text("""SELECT *  FROM "Alumnos" ORDER BY dni""")
        fetched_alumnos = (db.execute(query)).mappings().fetchall()
    for alumno in fetched_alumnos:
        # print(alumno["PRE"] is not nan)
        # print(alumno["PRE"])
        alumnos_list.append(
            AlumnoDto(
                nombre=alumno["nombre"],
                apellido=alumno["apellido"],
                email=alumno["email"],
                dni=alumno["dni"],
                fecha_inicio=alumno["fecha_inicio"],
                carrera=alumno["carrera"],
                pre=0,
                materias_aprobadas=alumno["materias_aprobadas"],
                plan_de_estudios=alumno["plan_de_estudios"],
            )
        )
    return alumnos_list


def Get_alumnos_with_stats(db, tutor_dni=None) -> list[AlumnoDto]:
    """
    Trae a todos los alumnos pero agregar la informacion de la nueva tabla 'Semaforo'
    """
    alumnos = []
    base_query = """
        SELECT
            "Alumnos".nombre,
            "Alumnos".apellido,
            "Alumnos".email,
            "Alumnos".carrera,
            "Alumnos".dni,
            "Alumnos".fecha_inicio,
            "Semaforo".color,
            "Semaforo".score,
            "Semaforo".created_at,
            "Tutor-Alumno".dni_tutor
        FROM "Alumnos"
        LEFT JOIN "Tutor-Alumno" ON "Alumnos".dni = "Tutor-Alumno".dni_alumno
        LEFT JOIN (
            SELECT *,
                   ROW_NUMBER() OVER (PARTITION BY dni_alumno ORDER BY created_at DESC) as rn
            FROM "Semaforo"
        ) "Semaforo" ON "Alumnos".dni = "Semaforo".dni_alumno AND "Semaforo".rn = 1
    """
    
    if tutor_dni:
        base_query += """ WHERE "Tutor-Alumno".dni_tutor = :tutor_dni """
        
    base_query += """ ORDER BY "Alumnos".dni ASC """
    query = text(base_query)

    if tutor_dni:
        fetched = (db.execute(query, {"tutor_dni": tutor_dni})).mappings().fetchall()
    else:
        fetched = (db.execute(query)).mappings().fetchall()
    for row in fetched:
        data = dict(row)
        if data.get("color") is None:
            data["color"] = "gris"
        if data.get("score") is None:
            data["score"] = 0
        alumnos.append(SimpleNamespace(**data))
    return alumnos

def Get_alumnos_with_stats_by_page(limit, page, db):
    offset = page*limit
    """
    Trae a los alumnos que no tienen tutor asignado, ordenados por score ascendente (menor a mayor).
    """
    alumnos = []
    query = text("""
        SELECT
            "Alumnos".dni,
            "Alumnos".nombre,
            "Alumnos".apellido,
            "Alumnos".email,
            "Tutor-Alumno".dni_tutor,
            "Semaforo".score
        FROM "Alumnos"
        LEFT JOIN "Tutor-Alumno" ON "Alumnos".dni = "Tutor-Alumno".dni_alumno
        LEFT JOIN (
            SELECT *,
                   ROW_NUMBER() OVER (PARTITION BY dni_alumno ORDER BY created_at DESC) as rn
            FROM "Semaforo"
        ) "Semaforo" ON "Alumnos".dni = "Semaforo".dni_alumno AND "Semaforo".rn = 1
        WHERE "Tutor-Alumno".dni_tutor IS NULL
        ORDER BY "Semaforo".score ASC
        LIMIT :limit OFFSET :offset
    """)

    fetched = (db.execute(query, {"limit": limit, "offset": offset})).mappings().fetchall()
    for row in fetched:
        data = dict(row)
        if data.get("score") is None:
            data["score"] = 0
        alumnos.append(SimpleNamespace(**data))
    return alumnos


def set_state(dni: str, color: str, score: float, db):
    # SQL QUERY UPDATE alumnos SET color = ? WHERE dni = ? VALUES(color, dni)
    query = text(
        """UPDATE "Alumnos" SET color = :color, score = :score WHERE dni = :dni"""
    )
    db.execute(query, {"color": color, "dni": str(dni), "score": score})
    return


def get_score(dni: str, db) -> float:
    query = text("""SELECT score FROM "Alumnos" WHERE dni = :dni""")
    result = db.execute(query, {"dni": dni}).fetchone()
    print("score", result)
    return result[0]


def aumentar_cuatrimestre(db):

    query = text(
        """ UPDATE "Alumnos" SET cuatrimestre = cuatrimestre + 1 WHERE cuatrimestre <> 10"""
    )

    db.execute(query)
    return


def fetch_semaforos(db, dni):
    query = text(
        """SELECT color, score, DATE(created_at) as fecha FROM "Semaforo" WHERE dni_alumno = :dni ORDER BY fecha"""
    )

    try:
        return [
            SimpleNamespace(**row)
            for row in db.execute(query, {"dni": dni}).mappings().fetchall()
        ]
    except Exception as e:
        raise Exception(e)


def fetch_indicadoresXcohorte(db, cohorte):
    query = text(""" SELECT AVG(pse) as pse, AVG(pse) as pse_prom,
                            AVG(ic) as ic_prom,
                            AVG(pep) as pep_prom,
                            AVG(cl) as cl_prom,
                            AVG(cv) as cv_prom,
                            AVG(loc) as loc_prom
                     FROM "Indicadores" i
                     JOIN "Alumnos" a
                     ON a.dni = i.dni
                     WHERE a.fecha_inicio = :cohorte;
                """)

    try:
        return SimpleNamespace(
            **db.execute(query, {"cohorte": cohorte}).mappings().fetchone()
        )

    except Exception as e:
        raise Exception(e)


def get_cuatrimestrales_filtrados(db, filtro, valor):

    COLUMNAS_PERMITIDAS = [
        "plan_de_estudios",
        "materias_aprobadas",
        "cuatrimestre",
        "fecha_inicio",
    ]
    try:
        if filtro in COLUMNAS_PERMITIDAS:
            query = text(f"""
                            SELECT dni, {filtro},
                            AVG(rac) AS "rendimiento cuantitativo",
                            AVG(rap) AS "rendimiento percibido",
                            AVG(raf) AS "rendimiento final",
                            AVG(ac) AS "atraso de la carrera"
                            FROM "indicadores_cuatrimestrales" ic
                            JOIN "Alumnos" a
                            ON a.dni = ic.dni
                            WHERE (:valor = -1 OR a.{filtro} = :valor)
                            GROUP BY {filtro}
                            ORDER BY {filtro}
                        """)
            rows = db.execute(query, {"valor": valor}).mappings().all()
            return [SimpleNamespace(**row) for row in rows]

        else:
            raise ValueError("la columna seleccionada no existe")
    except Exception as e:
        raise Exception(e)


def get_iniciales_filtrados(db, filtro, valor):

    COLUMNAS_PERMITIDAS = [
        "plan_de_estudios",
        "materias_aprobadas",
        "cuatrimestre",
        "fecha_inicio",
    ]
    try:
        if filtro in COLUMNAS_PERMITIDAS:
            query = text(f"""
                            SELECT a.{filtro},
                            AVG(i.pse) AS "perfil socio-economico",
                            AVG(i.ic) AS "interrupcion de la carrera",
                            AVG(i.pep) AS "perfil educativo de los padres/tutores",
                            AVG(i.cl) AS "carga laboral",
                            AVG(i.cv) AS "carga vital",
                            AVG(i.loc) AS "localidad"
                            FROM "Indicadores" i
                            JOIN "Alumnos" a
                            ON a.dni = i.dni_alumno
                            WHERE (:valor = -1 OR a.{filtro} = :valor)
                            GROUP BY a.{filtro}
                            ORDER BY a.{filtro}
                        """)
            rows = db.execute(query, {"valor": valor}).mappings().all()
            return [SimpleNamespace(**row) for row in rows]

        else:
            raise ValueError("la columna seleccionada no existe")
    except Exception as e:
        raise Exception(e)


def get_semaforo_pre(db, cohorte):

    try:
        query = text(""" SELECT DISTINCT ON (a.dni)
            s.score,
            a."PRE" AS perfil
        FROM "Alumnos" a
        JOIN "Semaforo" s
            ON s.dni_alumno = a.dni
        WHERE a.fecha_inicio = :cohorte
          AND a."PRE" IS NOT NULL
        ORDER BY a.dni, s.created_at DESC;
                    """)
        rows = db.execute(query, {"cohorte": cohorte}).mappings().fetchall()
        return [SimpleNamespace(**row) for row in rows]

    except Exception as e:
        raise Exception(e)


def get_scoreXcohorte(db):

    try:
        query = text("""
            SELECT
                a.fecha_inicio AS cohorte,
                AVG(t.score) AS promedio_score
            FROM "Alumnos" a
            JOIN (
                SELECT DISTINCT ON (s.dni_alumno)
                    s.dni_alumno,
                    s.score
                FROM "Semaforo" s
                ORDER BY s.dni_alumno, s.created_at DESC
            ) t
                ON t.dni_alumno = a.dni
            GROUP BY a.fecha_inicio
            ORDER BY cohorte;
                    """)
        rows = db.execute(query).mappings().fetchall()
        return [SimpleNamespace(**row) for row in rows]

    except Exception as e:
        raise Exception(e)


def get_datosIniciales(db, dni):

    try:
        query = text("""
                        SELECT a.materias_aprobadas as "materias aprobadas",
                        a.plan_de_estudios as "plan de estudio",
                        (a.materias_aprobadas - m.cantidad) AS "materias respecto al plan"
                        FROM "Alumnos" a
                        JOIN "materiasXcuatrimestre" m
                        ON m.numero = a.cuatrimestre
                        WHERE a.dni = :dni
                    """)
        row = db.execute(query, {"dni": dni}).mappings().fetchone()
        if row is None:
            raise Exception("no se encontro el alumno")

        return SimpleNamespace(**row)
    except Exception as e:
        raise Exception(e)


def get_scores_historicos(db, dni):

    try:
        query = text("""
                        SELECT DATE(created_at) as "fecha",
                        score
                        FROM "Semaforo"
                        WHERE dni_alumno = :dni
                        ORDER BY fecha
                    """)
        rows = db.execute(query, {"dni": dni}).mappings().fetchall()
        if rows is None:
            raise Exception("no se encontro el alumno")
        return [SimpleNamespace(**row) for row in rows]
    except Exception as e:
        raise Exception(e)


def reset_pre(db, dni, pre):
    try:
        query = text("""UPDATE "Alumnos" SET "PRE" = :pre WHERE dni = :dni""")
        db.execute(query, {"dni": dni, "pre": pre})
        db.commit()
    except Exception as e:
        print(e)
