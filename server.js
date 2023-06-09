require('dotenv').config()
const express = require('express')

const cors = require('cors')
// const { LocalStorage } = require("node-localstorage");
// let localStorage = new LocalStorage('./scratch');

const app = express()
const port = 4000

app.use(cors({
    origin: '*'
}));
app.use(express.json())

const db = require('./model/db')


// RUTAS: Las rutas que manejará el servidor para servir recursos

// Usuarios
app.get("/api/usuarios", (req, res) => {

    db.query("SELECT * FROM cuentas", (err, result) => {
        if (err) {
            console.error(err)
        }
        res.send(result)
    })
})

// Importe total del usuario (dara un numero de pesos gastados)
app.get("/api/importe-total/:usuario", (req, res) => {
    // usuario = "santi" // localStorage.getItem("usuario")
    let usuario = req.params.usuario
    db.query("SELECT SUM(importe) FROM gastos WHERE usuario = ? AND moneda = 'pesos'", usuario, (err, result) => {
        if (err) {
            console.error(err)
        }
        res.send(result)
    });
});

// Todos los aportes en común
app.get("/api/aportes", (req, res) => {

    db.query("SELECT item,rubro,importe, moneda, fechaGasto,comentarios, usuario  FROM gastos WHERE aporte = 1", (err, result) => {
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
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err)
        }
        res.send(result)
    });
});

// importe en comun santi
app.get("/api/importe-aportes-santi", (req, res) => {
    // usuario = "santi" // localStorage.getItem("usuario")
    const sql = "SELECT SUM(importe) FROM gastos WHERE aporte = 1 AND usuario = 'santi'"
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err)
        }
        res.send(result)
    });
});

// importe en comun santi
app.get("/api/importe-aportes-sil", (req, res) => {
    // usuario = "santi" // localStorage.getItem("usuario")
    const sql = "SELECT SUM(importe) FROM gastos WHERE aporte = 1 AND usuario = 'syl'"
    db.query(sql, (err, result) => {
        if (err) {
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
    db.query("INSERT INTO gastos SET ?", data, (err, results) => {
        if (err) throw err
        console.info("datos agregados!")
    })
})



// Todos los gastos del usuario
app.get("/api/ver-gastos/:usuario", (req, res) => {
    let usuario = req.params.usuario
    db.query("SELECT * FROM gastos WHERE usuario = ?;SELECT * FROM tarjetas WHERE usuario = ?; ", [usuario,usuario], (err, result) => {
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
    db.query("UPDATE gastos SET ? where id = ?", [data, id], (err, results) => {
        if (err) throw err
        console.info("gasto actualizado!")
    })
})



// Borrar gasto
app.delete("/api/borrar-gasto/:id", (req, res) => {

    let id = req.params.id
    db.query("DELETE FROM gastos WHERE id = ?", [id], (err, results) => {
        if (err) throw err
        console.info("datos eliminados!")
    })
})

// CRUD Tarjeta

// Agregar resumen tarjeta (gasto)
app.post("/api/agregar-tarjeta", (req, res) => {

    let data = req.body
    db.query("INSERT INTO tarjetas SET ?", data, (err, results) => {
        if (err) throw err
        console.info("datos agregados!")
    })
})

// Editar gasto tarjeta
app.put("/api/tarjeta/editar-gasto/:id", (req, res) => {

    const id = req.params.id
    let data = req.body
    db.query("UPDATE tarjetas SET ? where id = ?", [data, id], (err, results) => {
        if (err) throw err
        console.info("gasto actualizado!")
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
    
    db.query(sql, usuario, (err, result) => {
        if (err) {
            console.error(err)
        }
        
        res.send(result)
    });
});


app.listen(port, () => {
    console.info(`Servidor en puerto: ${port}`)
})
