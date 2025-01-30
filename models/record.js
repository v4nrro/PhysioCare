const mongoose = require('mongoose');

let appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, "La fecha es obligatoria."]
    },
    physio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'physios',
        required: [true, "El fisio es obligatorio."]
    },
    diagnosis: {
        type: String,
        required: [true, "El diagnóstico es obligatorio."],
        minlength: [10, "El diagnóstico no puede tener menos de 10 carácteres."],
        maxlength: [500, "El diagnóstico no puede tener más de 500 carácteres."]
    },
    treatment: {
        type: String,
        required: [true, "El tratamiento es obligatorio."],
    },
    observations: {
        type: String,
        required: false,
        maxlength: [500, "Las observaciones no pueden tener más de 500 carácteres."]
    }
});

let recordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        unique: [true, "No se puede abrir 2 expedientes de un mismo paciente."],
        ref: 'patients',
        required: [true, "El paciente es obligatorio."]
    },
    medicalRecord: {
        type: String,
        required: false,
        maxlength: [1000, "La longitud máxima del expediente médico es de 1000 carácteres."]
    },
    appointments: [appointmentSchema]
});

let Record = mongoose.model('records', recordSchema);
module.exports = Record;