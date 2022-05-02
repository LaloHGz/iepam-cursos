const mysql = require('mysql');
const router = require('../routes/router');

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

conexion.connect(err => {
    if (err) {
        console.error('error connecting: ' + err);
        return;
    }

    console.log('connected to MySQL database');
});

module.exports = conexion;