const express = require('express');
const app = express();
const path = require('path');
const produtosRoute = require('./rotas/produtos');
const logger = require('./middleware/logger'); // ✅

app.use(express.json());
app.use(logger); // ✅ Middleware chamado aqui
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/produtos', produtosRoute);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
