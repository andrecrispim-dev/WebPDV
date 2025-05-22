// routes/produtos.js

const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db'); // Conexão com o banco

router.get('/', async (req, res) => {
    const termo = req.query.termo || ""; // termo enviado na URL

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('termo', sql.VarChar, `%${termo}%`)
            .query("SELECT ESTOQUE_ID, DESCRICAO, CUSTO_BRUTO FROM ESTOQUE WHERE DESCRICAO LIKE @termo");

        res.json(result.recordset); // envia a lista de produtos ao front
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar produtos");
    }
});

module.exports = router;