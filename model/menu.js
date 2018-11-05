var mongoose = require('mongoose');
//plugin for unique-validator
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var menuSchema = new mongoose.Schema({
    operationCod : {type: String, required: [true, 'El codigo de operacion es  requerido']},
    operationFath : {type: String, required: true},
    description : {type: String, required: true},
    icono : {type: String, required: false},
    typeOperationCod : {type: String, required: true},
    route : {type: String, required: false}  ,
    submenu: {
        type: mongoose.Schema.Types.Array       
    },  
}, {collection: 'menu'});

module.exports= mongoose.model('menu',menuSchema);


