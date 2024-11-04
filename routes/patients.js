const express = require('express');

const Patient = require('../models/patient.js');
const router = express.Router();

router.get('/', (req, res) => {
    Patient.find()
    .then(resultado => {
        if (resultado.length > 0)
            res.status(200)
               .send({ok: true, resultado: resultado});
        else
            res.status(404)
               .send({ok: false, error: "No hay pacientes en el sistema."});
    }).catch(error => {
        res.status(500)
           .send({ok: false, error: "Error interno del servidor"});
    });
});

router.get('/find', (req, res) => {
    const surname = req.query.surname;

    Patient.find({surname: { $regex: surname, $options: 'i'}})
    .then(resultado => {
        if (resultado.length > 0)
            res.status(200)
               .send({ok: true, resultado: resultado});
        else
            res.status(404)
               .send({ok: false, error: "Paciente no encontrado"});
    }).catch(error => {
        res.status(500)
           .send({ok: false, error: "Error interno del servidor"});
    });
});

router.get('/:id', (req, res) => {
    Patient.findById(req.params.id)
    .then(resultado => {
        if (resultado)
            res.status(200)
               .send({ok: true, resultado: resultado});
        else
            res.status(404)
               .send({ok: false, error: "Paciente no encontrado"});
    }).catch(error => {
        res.status(500)
           .send({ok: false, error: "Error interno del servidor"});
    });
});

router.post('/', (req, res) => {
    let newPatient = new Patient({
        name: req.body.name,
        surname: req.body.surname,
        birthDate: req.body.birthDate,
        address: req.body.address,
        insuranceNumber: req.body.insuranceNumber
    });

    newPatient.save()
    .then(resultado => {
        res.status(201)
           .send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(400)
           .send({ok: false, error: error});
    });
})

router.put('/:id', (req, res) => {
    Patient.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            surname: req.body.surname,
            birthDate: req.body.birthDate,
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber
        }
    }, {new: true})
    .then(resultado => {
        if(resultado){
            res.status(200)
            .send({ok: true, resultado: resultado})
        }
        else
            res.status(400)
            .send({ok: false, error: "Error actualizando los datos del paciente."});
    })
    .catch(error => {
        res.status(500)
        .send({ok:false, error: "Error interno del servidor"})
    });
});

router.delete("/:id", (req, res) => {
    Patient.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(404)
            .send({ok: false, error: "El paciente a eliminar no existe."})
    })
    .catch(error => {
        res.status(500)
        .send({ok: false, error: "Error interno del servidor."})
    })
});

module.exports = router;