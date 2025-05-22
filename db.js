// db.js

require('dotenv').config(); // Carrega o .env
const sql = require('mssql'); // Conector SQL Server

// Configurações de conexão com o banco
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, // true se for Azure
        trustServerCertificate: true // necessário para conexões locais
    }
};

// Cria e exporta uma pool de conexão reutilizável
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Conectado ao SQL Server com sucesso!");
        return pool;
    })
    .catch(err => console.error("Erro na conexão com o banco:", err));

module.exports = {
    sql, poolPromise
};