var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Hospital = require('../model/hospital');

//rutas

/////////////////////////////////////////////////////////////////
//************** Metodo get , obtener hospitales
/////////////////////////////////////////////////////////////////
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde= Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(10)
        .populate('usuario', 'nombre email')
        .exec(
                (err,hospital)=>{
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando hospitales',
                            errorrs: err
                        });
                    }

                    Hospital.count({},(err,conteo)=>{
                        res.status(200).json({
                            ok: true,
                            hospital: hospital,
                            total: conteo
                        });  
                    });                              
            });   
});

/////////////////////////////////////////////////////////////////
//************** Metodo post , registrar hospital
/////////////////////////////////////////////////////////////////

app.post('/',mdAutenticacion.verificaToken,(req,res)=>{
    var body = req.body;
    var hospital =  new Hospital({
        nombre :     body.nombre,      
        usuario:     req.usuario._id 
    });

    hospital.save((err,hospitalGuardado)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error registrando hospital',
                errorrs: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado           
        });

    });
});


/////////////////////////////////////////////////////////////////
//************** Metodo put, actualizar hospital
/////////////////////////////////////////////////////////////////

app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) =>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errorrs: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }


        hospital.nombre = body.nombre;
        hospital.img=body.img;
        hospital.usuario=bode.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });
});

/////////////////////////////////////////////////////////////////
//************** Metodo delete, eliminar hospital
/////////////////////////////////////////////////////////////////

app.delete('/:id',mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});


module.exports=app;




