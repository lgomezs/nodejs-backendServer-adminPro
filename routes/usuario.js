var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Usuario = require('../model/usuarios');

// Rutas

/////////////////////////////////////////////////////////////////
//************** Metodo get , obtener usuarios
/////////////////////////////////////////////////////////////////
app.get('/', (req, res, next) => {

    Usuario.find( {}, 'nombre email img role google')
        .exec(
                (err,usuarios)=>{
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando usuarios',
                            errorrs: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios
                    });            
            });   
});

/////////////////////////////////////////////////////////////////
//************** Metodo post , registrar usuario
/////////////////////////////////////////////////////////////////

app.post('/',(req,res)=>{
    var body = req.body;

           
    var usuario =  new Usuario({
        nombre :  body.nombre,
        email : body.email,
        password : bcrypt.hashSync(body.password,10),
        img : body.img,
        role: body.role,
        google: body.google
    });

    usuario.save((err,usuarioGuardado)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error registrando usuario',
                errorrs: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });
});

/////////////////////////////////////////////////////////////////
//************** Metodo put, actualizar usuario
/////////////////////////////////////////////////////////////////

app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) =>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errorrs: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }


        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });
});

/////////////////////////////////////////////////////////////////
//************** Metodo delete, eliminar usuario
/////////////////////////////////////////////////////////////////

app.delete('/:id', mdAutenticacion.verificaToken,(req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});


module.exports=app;
