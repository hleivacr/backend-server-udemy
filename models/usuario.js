var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es Necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es Necesario'] },
    password: { type: String, required: [true, 'El password es Necesario'] },
    img: { type: String },
    role: { type: String, default: 'USER_ROLE', enum: rolesValidos },
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('usuario', usuarioSchema);