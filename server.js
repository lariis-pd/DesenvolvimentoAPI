const express = require('express');
const app = express();
const path = require('path');
const produtosRoute = require('./rotas/produtos');
const logger = require('./middleware/logger');

app.use(express.json());
app.use(logger); 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/produtos', produtosRoute);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
