const express = require('express');
const bcrypt = require('bcrypt');

const auth = require('../auth/auth');
const Usuario = require('../models/user');

const router = express.Router();

router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    Usuario.find({ login: login })
    .then(resultado => {
        if (resultado){
            bcrypt.compare(password, resultado[0].password)
            .then((resultadoPassword) => {
                if(resultadoPassword)
                res.status(200)
                .send({result: auth.generarToken(resultado[0].id,resultado[0].login, 
                                            resultado[0].rol)});
                else
                res.status(401)
                .send({error: "Login incorrecto."});
            })
            .catch(error => {
                res.status(500)
                .send({error: "Error interno del servidor."});
            });
        }
        else
            res.status(401)
            .send({error: "Login incorrecto."});
    })
    .catch(error => {
        res.status(500)
        .send({error: "Error interno del servidor."});
    });
});

module.exports = router;