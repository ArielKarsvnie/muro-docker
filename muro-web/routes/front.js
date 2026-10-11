const express = require('express');
const Mensaje = require('../models/Mensaje');

const router = express.Router();

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

    res.render('muro', { mensajes, db_state: Estado_DB });
});

// POST - Publicar un mensaje
router.post('/', async (req, res) => {
    const texto = (req.body.texto || '').trim();
    const autor = (req.body.autor || '').trim() || 'Anónimo';

    if (texto) {
        try {
            await new Mensaje({ autor, texto }).save();
            console.log(`Mensaje nuevo de ${autor}`);
        } catch (err) {
            console.log(err.message);
        }
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
