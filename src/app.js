// require('dotenv').config()
import express from 'express'
import cors from 'cors'

// const db = require('../model/db')
import { pool } from "./db.js";

let origen = "https://santi-gastos-hogar.netlify.app"
const app = express()
const port = 4000

// Middlewares
app.use(cors());
app.use(express.json())


// RUTAS: Las rutas que manejará el servidor para servir recursos

// Usuarios
app.get("/api/usuarios", async (req, res) => {
    try {

        const [rows] = await pool.query("SELECT * FROM cuentas");
        console.log("rows /api/usuarios", rows)
        res.send(rows)

    } catch (err) {
        return res.status(500).json({ message: "Something goes wrong" + err });
    }

})

// Importe total del usuario (dara un numero de pesos gastados)
app.get("/api/importe-total/:usuario", async (req, res) => {
    // usuario = "santi" // localStorage.getItem("usuario")

    try {
        let usuario = req.params.usuario

        const [rows] = await pool.query("SELECT SUM(importe) FROM gastos WHERE usuario = ? AND moneda = 'pesos'", [usuario])
        console.log("/api/importe-total/:usuario", rows)
        res.send(rows)

    } catch (err) {
        return res.status(500).json({ message: "Something goes wrong" + err });
    }
});

// Todos los aportes en común
app.get("/api/aportes", async (req, res) => {

    try {

        const [rows] = await pool.query("SELECT item,rubro,importe, moneda, fechaGasto,comentarios, usuario  FROM gastos WHERE aporte = 1")
        console.log("/api/aportes", rows)
        res.send(rows)

    } catch (err) {
        return res.status(500).json({ message: "Something goes wrong" + err });
    }


});

// Importe total entre quienes aportan en común
app.get("/api/importe-aportes", async (req, res) => {
    // usuario = "santi" // localStorage.getItem("usuario")

    try {

        const sql = "SELECT SUM(importe) FROM gastos WHERE aporte = 1"
        const [rows] = await pool.query(sql)
        console.log("/api/importe-aportes", rows)
        res.send(rows)


    } catch (err) {
        return res.status(500).json({ message: "Something goes wrong" + err })
    }


});

// importe en comun santi
app.get("/api/importe-aportes-santi", async (req, res) => {
    // usuario = "santi" // localStorage.getItem("usuario")
    try {

        const sql = "SELECT SUM(importe) FROM gastos WHERE aporte = 1 AND usuario = 'santi'"
        const [rows] = await pool.query(sql)
        res.send(rows)

    } catch (err) {
        return res.status(500).json({ message: "Something goes wrong" + err })
    }



});

// importe en comun santi
app.get("/api/importe-aportes-sil", async (req, res) => {
    // usuario = "santi" // localStorage.getItem("usuario")
    try {

        const sql = "SELECT SUM(importe) FROM gastos WHERE aporte = 1 AND usuario = 'syl'"
        const [rows] = await pool.query(sql)
        res.send(rows)

    } catch (err) {
        return res.status(500).json({ message: "Something goes wrong" + err })
    }



});

// CRUD GASTO
// -----------------

// Agregar gasto 
app.post("/api/agregar-gasto", async (req, res) => {

    let data = req.body

    await pool.query("INSERT INTO gastos SET ?", [data])
    console.info("datos agregados!" + data)
    res.redirect("/");
})

// Todos los gastos del usuario
app.get("/api/ver-gastos/:usuario", async (req, res) => {
    try {

        let usuario = req.params.usuario
        const [rows] = await pool.query("SELECT * FROM gastos WHERE usuario = ?;SELECT * FROM tarjetas WHERE usuario = ?; ", [usuario, usuario])
        res.send(rows)

    } catch (err) {
        return res.status(500).json({ message: "Something goes wrong" + err })
    }

});

// Editar gasto diario
app.put("/api/editar-gasto/:id", async (req, res) => {


    const id = req.params.id
    let data = req.body

    await pool.query("UPDATE gastos SET ? where id = ?", [data, id])
    console.info("gasto actualizado!" + data + " " + id)
    res.redirect("/");
})

// Borrar gasto
app.delete("/api/borrar-gasto/:id", async (req, res) => {


    let id = req.params.id

    await pool.query("DELETE FROM gastos WHERE id = ?", [id])
    console.info("datos eliminados!" + id)
    res.redirect("/");
})

// CRUD Tarjeta

// Agregar resumen tarjeta (gasto)
app.post("/api/agregar-tarjeta", async (req, res) => {


    let data = req.body

    await pool.query("INSERT INTO tarjetas SET ?", data)
        console.info("datos agregados!")
    res.redirect("/");
})

// Editar gasto tarjeta
app.put("/api/tarjeta/editar-gasto/:id", async (req, res) => {


    const id = req.params.id
    let data = req.body

    await pool.query("UPDATE tarjetas SET ? where id = ?", [data, id])
        console.info("gasto actualizado!")
    res.redirect("/");
})


// Borrar gasto
app.delete("/api/tarjeta/borrar-gasto/:id", async (req, res) => {

    let id = req.params.id
    await pool.query("DELETE FROM tarjetas WHERE id = ?", [id])
    console.info("datos eliminados!")
    res.redirect("/");
})

// FILTROS
// Todos los gastos del usuario en mes actual y de todos los usuarios
app.get("/api/ver-gastos/:usuario/mes-actual", async (req, res) => {

    try {
        let usuario = req.params.usuario ?? "todos"
        let sql;

        if (usuario != "todos") {
            sql = "select id, item,rubro,importe,tipoPago, moneda, fechaGasto,comentarios FROM `gastos` WHERE usuario = ? AND MONTH(fechaGasto) = MONTH(now()) AND YEAR(fechaGasto) = YEAR(now()) "
        } else {

            sql = "select * FROM `gastos` WHERE aporte = 1 AND MONTH(fechaGasto) = MONTH(now()) AND YEAR(fechaGasto) = YEAR(now()) "
        }

        const [rows] = await pool.query(sql, [usuario])
        res.send(rows)

    } catch (err) {
        return res.status(500).json({ message: "Something goes wrong" + err })
    }

});


app.use(function (err, req, res, next) {
    console.error("ERROR STACK", err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res, next) => {
    res.status(404).json({ message: "Not found" });
});

export default app;
/*
app.listen(port, () => {
    console.info(`Servidor en puerto: ${port}`)
})
*/
