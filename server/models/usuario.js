const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "el nombre es necesario"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "el email es necesario"],
    },
    password: {
        type: String,
        required: [true, "la Pass es necesaria"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos
            //required: true
    },
    estado: {
        type: Boolean,
        default: true,
        //required: true
    },
    google: {
        type: Boolean,
        default: false,
        //required: true
    }

});

usuarioSchema.methods.toJSON = function() {
    //quito la contraseña de la respuesta
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;

}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser Unico'
});

module.exports = mongoose.model('Usuario', usuarioSchema);