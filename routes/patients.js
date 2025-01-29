const express = require('express');
const bcrypt = require('bcrypt');

const upload = require(__dirname + '/../utils/uploads.js');
const Patient = require('../models/patient.js');
const User = require('../models/user.js');

const router = express.Router();

router.get('/', (req, res) => {
    Patient.find()
    .then(resultado => {
        if (resultado.length > 0)
            res.render('patients_list', {patients: resultado});
        else
            res.render('error', {error: "No hay pacientes en el sistema."});
    }).catch(error => {
        res.render('error', {error: "Error interno del servidor"});
    });
});

router.get('/new', (req, res) => {
    res.render('patient_add');
});

router.get('/:id/edit', (req, res) => {
    Patient.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('patient_edit', {patient: resultado});
        } else {
            res.render('error', {error: "Paciente no encontrado"});
        }
    }).catch(error => {
        res.render('error', {error: "Error interno del servidor"});
    });
});

router.get('/find', (req, res) => {
    const surname = req.query.surname;

    Patient.find({surname: { $regex: surname, $options: 'i'}})
    .then(resultado => {
        if (resultado.length > 0)
            res.render('patients_list_surname', {patients: resultado});
        else
            res.render('error', {error: "Paciente no encontrado"});
    }).catch(error => {
        res.render('error',{error: "Error interno del servidor"});
    });
});

router.get('/:id', (req, res) => {
    Patient.findById(req.params.id)
    .then(resultado => {
        if (resultado)
            res.render('patient_detail', {patient: resultado});
        else
            res.render('error', {error: "Este paciente no existe en el sistema."});
    }).catch(() => {
        res.render('error', {error: "Error interno del servidor"});
    });
});

router.post('/', upload.upload.single('image'), (req, res) => {
    let newUser = new User({
        login: req.body.login,
        password: req.body.password,
        rol: "patient"
    });

    newUser.save()
    .then(resultado =>{
        let userId = resultado._id;

        let newPatient = new Patient({
            _id: userId,
            name: req.body.name,
            surname: req.body.surname,
            birthDate: req.body.birthDate,
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber
        });
        if (req.file) newPatient.image = req.file.filename;

        newPatient.save()
        .then(() => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('error', {error: "Error insertando paciente ", error});
        });
    })
    .catch(error => {
        res.render('error', {error: "Error creando usuario."});
    });
})

router.post('/:id', upload.upload.single('image'), (req, res) => {
    Patient.findById(req.params.id)
    .then(resultado => {
        if(resultado){
            resultado.name = req.body.name;
            resultado.surname = req.body.surname;
            resultado.birthDate = req.body.birthDate;
            resultado.insuranceNumber = req.body.insuranceNumber;
            resultado.address = req.body.address;

            if(req.file){
                resultado.image = req.file.filename;
            }

            resultado.save()
            .then(() => {
                res.redirect(req.baseUrl);
            })
            .catch(error => {
                res.render('error', {error: "Error guardando el paciente."})
            })
        }
        else{
            res.render('error',{error: "Error actualizando los datos del paciente."});
        }
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor."})
    });
});


router.delete("/:id", (req, res) => {
    Patient.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if(resultado)
            res.redirect(req.baseUrl);
        else
        res.render('error', {error: "Error borrando paciente"});
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor"});
    })
});

module.exports = router;