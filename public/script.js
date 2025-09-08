const form = document.getElementById('formProduto');
const lista = document.getElementById('listaProdutos');

let idEditando = null;

const mostrarProdutos = (produtos) => {
  lista.innerHTML = '';
  produtos.forEach(prod => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${prod.nome} - Preço R$ ${prod.preco} - ${prod.categoria}
      <button onclick="deletarProduto(${prod.id})">Deletar</button>
      <button onclick="editarProduto(${prod.id})">Editar</button>
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

  if (idEditando) {
    const res = await fetch(`/api/produtos/${idEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    });

    if (!res.ok) {
      alert('Erro ao atualizar o produto');
      return;
    }

    const atualizado = await res.json();
    const produtos = carregarLocal().map(p =>
      p.id === idEditando ? atualizado : p
    );
    salvarLocal(produtos);
    mostrarProdutos(produtos);
    idEditando = null;
  } else {
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
  }

  form.reset();
});

const deletarProduto = async (id) => {
  await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
  const produtos = carregarLocal().filter(p => p.id !== id);
  salvarLocal(produtos);
  mostrarProdutos(produtos);
};

const editarProduto = (id) => {
  const produtos = carregarLocal();
  const prod = produtos.find(p => p.id === id);
  if (!prod) return;

  form.nome.value = prod.nome;
  form.codigo.value = prod.codigo;
  form.preco.value = prod.preco;
  form.categoria.value = prod.categoria;
  form.estoque.value = prod.estoque;

  idEditando = id;
};

window.onload = carregarProdutos;
