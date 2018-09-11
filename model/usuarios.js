var mongoose = require('mongoose');
//plugin for unique-validator
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema= new Schema({
    nombre: {type: String, required: [true, 'nombre es requerido']},
    email: {type: String, unique:true, required: [true,'email es requerido']},
    password: {type: String, required: [true,'password es requerido']},
    img: {type: String, required:false},
    role: {type: String,  required:true, default: 'USER_ROLE',enum: rolesValidos},
    google: { type: Boolean, required: true, default: false }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports= mongoose.model('usuarios',usuarioSchema);