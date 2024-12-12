const express = require('express')

const Record = require('../models/record')
const Patient = require('../models/patient')
const auth = require('../auth/auth');

const router = express.Router()

router.get('/', auth.protegerRuta(['admin', 'physio']), (req, res) => {
    Record.find()
    .populate('patient')
    .populate('appointments.physio')
    .then(resultado => {
        if(resultado.length > 0)
            res.status(200)
            .send({result: resultado})
        else
            res.status(404)
            .send({error: "No se encontraron expedientes en el sistema."})
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."})
    })
})

router.get('/find', auth.protegerRuta(['admin', 'physio']), (req, res) => {
    const name = req.query.name

    Patient.find({name: {$regex: name, $options: 'i'}})
    .populate('patient')
    .populate('appointments.physio')
    .then(resultado => {
        if(resultado.length > 0){

            const patientsId = resultado.map(patient => patient._id);

            Record.find({patient: {$in: patientsId}})
            .then(resultado => {
                if(resultado.length > 0)
                    res.status(200)
                    .send({result: resultado});
                else
                    res.status(404)
                    .send({error: "No se han encontrado expedientes."});
            })
            .catch(error => {
                res.status(500)
                .send({error: "Error interno del servidor."})
            })
        }
        else
            res.status(404)
            .send({error: "No se han encontrado pacientes con ese nombre."});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."})
    })
})

router.get('/:id', auth.protegerRuta(['admin', 'physio', 'patient']), (req, res) => {
    const patientId = req.params.id;

    Record.find({'patient': patientId})
    .populate('patient')
    .populate('appointments.physio')
    .then(resultado => {
        if(resultado.length > 0){
            res.status(200)
            .send({result: resultado});
        }
        else
            res.status(404)
            .send({error: "Expediente no encontrado."});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor"})
    })
})

router.post('/', auth.protegerRuta(['admin', 'physio']), (req, res) => {
    const newRecord = new Record({
        patient: req.body.patient,
        medicalRecord: req.body.medicalRecord,
        appointments: req.body.appointments
    })

    newRecord.save()
    .then(resultado => {
        res.status(201)
        .send({result: resultado})
    })
    .catch(error => {
        res.status(400)
        .send({error: error})
    })
})

router.post('/:id/appointments', auth.protegerRuta(['admin', 'physio']), (req, res) => {
    const patientId = req.params.id;

    const newAppointment = {
        date: req.body.date,
        physio: req.body.physio,
        diagnosis: req.body.diagnosis,
        treatment: req.body.treatment,
        observations: req.body.observations
    }

    Record.find({'patient': patientId})
    .then(resultado => {
        if(resultado){
            resultado.appointments.push(newAppointment);

            resultado.save()
            .then(resultado => {
                res.status(201)
                .send({result: resultado})
            })
            .catch(error => {
                res.status(500)
                .send({error: "Error interno del servidor."})
            })
        }
        else
            res.status(404)
            .send({error: "Expediente no encontrado."});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."})
    })
})

router.delete('/:id', auth.protegerRuta(['admin', 'physio']), (req, res) => {
    const patientId = req.params.id;
    
    Record.find({'patient': patientId})
    .then(resultado => {
        if(resultado.length > 0)
            res.status(200)
            .send({result: resultado});
        else
            res.status(404)
            .send({error: "Expediente no encontrado"});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."})
    })
})

module.exports = router;