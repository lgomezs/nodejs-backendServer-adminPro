var mongoose = require('mongoose');
//plugin for unique-validator
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre : {type: String, required: [true, 'El nombre es  requerido']},
    img : {type: String, required: false},
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios'
    },  
},{collection: 'hospitales'});

module.exports= mongoose.model('Hospital',hospitalSchema);
