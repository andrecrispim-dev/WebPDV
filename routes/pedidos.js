const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

router.post('/', async (req, res) => {
    const { vendedorId, clienteId, produtos } = req.body;

    try {
        const pool = await poolPromise;

        // 1. Buscar o próximo valor da sequência
        const codigoResult = await pool.request()
            .query("SELECT (SEQUENCIADOR_VALOR + 1) AS NovoCodigo FROM SYS_SEQUENCIADOR_PEDIDOS_ORCAMENTOS WHERE SEQUENCIADOR_TABELA = 'PEDIDOS_ORCAMENTOS'");

        const novoCodigo = codigoResult.recordset[0].NovoCodigo;

        // 2. Atualizar o sequenciador com o novo valor
        await pool.request()
            .input('novoValor', sql.Int, novoCodigo)
            .query(`
                UPDATE SYS_SEQUENCIADOR_PEDIDOS_ORCAMENTOS
                SET SEQUENCIADOR_VALOR = @novoValor
                WHERE SEQUENCIADOR_TABELA = 'PEDIDOS_ORCAMENTOS'
            `);

        // 3. Inserir na tabela PEDIDOS_ORCAMENTOS
        await pool.request()
            .input('codigo', sql.Int, novoCodigo)
            .input('vendedorId', sql.Int, vendedorId)
            .input('clienteId', sql.Int, clienteId)
            .query(`
                INSERT INTO PEDIDOS_ORCAMENTOS (CODIGO, VENDEDOR_ID, CLIENTE_ID, DATA)
                VALUES (@codigo, @vendedorId, @clienteId, GETDATE())
            `);

        // 4. Inserir os itens do pedido
        for (const item of produtos) {
            await pool.request()
                .input('lancamento', sql.Int, novoCodigo)
                .input('produtoId', sql.Int, item.ESTOQUE_ID)
                .input('quantidade', sql.Int, item.quantidade)
                .input('preco', sql.Decimal(10, 2), item.CUSTO_BRUTO)
                .query(`
                    INSERT INTO ITENS_PED1 (LANCAMENTO, PRODUTO_ID, QUANTIDADE, PRECO)
                    VALUES (@lancamento, @produtoId, @quantidade, @preco)
                `);
        }

        res.json({ sucesso: true, pedidoId: novoCodigo });

    } catch (err) {
        console.error("Erro ao salvar pedido:", err);
        res.status(500).send("Erro ao salvar pedido");
    }
});

module.exports = router;
