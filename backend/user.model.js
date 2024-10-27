const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let User = new Schema({
    nombre: {
        type: String
    },
    correo_electronico: {
        type: String
    },
    contrasena: {
        type: String
    }
})

module.exports = mongoose.model('User', User);