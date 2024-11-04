const express = require('express')

const Record = require('../models/record')
const Patients = require('../models/patient')
const Patient = require('../models/patient')
const router = express.Router()

router.get('/', (req, res) => {
    Record.find()
    .then(resultado => {
        if(resultado.length > 0)
            res.status(200)
            .send({ok: true, resultado: resultado})
        else
            res.status(404)
            .send({ok: false, error: "No se encontraron expedientes en el sistema."})
    })
    .catch(error => {
        res.status(500)
        .send({ok: false, error: "Error interno del servidor."})
    })
})

router.get('/find', (req, res) => {
    const name = req.query.name

    Patient.find({name: {$regex: name, $options: 'i'}})
    .then(resultado => {
        if(resultado.length > 0){

            const patientsId = resultado.map(patient => patient._id);

            Record.find({patient: {$in: patientsId}})
            .then(resultado => {
                if(resultado.length > 0)
                    res.status(200)
                    .send({ok: true, resultado: resultado});
                else
                    res.status(404)
                    .send({ok: false, error: "No se han encontrado expedientes."});
            })
            .catch(error => {
                res.status(500)
                .send({ok: false, error: "Error interno del servidor."})
            })
        }
        else
            res.status(404)
            .send({ok: false, error: "No se han encontrado pacientes con ese nombre."});
    })
    .catch(error => {
        res.status(500)
        .send({ok: false, error: "Error interno del servidor."})
    })
})

router.get('/:id', (req, res) => {
    Record.findById(req.params.id)
    .then(resultado => {
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(404)
            .send({ok: false, error: "Expediente no encontrado."});
    })
    .catch(error => {
        res.status(500)
        .send({ok: false, error: "Error interno del servidor"})
    })
})

router.post('/', (req, res) => {
    const newRecord = new Record({
        patient: req.body.patient,
        medicalRecord: req.body.medicalRecord,
        appointments: req.body.appointments
    })

    newRecord.save()
    .then(resultado => {
        res.status(201)
        .send({ok: true, resultado: resultado})
    })
    .catch(error => {
        res.status(400)
        .send({ok: false, error: error})
    })
})

router.post('/:id/appointments', (req, res) => {
    
    const newAppointment = {
        date: req.body.date,
        physio: req.body.physio,
        diagnosis: req.body.diagnosis,
        treatment: req.body.treatment,
        observations: req.body.observations
    }

    Record.findById(req.params.id)
    .then(resultado => {
        if(resultado){
            resultado.appointments.push(newAppointment);

            resultado.save()
            .then(resultado => {
                res.status(201)
                .send({ok: true, resultado: resultado})
            })
            .catch(error => {
                res.status(500)
                .send({ok: false, error: "Error interno del servidor."})
            })
        }
        else
            res.status(404)
            .send({ok: false, error: "Expediente no encontrado."});
    })
    .catch(error => {
        res.status(500)
        .send({ok: false, error: "Error interno del servidor."})
    })
})

router.delete('/:id', (req, res) => {
    Record.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(404)
            .send({ok: false, error: "Expediente no encontrado"});
    })
    .catch(error => {
        res.status(500)
        .send({ok: false, error: "Error interno del servidor."})
    })
})

module.exports = router;