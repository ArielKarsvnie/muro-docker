-- Este script lo ejecuta la imagen oficial de PostgreSQL SOLO la primera vez
-- que arranca con un directorio de datos vacío.
CREATE TABLE IF NOT EXISTS mensajes (
    id      SERIAL PRIMARY KEY,
    autor   VARCHAR(50)  NOT NULL,
    texto   VARCHAR(280) NOT NULL,
    creado  TIMESTAMP    NOT NULL DEFAULT NOW()
);

INSERT INTO mensajes (autor, texto)
VALUES ('Cátedra de SO', '¡Bienvenidos al laboratorio de Docker! Este mensaje lo cargó init.sql.');
