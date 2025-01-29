const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    login: {
        type: String,
        unique: [true, "El nombre de usuario ya está en uso."],
        required: [true, "El nombre de usuario es obligatorio."],
        minlength: [4, "La longitud mínima del usuario es de 4 carácteres."],
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria."],
        minlength: [7, "La contraseña debe tener mínimo 7 carácteres."],
    },
    rol: {
        type: String,
        required: [true, "El rol es obligatorio"],
        enum: ['admin', 'physio', 'patient']
    }
}); 

let User = mongoose.model('users', userSchema);
module.exports = User; 