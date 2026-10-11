# Muro de mensajes — Laboratorio de Docker

Repositorio para el laboratorio de Docker y contenedores de Sistemas Operativos, FACET UNT.

La aplicación de prueba es un muro de mensajes:

- **muro-web/**: backend en Node.js (Express + EJS) que recibe las peticiones HTTP en el puerto 3000. Usa nodemon y livereload (puerto 35729) para recargar la página cuando cambia el código.
- **Base de datos MongoDB**: almacena los mensajes que envía el backend. La vas a crear durante el laboratorio en la carpeta `muro-db/`.

La dirección de la base de datos está en `muro-web/config/keys.js` (`mongodb://muro-db:27017/muro`): el host debe coincidir con el nombre del contenedor de la base.

Los `Dockerfile` y el `compose.yml` los escribís vos siguiendo la guía del laboratorio. No hace falta instalar Node.js ni MongoDB en tu computadora.
