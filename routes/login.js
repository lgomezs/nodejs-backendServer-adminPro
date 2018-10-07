var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../model/usuarios');
var Menu = require('../model/menu');


var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;

const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;

var mdAutenticacion = require('../middlewares/autenticacion');

app.get("/renuevaToken", mdAutenticacion.verificaToken,(req,res)=>{ 

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 1800 }); 

    res.status(200).json({
        ok: true,
        token: token
    });
});

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                usuario: usuarioDB,                
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

       
        usuarioDB.password = ':)';

         // Crear un token!!!
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 1800 }); // 30 min
        
        var menu = generarMenu(usuario.role);

        menu.then(data=>{

            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                token: token,          
                id: usuarioDB._id,
                menu: data
            });

        });        
    })
});


// ==========================================
//  Autenticación De Google
// ==========================================
app.post('/google', (req, res) => {

    var token = req.body.token || 'XXX';

    var client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

    client.verifyIdToken(
        token,
        GOOGLE_CLIENT_ID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function(e, login) {

            if (e) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Token no válido',
                    errors: e
                });
            }

            var payload = login.getPayload();
            var userid = payload['sub'];
            // If request specified a G Suite domain:
            //var domain = payload['hd'];

            Usuario.findOne({ email: payload.email }, (err, usuario) => {

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al buscar usuario - login',
                        errors: err
                    });
                }

                if (usuario) {

                    if (usuario.google === false) {
                        return res.status(400).json({
                            ok: true,
                            mensaje: 'Debe de usar su autenticación normal'
                        });
                    } else {

                        usuario.password = ':)';

                        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 1800 }); 


                        var menu = generarMenu(usuario.role);
                        menu.then(data=>{

                            console.log(data);

                            res.status(200).json({
                                ok: true,
                                usuario: usuario,
                                token: token,
                                id: usuario._id,
                                menu: data
                            });
                        });                       
                    }

                    // Si el usuario no existe por correo
                } else {

                    var usuario = new Usuario();

                    usuario.nombre = payload.name;
                    usuario.email = payload.email;
                    usuario.password = ':)';
                    usuario.img = payload.picture;
                    usuario.google = true;

                    usuario.save((err, usuarioDB) => {

                        if (err) {
                            return res.status(500).json({
                                ok: true,
                                mensaje: 'Error al crear usuario - google',
                                errors: err
                            });
                        }

                        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 1800 }); 

                        var menu = generarMenu(usuario.role);

                        menu.then(data=>{
                            res.status(200).json({
                                ok: true,
                                usuario: usuarioDB,
                                token: token,
                                id: usuarioDB._id,
                                menu: data
                            });
                        });

                        
                    });
                }
            });
        });
});


module.exports = app;

function generarMenu(ROL){  
    return new Promise((resolve, reject) => {
        Menu.find( {}, (err, menu) =>{
            if(err){
                console.log("error al obtener menu");
                reject('error al obtener menu', err);
            }
            resolve(menu)           
        });
    });
}
   