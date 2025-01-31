const express = require('express')

const Record = require('../models/record')
const Patient = require('../models/patient')
const Physio = require('../models/physio')
const auth = require('../auth/auth.js')

const router = express.Router()

router.get('/', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
    Record.find()
    .populate('patient')
    .populate('appointments.physio')
    .then(resultado => {
        if(resultado.length > 0)
            res.render('records_list', {records: resultado});
        else
            res.render('error', {error: "No se encontraron expedientes en el sistema."})
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor."})
    })
})

router.get('/:id/new', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
    Patient.findById(req.params.id)
    .then(resultado => {
        res.render('record_add', {patient: resultado});
    })
    .catch(error => {
        res.render('error', {error: error})
    })
});

router.get('/:id/appointments/new', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
    Patient.findById(req.params.id)
    .then(patient => {
        Physio.find()
        .then(physios => {
            res.render('record_add_appointment', {patient: patient, physios: physios});
        })
        .catch(() => {
            res.render('error', {error: "No se han encontrado fisios en el sistema."})
        })
    })
    .catch(error => {
        res.render('error', {error: error})
    })
});

router.get('/find', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
    const surname = req.query.surname

    Patient.find({surname: {$regex: surname, $options: 'i'}})
    .then(resultado => {
        if(resultado.length > 0){

            const patientsId = resultado.map(patient => patient._id);

            Record.find({patient: {$in: patientsId}})
            .populate('patient')
            .populate('appointments.physio')
            .then(resultado => {
                if(resultado.length > 0)
                    res.render('records_list_surname', {records: resultado});
                else
                    res.render('error', {error: "No se han encontrado expedientes."});
            })
            .catch(() => {
                res.render('error', {error: "Error interno del servidor."})
            })
        }
        else
            res.render('error', {error: "No se han encontrado pacientes con ese nombre."});
    })
    .catch(() => {
        res.render('error', {error: "Error interno del servidor."})
    })
})

router.get('/:id', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
    const patientId = req.params.id;

    Record.find({'patient': patientId})
    .populate('patient')
    .populate('appointments.physio')
    .then(resultado => {
        if(resultado.length > 0){
            res.render('record_detail', {record: resultado});
        }
        else
            res.render('error', {error: "Expediente no encontrado."});
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor"})
    })
})

router.post('/', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
    const newRecord = new Record({
        patient: req.body.patient,
        medicalRecord: req.body.medicalRecord,
    })

    newRecord.save()
    .then(() => {
        res.redirect(req.baseUrl)
    })
    .catch(error => {
        res.render('error', {error: "Error insertando record.", error});
    })
})

router.post('/:id/appointments', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
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

router.delete('/:id', auth.authentication, auth.rol(['admin', 'physio']), (req, res) => {
    Record.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if(resultado)
            res.redirect(req.baseUrl);
        else
            res.render('error', {error: "Expediente no encontrado"});
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor."})
    })
})

module.exports = router;