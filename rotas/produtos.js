const express = require('express');
const router = express.Router();
let produtos = require('../dados/db.js')

router.get('/', (req, res) => {
  res.json(produtos);
});

router.post('/', (req, res) => {
  const { nome, codigo, preco, categoria, estoque } = req.body;
  const novo = { id: Date.now(), nome, codigo, preco, categoria, estoque };
  produtos.push(novo);
  res.status(201).json(novo);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  produtos = produtos.filter(p => p.id !== id);
  res.json({ mensagem: 'Produto deletado' });
});

module.exports = router;
