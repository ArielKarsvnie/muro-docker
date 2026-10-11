const mongoose = require('mongoose');
const express = require('express');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');

const app = express();

app.locals.Estado_DB = 'off';

// Configuración de Live Reload: cuando nodemon reinicia el servidor,
// el navegador se reconecta y la página se recarga sola.
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});

// Rutas del frontend
const FrontRouter = require('./routes/front');

// Motor de plantillas ejs
app.set('view engine', 'ejs');

app.use(connectLiveReload());
app.use(express.urlencoded({ extended: false }));

// Conexión a la base de datos (dirección definida en config/keys.js)
const db = require('./config/keys').mongoProdURI;

mongoose.connection.on('connected', () => {
    console.log('Mongodb Connected');
    app.locals.Estado_DB = 'on';
});
mongoose.connection.on('disconnected', () => {
    if (app.locals.Estado_DB === 'on') {
        console.log('Mongodb Disconnected');
    }
    app.locals.Estado_DB = 'off';
});

function conectar() {
    mongoose
        .connect(db, { serverSelectionTimeoutMS: 3000 })
        .catch(() => {
            console.log(`No se encontro la base de datos en ${db}, reintentando en 3 segundos...`);
            setTimeout(conectar, 3000);
        });
}
conectar();

app.use(FrontRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
