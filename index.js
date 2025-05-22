// index.js

const express = require('express'); // Framework web
const cors = require('cors');       // Permite acesso externo (ex: do navegador)
const bodyParser = require('body-parser'); // Permite ler JSONs no body
const loginRoutes = require('./routes/login');
const produtoRoutes = require('./routes/produtos');
const clienteRoutes = require('./routes/clientes');
const pedidoRoutes = require('./routes/pedidos');

const app = express();
const port = 3000;

// Permitir acesso externo (como do seu front-end no navegador)
app.use(cors());
// Permitir que o servidor entenda JSON vindo do cliente
app.use(bodyParser.json());

app.use('/api/login', loginRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Rota de teste
app.get("/", (req, res) => {
    res.send("Servidor funcionando! 🚀");
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});