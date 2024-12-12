const express = require('express');
const bcrypt = require('bcrypt');

const Patient = require('../models/patient.js');
const User = require('../models/user.js');
const auth = require('../auth/auth');

const router = express.Router();

router.get('/', auth.protegerRuta(['admin', 'physio']), (req, res) => {
    Patient.find()
    .then(resultado => {
        if (resultado.length > 0)
            res.status(200)
               .send({result: resultado});
        else
            res.status(404)
               .send({error: "No hay pacientes en el sistema."});
    }).catch(error => {
        res.status(500)
           .send({error: "Error interno del servidor"});
    });
});

router.get('/find', auth.protegerRuta(['admin', 'physio']), (req, res) => {
    const surname = req.query.surname;

    Patient.find({surname: { $regex: surname, $options: 'i'}})
    .then(resultado => {
        if (resultado.length > 0)
            res.status(200)
               .send({result: resultado});
        else
            res.status(404)
               .send({error: "Paciente no encontrado"});
    }).catch(error => {
        res.status(500)
           .send({error: "Error interno del servidor"});
    });
});

router.get('/:id', auth.protegerRuta(['admin', 'physio', 'patient']), (req, res) => {
    Patient.findById(req.params.id)
    .then(resultado => {
        if (resultado)
            res.status(200)
               .send({result: resultado});
        else
            res.status(404)
               .send({error: "Paciente no encontrado"});
    }).catch(error => {
        res.status(500)
           .send({error: "Error interno del servidor"});
    });
});

router.post('/', auth.protegerRuta(['admin', 'physio']), (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(passwordCifrada => {
        let newUser = new User({
            login: req.body.login,
            password: passwordCifrada,
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

            newPatient.save()
            .then(resultado => {
                res.status(201)
                   .send({result: resultado});
            }).catch(error => {
                res.status(400)
                   .send({error: error});
            });
        })
        .catch(error => {
            res.status(500)
            .send({error: "Error interno del servidor."});
        });
    })
    .catch(error => {
        res.status(400)
        .send({error: error})
    });
})

router.put('/:id', auth.protegerRuta(['admin', 'physio']), (req, res) => {
    Patient.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            surname: req.body.surname,
            birthDate: req.body.birthDate,
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber
        }
    }, {new: true, runValidators: true})
    .then(resultado => {
        if(resultado){
            res.status(200)
            .send({result: resultado})
        }
        else
            res.status(400)
            .send({error: "Error actualizando los datos del paciente."});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor"})
    });
});

router.delete("/:id", auth.protegerRuta(['admin', 'physio']), (req, res) => {
    Patient.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if(resultado)
            res.status(200)
            .send({result: resultado});
        else
            res.status(404)
            .send({error: "El paciente a eliminar no existe."})
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."})
    })
});

module.exports = router;