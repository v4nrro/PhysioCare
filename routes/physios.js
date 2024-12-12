const express = require('express');
const bcrypt = require('bcrypt');

const Physio = require('../models/physio.js');
const User = require('../models/user.js');
const auth = require('../auth/auth');

const router = express.Router();

router.get('/', (req, res) => {
    Physio.find()
    .then(resultado => {
        if(resultado.length > 0)
            res.status(200)
            .send({result: resultado});
        else
            res.status(404)
            .send({error: "No hay fisios en el sistema."});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."})
    });
});

router.get('/find', (req, res) => {
    const specialty = req.query.specialty

    Physio.find({specialty: { $regex: specialty, $options: 'i'}})
    .then(resultado => {
        if(resultado.length > 0)
            res.status(200)
            .send({result: resultado});
        else
            res.status(404)
            .send({error: "No se han encontrado fisios que cumplan esos criterios."});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."});
    })
});

router.get('/:id', (req, res) => {
    Physio.findById(req.params.id)
    .then(resultado => {
        if(resultado)
            res.status(200)
            .send({result: resultado});
        else
            res.status(404)
            .send({error: "Fisio no encontrado."});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."})
    })
});

router.post('/', auth.protegerRuta(['admin']), (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(passwordCifrada => {
        let newUser = new User({
            login: req.body.login,
            password: passwordCifrada,
            rol: "physio"
        });
    
        newUser.save()
        .then(resultado =>{
            let userId = resultado._id;

            let newPhysio = new Physio({
                _id: userId,
                name: req.body.name,
                surname: req.body.surname,
                specialty: req.body.specialty,
                licenseNumber: req.body.licenseNumber
            })
        
            newPhysio.save()
            .then(resultado => {
                res.status(201)
                .send({result: resultado})
            })
            .catch(error => {
                console.log(error);
                res.status(400)
                .send({error: error})
            })
        })
        .catch(error => {
            res.status(500)
            .send({error: "Error interno del servidor."});
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400)
        .send({error: error})
    });
})

router.put('/:id', auth.protegerRuta(['admin']), (req, res) => {
    Physio.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            surname: req.body.surname,
            specialty: req.body.specialty,
            licenseNumber: req.body.licenseNumber
        }
    }, {new: true, runValidators: true})
    .then(resultado => {
        if(resultado)
            res.status(200)
            .send({result: resultado});
        else
            res.status(400)
            .send({error: "Error actualizando los datos del fisio."});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."})
    })
})

router.delete('/:id', auth.protegerRuta(['admin']), (req, res) => {
    Physio.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if(resultado)
            res.status(200)
            .send({result: resultado});
        else
            res.status(404)
            .send({error: "El fisio a eliminar no existe."});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."})
    })
})

module.exports = router;