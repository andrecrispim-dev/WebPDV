// routes/clientes.js

const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

router.get('/', async (req, res) => {
    const nome = req.query.nome || "";

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('nome', sql.VarChar, `%${nome}%`)
            .query("SELECT CLIENTE_ID, NOME, LOGRADOURO, CIDADE FROM CLIENTES WHERE NOME LIKE @nome");

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar clientes");
    }
});

module.exports = router;
