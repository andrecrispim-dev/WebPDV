// routes/login.js
const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db'); // Conexão com o banco

router.post('/', async (req, res) => {
    const { nome, senha } = req.body;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('nome', sql.VarChar, nome)
            .input('senha', sql.VarChar, senha)
            .query('SELECT * FROM VENDEDORES WHERE NOME = @nome AND SENHA = @senha');

        if (result.recordset.length > 0) {
            res.json({ sucesso: true, vendedor: result.recordset[0] });
        } else {
            res.json({ sucesso: false, mensagem: "Usuário ou senha inválidos." });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao tentar autenticar.");
    }
});

module.exports = router;
