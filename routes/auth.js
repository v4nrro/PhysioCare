const express = require('express');

const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const auth = require('../auth/auth.js')

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', auth.authentication, (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/login', (req, res) => {
    const { login, password } = req.body;
    
    User.findOne({ login })
        .then(user => {
            if (!user) {
                return res.render('login', { error: "Usuario o contraseña incorrectos" });
            }
            
            return bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.render('login', { error: "Usuario o contraseña incorrectos" });
                    }
                    
                    req.session.usuario = user.login;
                    req.session.usuario_id = user.id;
                    req.session.rol = user.rol;
                    
                    res.render('index');
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Error en el servidor");
        });
});

module.exports = router;