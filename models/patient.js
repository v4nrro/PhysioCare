const mongoose = require('mongoose');

let patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del paciente es obligatorio."],
        minlength: [2, "La longitud mínima es de 2 carácteres."],
        maxlength: [50, "La longitud máxima es de 50 carácteres."],
    },
    surname: {
        type: String,
        required: [true, "El apellido del paciente es obligatorio."],
        minlength: [2, "La longitud mínima es de 2 carácteres."],
        maxlength: [50, "La longitud máxima es de 50 carácteres."],
    },
    image: {
        type: String,
        required: false
    },
    birthDate: {
        type: Date,
        required: [true, "La fecha del nacimiento es obligatoria."],
    },
    address: {
        type: String,
        required: false,
        maxlength: [100, "La dirección no puede tener más de 100 carácteres."],
    },
    insuranceNumber: {
        type: String,
        required: [true, "El número de seguridad social del paciente es obligatorio."],
        match: [/^[a-zA-Z0-9]{9}$/, "El número debe constar de 9 dígitos."]
    },
});

let Patient = mongoose.model('patients', patientSchema);
module.exports = Patient;