const mongoose = require('mongoose')

let physioSchema = new mongoose.Schema({ 

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
    specialty: {
        type: String,
        required: [true, "La especialidad del fisio es obligatoria."],
        enum: ['Sports', 'Neurological', 'Pediatric', 'Geriatric', 'Oncological']
    },
    licenseNumber: {
        type: String,
        required: [true, "El número de licencia es obligatorio."],
        match: [/^[a-zA-Z0-9]{8}$/, "El número de licencia debe constar de 8 carácteres."]
    }

});

let Physio = mongoose.model('physios', physioSchema)
module.exports = Physio;