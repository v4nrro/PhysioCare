const express = require('express');
const bcrypt = require('bcrypt');

const upload = require(__dirname + '/../utils/uploads.js');
const Physio = require('../models/physio.js');
const User = require('../models/user.js');

const router = express.Router();

router.get('/', (req, res) => {
    Physio.find()
    .then(resultado => {
        if(resultado.length > 0)
            res.render('physios_list', {physios: resultado});
        else
            res.render('error', {error: "No hay fisios en el sistema."});
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor."});
    });
});

router.get('/new', (req, res) => {
    res.render('physio_add');
});

router.get('/find', (req, res) => {
    const specialty = req.query.specialty

    Physio.find({specialty: { $regex: specialty, $options: 'i'}})
    .then(resultado => {
        if(resultado.length > 0)
            res.render('physios_list_specialty', {physios: resultado});
        else
            res.render('error', {error: "No se han encontrado fisios que cumplan esos criterios."});
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor."});
    })
});

router.get('/:id', (req, res) => {
    Physio.findById(req.params.id)
    .then(resultado => {
        if(resultado)
            res.render('physio_detail', {physio: resultado});
        else
        res.render('error', {error: "Fisio no encontrado."});
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor."});
    })
});

router.post('/', upload.upload.single('image'), (req, res) => {
    let newUser = new User({
        login: req.body.login,
        password: req.body.password,
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
        if (req.file) newPhysio.image = req.file.filename;

        newPhysio.save()
        .then(() => {
            res.redirect(req.baseUrl);
        })
        .catch(error => {
            res.render('error', {error: "Error insertando fisio ", error});
        })
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor.", error});
    });
})

router.get('/:id/edit', (req, res) => {
    Physio.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('physio_edit', {physio: resultado});
        } else {
            res.render('error', {error: "Fisio no encontrado"});
        }
    }).catch(error => {
        res.render('error', {error: "Error interno del servidor"});
    });
});

router.post('/:id', upload.upload.single('image'), (req, res) => {
    Physio.findByIdAndUpdate(req.params.id)
    .then(resultado => {
        if(resultado){
            resultado.name = req.body.name;
            resultado.surname = req.body.surname;
            resultado.specialty = req.body.specialty;
            resultado.licenseNumber = req.body.licenseNumber;

            if(req.file){
                resultado.image = req.file.filename;
            }

            resultado.save()
            .then(() => {
                res.redirect(req.baseUrl);
            })
            .catch(error => {
                res.render('error', {error: "Error guardando el fisio."})
            })
        }  
        else{
            res.render('error',{error: "Error actualizando los datos del fisio."});
        }
    })
    .catch(error => {
        res.render('error',{error: "Error interno del servidor."})
    })
})

router.delete('/:id', (req, res) => {
    Physio.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if(resultado)
            res.redirect(req.baseUrl)
        else
            res.render('error', {error: "El fisio a eliminar no existe."});
    })
    .catch(error => {
        res.render('error', {error: "Error interno del servidor."})
    })
})

module.exports = router;