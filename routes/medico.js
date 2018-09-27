var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Medico = require('../model/medico');

// Rutas

/////////////////////////////////////////////////////////////////
//************** Metodo get , obtener medicos
/////////////////////////////////////////////////////////////////
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
                (err,medicos)=>{
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando medicos',
                            errorrs: err
                        });
                    }

                    Medico.count({},(err,medicoCount)=>{
                        res.status(200).json({
                            ok: true,
                            medicos: medicos,
                            cantidad: medicoCount
                        }); 
                    });                              
            });   
});

// ==========================================
// Obtener médico
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id ' + id + ' no existe',
                    errors: { message: 'No existe un medico con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                medico: medico
            });

        })
});

/////////////////////////////////////////////////////////////////
//************** Metodo post , registrar medico
/////////////////////////////////////////////////////////////////

app.post('/',mdAutenticacion.verificaToken,(req,res)=>{
    var body = req.body;
    var medico =  new Medico({
        nombre :    body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err,medicoGuardado)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error registrando medico',
                errorrs: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado          
        });
    });
});


/////////////////////////////////////////////////////////////////
//************** Metodo put, actualizar medico
/////////////////////////////////////////////////////////////////

app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) =>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errorrs: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }


        medico.nombre = body.nombre;
        medico.img= body.img;
        medico.usuario= body.usuario._id;
        medico.hospital= body.hospital.id;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            medicoGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});


/////////////////////////////////////////////////////////////////
//************** Metodo delete, eliminar usuario
/////////////////////////////////////////////////////////////////

app.delete('/:id',mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});


module.exports=app;




