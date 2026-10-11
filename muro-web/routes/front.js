const os = require('os');
const express = require('express');
const Mensaje = require('../models/Mensaje');

const router = express.Router();

// Convierte una fecha en un texto como "hace 5 min"
function hace(fecha) {
    const segundos = Math.floor((Date.now() - new Date(fecha).getTime()) / 1000);
    if (segundos < 60) return 'recién';
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `hace ${horas} h`;
    const dias = Math.floor(horas / 24);
    return dias === 1 ? 'ayer' : `hace ${dias} días`;
}

// Página principal: lista los mensajes del muro
router.get('/', async (req, res) => {
    const Estado_DB = req.app.locals.Estado_DB;
    let mensajes = [];

    if (Estado_DB === 'on') {
        try {
            mensajes = await Mensaje.find().sort({ created_at: -1 });
        } catch (err) {
            console.log(err.message);
        }
    }

    res.render('muro', {
        mensajes,
        db_state: Estado_DB,
        colores: Mensaje.COLORES,
        hostname: os.hostname(),
        hace
    });
});

// POST - Publicar un mensaje
router.post('/', async (req, res) => {
    const texto = (req.body.texto || '').trim();
    const autor = (req.body.autor || '').trim() || 'Anónimo';
    const color = Mensaje.COLORES.includes(req.body.color) ? req.body.color : 'amarillo';

    if (texto) {
        try {
            await new Mensaje({ autor, texto, color }).save();
            console.log(`Mensaje nuevo de ${autor}`);
        } catch (err) {
            console.log(err.message);
        }
    }
    res.redirect('/');
});

// POST - Sumar un "me gusta" a un mensaje
router.post('/mensaje/me-gusta', async (req, res) => {
    try {
        await Mensaje.findByIdAndUpdate(req.body._key, { $inc: { likes: 1 } });
    } catch (err) {
        console.log(err.message);
    }
    res.redirect('/');
});

// POST - Borrar un mensaje
router.post('/mensaje/borrar', async (req, res) => {
    try {
        await Mensaje.findByIdAndDelete(req.body._key);
        console.log(`Mensaje ${req.body._key} borrado`);
    } catch (err) {
        console.log(err.message);
    }
    res.redirect('/');
});

module.exports = router;
