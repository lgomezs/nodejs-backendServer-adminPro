// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cors = require('cors');

// Inicializar variables
var app = express();

//Enable CORS for a Single Route
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())

//cors
//app.use(function(req, res, next) {
  //  res.header("Access-Control-Allow-Origin", "*");
   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   // res.header("Acces-Control-Allow-Methods","PUT, GET, POST,  DELETE, OPTIONS");
   // next();
//});


//Importar rutas
var appRoutes= require('./routes/app');
var appRoutesUsuario= require('./routes/usuario');
var loginRoutes= require('./routes/login');
var appRouteHospital = require('./routes/hospital');
var appRouteMedico = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var uploadRoutesImagenes = require('./routes/imagenes');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://admin:Passw0rd@ds143242.mlab.com:43242/hospitaldb', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});


// Server index config
 //var serveIndex = require('serve-index');
 //app.use(express.static(__dirname + '/'))
 //app.use('/uploads', serveIndex(__dirname + '/uploads'));


//rutas
app.use('/usuario',appRoutesUsuario);
app.use('/login',loginRoutes);
app.use('/hospital',appRouteHospital);
app.use('/medico',appRouteMedico);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', uploadRoutesImagenes);
app.use('/',appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});