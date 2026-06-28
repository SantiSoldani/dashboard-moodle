import csv
import io
from types import SimpleNamespace

from fastapi.responses import StreamingResponse
from sqlalchemy import text


def export_db(db):

    query = text("""
                    SELECT
                    -- columnas del alumno --
                    a.dni,
                    a.nombre,
                    a.apellido,
                    a.carrera,
                    a.fecha_inicio as cohorte,
                    a."PRE" as "perfil de riesgo estructural",
                    a.materias_aprobadas,
                    a.plan_de_estudios,
                    a.cuatrimestre,

                    --columas del semaforo --
                    s.score,
                    s.color,
                    --columnas de las notas--
                    e.nota,
                    m.nombre,
                    --columna de los indicadores--
                    i.pse AS "perfil socio economico",
                    i.ic AS " interrupcion de la carrera",
                    i.pep AS "perfil educativo de los padres",
                    i.cl AS "carga laboral",
                    i.cv AS "carga vital",
                    i.loc AS "localizacion",
                    ic.rap AS "rendimiento academico persivido",
                    ic.rac AS "rendimiento academico cuantitativo"

                    FROM "Alumnos" a
                    -- join de alumnos con los semaforos --
                    LEFT JOIN "Semaforo" s
                    ON s.dni_alumno = a.dni

                    --join de alumnos con las notas --
                    LEFT JOIN "Examen" e
                    ON e.dni_alumno = a.dni

                    --join de notas con las materias --

                    LEFT JOIN "Materia" m
                    ON m.id = e.id_materia

                    --join con los indicadores--
                    LEFT JOIN "Indicadores" i
                    ON i.dni_alumno = a.dni
                    LEFT JOIN "indicadores_cuatrimestrales" ic
                    ON ic.dni_alumno = a.dni
                """)
    rows = db.execute(query).mappings().fetchall()
    print(rows)
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)
    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=export.csv"},
    )
