# Muro de mensajes — Laboratorio de Docker

Sistemas Operativos · FACET · UNT

Aplicación de prueba para el laboratorio de contenedores. Consta de dos partes:

- **web/**: backend en Python (Flask) que muestra un muro de mensajes y recibe peticiones HTTP en el puerto 5000.
- **db/**: script de inicialización para una base de datos PostgreSQL donde se guardan los mensajes.

Durante el laboratorio vas a escribir los `Dockerfile` de cada parte y el archivo `compose.yaml` que las une. El repositorio **no** los incluye.

## Estructura

```
muro-docker/
├── web/
│   ├── app.py              # servidor Flask
│   ├── requirements.txt    # dependencias de Python
│   ├── .dockerignore       # archivos que no se copian a la imagen
│   ├── templates/index.html
│   └── static/estilo.css
└── db/
    └── init.sql            # crea la tabla y un mensaje de bienvenida
```

## Variables de entorno del backend

| Variable       | Valor por defecto | Para qué sirve                          |
|----------------|-------------------|-----------------------------------------|
| `DB_HOST`      | `muro-db`         | Nombre (o IP) del servidor de la base   |
| `DB_PORT`      | `5432`            | Puerto de PostgreSQL                    |
| `DB_NAME`      | `muro`            | Nombre de la base de datos              |
| `DB_USER`      | `postgres`        | Usuario de la base                      |
| `DB_PASSWORD`  | `postgres`        | Contraseña de la base                   |
| `APP_VERSION`  | `sin definir`     | Texto que se muestra al pie de la página|

No hace falta instalar Python ni PostgreSQL en tu computadora: todo corre dentro de contenedores.
