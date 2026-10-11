"""
Muro de mensajes - Laboratorio de Docker
Sistemas Operativos - FACET UNT

Backend en Flask que guarda mensajes en una base de datos PostgreSQL.
La conexión se configura con variables de entorno (ver README.md).
"""
import os
import socket

import psycopg
from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)

# --- Configuración tomada de variables de entorno -------------------------
DB_HOST = os.environ.get("DB_HOST", "muro-db")
DB_PORT = int(os.environ.get("DB_PORT", "5432"))
DB_NAME = os.environ.get("DB_NAME", "muro")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "postgres")
APP_VERSION = os.environ.get("APP_VERSION", "sin definir")


def conectar():
    """Abre una conexión nueva a la base. Lanza una excepción si no está disponible."""
    return psycopg.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        connect_timeout=3,
    )


def crear_tabla(conn):
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS mensajes (
            id      SERIAL PRIMARY KEY,
            autor   VARCHAR(50)  NOT NULL,
            texto   VARCHAR(280) NOT NULL,
            creado  TIMESTAMP    NOT NULL DEFAULT NOW()
        )
        """
    )


def info_sistema():
    """Datos del proceso y del 'equipo' donde corre el servidor."""
    return {
        "hostname": socket.gethostname(),
        "pid": os.getpid(),
        "ppid": os.getppid(),
        "usuario": os.getuid(),
        "version": APP_VERSION,
        "db_host": f"{DB_HOST}:{DB_PORT}",
    }


@app.route("/")
def inicio():
    mensajes = []
    error_db = None
    try:
        with conectar() as conn:
            crear_tabla(conn)
            mensajes = conn.execute(
                "SELECT id, autor, texto, creado FROM mensajes ORDER BY creado DESC"
            ).fetchall()
    except psycopg.OperationalError as e:
        error_db = str(e).strip().splitlines()[0]
        print(f"[muro] No se pudo conectar a la base en {DB_HOST}:{DB_PORT}: {error_db}", flush=True)

    return render_template(
        "index.html", mensajes=mensajes, error_db=error_db, info=info_sistema()
    )


@app.route("/mensajes", methods=["POST"])
def agregar():
    autor = request.form.get("autor", "").strip()[:50] or "Anónimo"
    texto = request.form.get("texto", "").strip()[:280]
    if texto:
        with conectar() as conn:
            crear_tabla(conn)
            conn.execute(
                "INSERT INTO mensajes (autor, texto) VALUES (%s, %s)", (autor, texto)
            )
        print(f"[muro] Mensaje nuevo de {autor}", flush=True)
    return redirect(url_for("inicio"))


@app.route("/mensajes/<int:id_mensaje>/borrar", methods=["POST"])
def borrar(id_mensaje):
    with conectar() as conn:
        conn.execute("DELETE FROM mensajes WHERE id = %s", (id_mensaje,))
    print(f"[muro] Mensaje {id_mensaje} borrado", flush=True)
    return redirect(url_for("inicio"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
