const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const path = require('path');

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
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));
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
