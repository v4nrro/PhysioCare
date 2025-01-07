const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const path = require('path'); // Asegúrate de importar 'path'


dotenv.config();

const patients = require('./routes/patients');
const physios = require('./routes/physios');
const records = require('./routes/records')

mongoose.connect(process.env.DATABASE_URL);


let app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'njk');


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/patients', patients);
app.use('/physios', physios);
app.use('/records', records);

app.get('/', (req, res) => {
    res.render('/public/index.html');
});

app.listen(process.env.PUERTO);
