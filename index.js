const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const patients = require('./routes/patients');
const physios = require('./routes/physios');
const records = require('./routes/records')
const auth = require('./routes/auth');

mongoose.connect(process.env.DATABASE_URL);

let app = express();

app.listen(process.env.PUERTO);

app.use(express.json());
app.use('/patients', patients);
app.use('/physios', physios);
app.use('/records', records)
app.use('/auth', auth);