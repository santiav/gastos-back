// require('dotenv').config()
import express from 'express'
import cors from 'cors'


const app = express()
const port = 4000

// Middlewares
app.use(cors());
app.use(express.json())

// const db = require('../model/db')
import { pool } from "./db.js";


// RUTAS: Las rutas que manejará el servidor para servir recursos

// Usuarios
app.get("/api/usuarios", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM cuentas");
        console.log("rows /api/usuarios", rows)
        res.send(rows)
        
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
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
        return res.status(500).json({ message: "Something goes wrong" });
    }
});

// Todos los aportes en común
app.get("/api/aportes", (req, res) => {

    pool.query("SELECT item,rubro,importe, moneda, fechaGasto,comentarios, usuario  FROM gastos WHERE aporte = 1", (err, result) => {
        if (err) {
            console.error(err)
        }
        res.send(result)
    });
});

// Importe total entre quienes aportan en común
app.get("/api/importe-aportes", (req, res) => {
    // usuario = "santi" // localStorage.getItem("usuario")
    const sql = "SELECT SUM(importe) FROM gastos WHERE aporte = 1"
    pool.query(sql, (err, result) => {
        if (err) {
            console.log("ERROR en /api/importe-aportes")
            console.error(err)
        }
        res.send(result)
    });
});

// importe en comun santi
app.get("/api/importe-aportes-santi", (req, res) => {
    // usuario = "santi" // localStorage.getItem("usuario")
    const sql = "SELECT SUM(importe) FROM gastos WHERE aporte = 1 AND usuario = 'santi'"
    pool.query(sql, (err, result) => {
        if (err) {
            console.log("ERROR en /api/importe-aportes-santi")
            console.error(err)
        }
        res.send(result)
    });
});

// importe en comun santi
app.get("/api/importe-aportes-sil", (req, res) => {
    // usuario = "santi" // localStorage.getItem("usuario")
    const sql = "SELECT SUM(importe) FROM gastos WHERE aporte = 1 AND usuario = 'syl'"
    pool.query(sql, (err, result) => {
        if (err) {
            console.log("ERROR en /api/importe-aportes-sil")
            console.error(err)
        }
        res.send(result)
    });
});

// CRUD GASTO
// -----------------

// Agregar gasto 
app.post("/api/agregar-gasto", (req, res) => {

    let data = req.body
    pool.query("INSERT INTO gastos SET ?", data, (err, results) => {
        if (err) throw err
        console.info("datos agregados!")
    })
})

// Todos los gastos del usuario
app.get("/api/ver-gastos/:usuario", (req, res) => {
    let usuario = req.params.usuario
    pool.query("SELECT * FROM gastos WHERE usuario = ?;SELECT * FROM tarjetas WHERE usuario = ?; ", [usuario, usuario], (err, result) => {
        if (err) {
            console.error(err)
        }
        //  console.log(result)
        res.send(result)
    });
});

// Editar gasto diario
app.put("/api/editar-gasto/:id", (req, res) => {

    const id = req.params.id
    let data = req.body
    pool.query("UPDATE gastos SET ? where id = ?", [data, id], (err, results) => {
        if (err) throw err
        console.info("gasto actualizado!")
    })
})

// Borrar gasto
app.delete("/api/borrar-gasto/:id", (req, res) => {

    let id = req.params.id
    pool.query("DELETE FROM gastos WHERE id = ?", [id], (err, results) => {
        if (err) throw err
        console.info("datos eliminados!")
    })
})

// CRUD Tarjeta

// Agregar resumen tarjeta (gasto)
app.post("/api/agregar-tarjeta", (req, res) => {

    let data = req.body
    pool.query("INSERT INTO tarjetas SET ?", data, (err, results) => {
        if (err) throw err
        console.info("datos agregados!")
    })
})

// Editar gasto tarjeta
app.put("/api/tarjeta/editar-gasto/:id", (req, res) => {

    const id = req.params.id
    let data = req.body
    pool.query("UPDATE tarjetas SET ? where id = ?", [data, id], (err, results) => {
        if (err) throw err
        console.info("gasto actualizado!")
    })
})


// Borrar gasto
app.delete("/api/tarjeta/borrar-gasto/:id", (req, res) => {

    let id = req.params.id
    pool.query("DELETE FROM tarjetas WHERE id = ?", [id], (err, results) => {
        if (err) throw err
        console.info("datos eliminados!")
    })
})

// FILTROS
// Todos los gastos del usuario en mes actual y de todos los usuarios
app.get("/api/ver-gastos/:usuario/mes-actual", (req, res) => {
    let usuario = req.params.usuario ?? "todos"

    let sql;
    if (usuario != "todos") {
        sql = "select id, item,rubro,importe,tipoPago, moneda, fechaGasto,comentarios FROM `gastos` WHERE usuario = ? AND MONTH(fechaGasto) = MONTH(now()) AND YEAR(fechaGasto) = YEAR(now()) "
    } else {

        sql = "select * FROM `gastos` WHERE aporte = 1 AND MONTH(fechaGasto) = MONTH(now()) AND YEAR(fechaGasto) = YEAR(now()) "
    }

    pool.query(sql, usuario, (err, result) => {
        if (err) {
            console.error(err)
        }

        res.send(result)
    });
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