const mongoose = require('mongoose');
const express = require('express');

const patients = require('./routes/patients');
const physios = require('./routes/physios');
const records = require('./routes/records')

mongoose.connect('mongodb://127.0.0.1:27017/physiocare');

let app = express();

app.listen(8080);

app.use(express.json());
app.use('/patients', patients);
app.use('/physios', physios);
app.use('/records', records)
