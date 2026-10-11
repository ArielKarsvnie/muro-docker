const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MensajeSchema = new Schema({
    autor: {
        type: String,
        default: 'Anónimo',
        maxlength: 50
    },
    texto: {
        type: String,
        required: true,
        maxlength: 280
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('mensajes', MensajeSchema);
