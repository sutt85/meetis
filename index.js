const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const router = require('./routes');

// Configuración y modelos BD
const db = require('./config/db');
require('./models/Usuarios');
require('./models/Categorias');
require('./models/Grupos');
require('./models/Meeti');
require('./models/Comentarios');
db.sync().then(() => console.log('DB Conectada')).catch((error) => console.log(error));

// Variables de Desarrollo
require('dotenv').config({path: 'variables.env'});

// Aplicación Principal
const app = express();

// BOdy parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Express Validator (validación con bastantes funciones)
app.use(expressValidator());

// habilitar EJS como template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Ubicación vistas
app.set('views', path.join(__dirname, './views'));

// archivos estáticos
app.use(express.static('public'));

// Habilitar cookie parser
app.use(cookieParser());

// crear la session
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}))

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Agrega flash messages
app.use(flash());


// Middleware (usuario logueado, flash messages, fecha actual)
app.use((req, res, next) => {
    res.locals.usuario = {...req.user} || null;
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});

// routing
app.use('/', router());

// Leer el host y el puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;
// agrega el puerto
app.listen(port, host, () => {
    console.log('El servidor está funcionando');
})