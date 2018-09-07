var mongoose = require('mongoose');
//plugin for unique-validator
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var medicoSchema = new mongoose.Schema({
    nombre : {type: String, required: [true, 'El nombre es  requerido']},
    img : {type: String, required: false},
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios'
    },  
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'El id hospital es campo obligatorio ']
    }
}, {collection: 'medicos'});

module.exports= mongoose.model('Medico',medicoSchema);