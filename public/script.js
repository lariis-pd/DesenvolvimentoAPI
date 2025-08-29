const form = document.getElementById('formProduto');
const lista = document.getElementById('listaProdutos');

const mostrarProdutos = (produtos) => {
  lista.innerHTML = '';
  produtos.forEach(prod => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${prod.nome} - R$ ${prod.preco} - ${prod.categoria}
      <button onclick="deletarProduto(${prod.id})">Deletar</button>
    `;
    lista.appendChild(li);
  });
};

const salvarLocal = (produtos) => {
  localStorage.setItem('produtos', JSON.stringify(produtos));
};

const carregarLocal = () => {
  return JSON.parse(localStorage.getItem('produtos')) || [];
};

const carregarProdutos = async () => {
  const res = await fetch('/api/produtos');
  const dados = await res.json();
  salvarLocal(dados);
  mostrarProdutos(dados);
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const produto = {
    nome: form.nome.value,
    codigo: form.codigo.value,
    preco: parseFloat(form.preco.value),
    categoria: form.categoria.value,
    estoque: parseInt(form.estoque.value)
  };

  const res = await fetch('/api/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto)
  });

  const novo = await res.json();
  const produtos = carregarLocal();
  produtos.push(novo);
  salvarLocal(produtos);
  mostrarProdutos(produtos);
  form.reset();
});

const deletarProduto = async (id) => {
  await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
  const produtos = carregarLocal().filter(p => p.id !== id);
  salvarLocal(produtos);
  mostrarProdutos(produtos);
};

window.onload = carregarProdutos;
