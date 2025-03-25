require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const db = require('./config/db');
const users = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3700;

app.use(cors());
app.use(express.json());
app.use('/api', users);

db();

app.listen(PORT, () => {
    console.log(`Server runnung on http://localhost:${PORT}`);
});
