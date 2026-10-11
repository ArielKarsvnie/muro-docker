const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const COLORES = ['amarillo', 'rosa', 'celeste', 'verde', 'lila'];

const MensajeSchema = new Schema({
    autor: {
        type: String,
        default: 'Anónimo',
        maxlength: 40
    },
    texto: {
        type: String,
        required: true,
        maxlength: 280
    },
    color: {
        type: String,
        enum: COLORES,
        default: 'amarillo'
    },
    likes: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('mensajes', MensajeSchema);
module.exports.COLORES = COLORES;
