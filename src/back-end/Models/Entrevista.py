from types import SimpleNamespace

from sqlalchemy import text


def post_entrevista(db, form):

    try:
        query = text("""
                    INSERT INTO "entrevistas" (dni, pse, ic, pep, cl, cv, loc, ra, score)
                    VALUES (:dni, :pse, :ic, :pep, :cl, :cv, :loc, :ra, :score)
                    """)
        db.execute(
            query,
            {
                "dni": form.dni,
                "pse": form.pse,
                "ic": form.ic,
                "pep": form.pep,
                "cl": form.cl,
                "cv": form.cv,
                "loc": form.loc,
                "ra": form.ra,
                "score": form.score,
            },
        )
        db.commit()
    except Exception as e:
        print(e)


def get_puntaje(db, dni):
    try:
        query = text("""SELECT score from "entrevistas" WHERE dni = :dni
                        ORDER BY created_at DESC
                        LIMIT 1
                    """)

        row = db.execute(query, {"dni": dni}).mappings().fetchone()
        return SimpleNamespace(**row)
    except Exception as e:
        print(e)
