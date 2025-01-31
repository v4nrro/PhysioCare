const express = require('express');

const upload = require(__dirname + '/../utils/uploads.js');
const Patient = require('../models/patient.js');
const User = require('../models/user.js');
const auth = require('../auth/auth.js')
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
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

router.get('/new', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
    res.render('patient_add');
});

router.get('/:id/edit', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
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

router.get('/find', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
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

router.get('/:id', auth.authentication, (req, res) => {
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

router.post('/', upload.upload.single('image'), auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hashedPassword => {
        let newUser = new User({
            login: req.body.login,
            password: hashedPassword,
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
                res.render('patient_add', {errores: "Error insertando paciente."});
            });
        })
        .catch(error => {
            res.render('patient_add', {errores: "Error creando usuario."});
        });
    })
    .catch(error => {
        res.render('error', { error: "Error en el servidor.", details: error });
    });
})

router.post('/:id', upload.upload.single('image'), auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
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
                res.render('error', {error: "Error guardando paciente."});
            })
        }
        else{
            res.render('error', {error: "Error actualizando datos del paciente."});
        }
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor."})
    });
});


router.delete("/:id", auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
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