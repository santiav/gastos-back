/* const mysql = require('mysql2');


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
})

db.connect(function (err) {
    if (err) throw err
    console.log('La DB se ha conectado');
});

setInterval(function () {
    db.query('SELECT 1');
    console.log("manteniendo viva la conexion")
}, 50000);

module.exports = db; */

import { createPool } from "mysql2/promise";

export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});