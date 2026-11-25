const input = document.getElementById('input-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');
const lista = document.getElementById('lista-tarefas');
const contador = document.getElementById('contador');
const vazio = document.getElementById('vazio');
const botoesFiltro = document.querySelectorAll('.filtro');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let filtroAtual = 'todas';

function salvar() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function tarefasVisiveis() {
  if (filtroAtual === 'pendentes') return tarefas.filter(t => !t.concluida);
  if (filtroAtual === 'concluidas') return tarefas.filter(t => t.concluida);
  return tarefas;
}

function renderizar() {
  lista.innerHTML = '';
  const visiveis = tarefasVisiveis();

  visiveis.forEach(tarefa => {
    const li = document.createElement('li');
    if (tarefa.concluida) li.classList.add('concluida');

    const span = document.createElement('span');
    span.textContent = tarefa.texto;
    span.addEventListener('click', () => alternarConcluida(tarefa.id));
    span.addEventListener('dblclick', () => editarTarefa(tarefa.id, li));

    const divAcoes = document.createElement('div');
    divAcoes.classList.add('acoes');

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = '✕';
    btnExcluir.addEventListener('click', () => excluirTarefa(tarefa.id));

    divAcoes.appendChild(btnExcluir);
    li.appendChild(span);
    li.appendChild(divAcoes);
    lista.appendChild(li);
  });

  vazio.hidden = visiveis.length > 0;

  const concluidas = tarefas.filter(t => t.concluida).length;
  contador.textContent = `${concluidas} de ${tarefas.length} concluídas`;
}

function adicionarTarefa() {
  const texto = input.value.trim();
  if (texto === '') return;

  tarefas.push({ id: Date.now(), texto, concluida: false });
  salvar();
  renderizar();
  input.value = '';
  input.focus();
}

function alternarConcluida(id) {
  const tarefa = tarefas.find(t => t.id === id);
  tarefa.concluida = !tarefa.concluida;
  salvar();
  renderizar();
}

function excluirTarefa(id) {
  tarefas = tarefas.filter(t => t.id !== id);
  salvar();
  renderizar();
}

function editarTarefa(id, li) {
  const tarefa = tarefas.find(t => t.id === id);

  const inputEdicao = document.createElement('input');
  inputEdicao.type = 'text';
  inputEdicao.value = tarefa.texto;
  inputEdicao.classList.add('input-edicao');

  li.innerHTML = '';
  li.appendChild(inputEdicao);
  inputEdicao.focus();

  function salvarEdicao() {
    const novoTexto = inputEdicao.value.trim();
    tarefa.texto = novoTexto === '' ? tarefa.texto : novoTexto;
    salvar();
    renderizar();
  }

  inputEdicao.addEventListener('blur', salvarEdicao);
  inputEdicao.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') inputEdicao.blur();
  });
}

btnAdicionar.addEventListener('click', adicionarTarefa);

input.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') adicionarTarefa();
});

botoesFiltro.forEach(botao => {
  botao.addEventListener('click', () => {
    botoesFiltro.forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    filtroAtual = botao.dataset.filtro;
    renderizar();
  });
});

renderizar();
