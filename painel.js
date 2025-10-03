// =============================
// Estado Inicial
// =============================
let state = {
  loja: {
    nome: "",
    telefone: "",
    pix: "",
    banco: "",
    endereco: "",
    logo: "",
    horarios: "",
    corPrimaria: "#3498db",
    corSecundaria: "#95a5a6",
    fundo: "",
    botaoCarrinho: "",
    modoEscuro: false,
    musicaAmbiente: ""
  },
  categorias: [],
  modosVenda: [],
  produtos: [],
  clientes: [],
  cupons: [],
  publicidade: {
    banner: { texto:"", imagem:"", link:"" },
    carrossel: [],
    redesSociais: { instagram:"", facebook:"", whatsapp:"" }
  },
  cobertura: []
};

// =============================
// Utilitários de Armazenamento
// =============================
function salvarLocal() {
  localStorage.setItem('painelState', JSON.stringify(state));
  alert("💾 Salvo no dispositivo!");
}

function carregarLocal() {
  const saved = localStorage.getItem('painelState');
  if (saved) {
    state = JSON.parse(saved);
    renderTudo();
    alert("✅ Configurações carregadas!");
  }
}

// =============================
// Publicar no JSONBin
// =============================
function publicarTotem() {
  const binId = document.getElementById("jsonbinId").value.trim();
  const masterKey = document.getElementById("masterKey").value.trim();

  if (!binId || !masterKey) {
    alert("⚠️ Configure o JSONBin ID e a Master Key antes de publicar!");
    return;
  }

  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": masterKey
    },
    body: JSON.stringify(state)
  })
  .then(res => res.json())
  .then(() => alert("✅ Publicado com sucesso no Totem!"))
  .catch(err => {
    console.error("Erro:", err);
    alert("❌ Erro ao publicar no JSONBin.");
  });
}

// =============================
// Restaurar Padrão
// =============================
function restaurarPadrao() {
  const senha = prompt("Digite a senha para restaurar (1234):");
  if (senha !== "1234") {
    alert("❌ Senha incorreta!");
    return;
  }
  state = {
    loja: { nome:"", telefone:"", pix:"", banco:"", endereco:"", logo:"", horarios:"", corPrimaria:"#3498db", corSecundaria:"#95a5a6", fundo:"", botaoCarrinho:"", modoEscuro:false, musicaAmbiente:"" },
    categorias: [],
    modosVenda: [],
    produtos: [],
    clientes: [],
    cupons: [],
    publicidade: { banner:{texto:"",imagem:"",link:""}, carrossel:[], redesSociais:{instagram:"",facebook:"",whatsapp:""} },
    cobertura: []
  };
  salvarLocal();
  renderTudo();
  alert("🔄 Restaurado para padrão!");
}

// =============================
// Dashboard
// =============================
function renderDashboard() {
  const ctx = document.getElementById("vendasChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Produtos", "Clientes", "Cupons", "Bairros"],
      datasets: [{
        label: "Estatísticas",
        data: [state.produtos.length, state.clientes.length, state.cupons.length, state.cobertura.length],
        backgroundColor: ["#3498db","#2ecc71","#e74c3c","#f39c12"]
      }]
    }
  });
}

// =============================
// Categorias
// =============================
function adicionarCategoria() {
  const nome = document.getElementById("novaCategoria").value;
  if (!nome) return;
  state.categorias.push({ nome, subcategorias: [] });
  salvarLocal();
  renderCategorias();
}

function removerCategoria(i) {
  state.categorias.splice(i,1);
  salvarLocal();
  renderCategorias();
}

function renderCategorias() {
  const container = document.getElementById("category-tree");
  container.innerHTML = state.categorias.map((c,i)=>`
    <div>
      <b>${c.nome}</b>
      <button onclick="removerCategoria(${i})">❌</button>
    </div>
  `).join("");
}

// =============================
// Modo de Venda
// =============================
function adicionarModoVenda() {
  const tipo = document.getElementById("selectModoVenda").value;
  const exemplo = document.getElementById("inputModoVendaExemplo").value;
  state.modosVenda.push({ tipo, exemplo });
  salvarLocal();
  renderModosVenda();
}

function renderModosVenda() {
  const div = document.getElementById("modo-venda");
  div.innerHTML += state.modosVenda.map(m=>`<div>${m.tipo} (${m.exemplo})</div>`).join("");
}

// =============================
// Produtos
// =============================
function adicionarProduto() {
  const produto = {
    nome: document.getElementById("prodNome").value,
    preco: parseFloat(document.getElementById("prodPreco").value),
    imagem: document.getElementById("prodImagem").value,
    descricao: document.getElementById("prodDescricao").value,
    categoria: document.getElementById("prodCategoria").value,
    subcategoria: document.getElementById("prodSubcategoria").value,
    modoVenda: document.getElementById("prodModoVenda").value,
    estoque: parseInt(document.getElementById("prodEstoque").value),
    destaque: document.getElementById("prodDestaque").checked,
    ativo: document.getElementById("prodAtivo").checked
  };
  state.produtos.push(produto);
  salvarLocal();
  renderProdutos();
}

function removerProduto(i) {
  state.produtos.splice(i,1);
  salvarLocal();
  renderProdutos();
}

function renderProdutos() {
  const lista = document.getElementById("listaProdutosContainer");
  lista.innerHTML = state.produtos.map((p,i)=>`
    <div class="produto-card">
      <img src="${p.imagem}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <button onclick="removerProduto(${i})">❌</button>
    </div>
  `).join("");
}

// =============================
// Clientes
// =============================
function salvarCliente(cliente) {
  state.clientes.push(cliente);
  salvarLocal();
}

// =============================
// Cupons
// =============================
function criarCupom(cupom) {
  state.cupons.push(cupom);
  salvarLocal();
}

// =============================
// Publicidade
// =============================
function salvarPublicidade(pub) {
  state.publicidade = pub;
  salvarLocal();
}

// =============================
// Dados da Loja
// =============================
function salvarDadosLoja(dados) {
  state.loja = { ...state.loja, ...dados };
  salvarLocal();
}

// =============================
// Cobertura
// =============================
function adicionarCobertura(bairro, taxa, tempo) {
  state.cobertura.push({ bairro, taxa, tempo });
  salvarLocal();
}

// =============================
// Customizar
// =============================
function salvarCustomizacao(config) {
  state.loja = { ...state.loja, ...config };
  salvarLocal();
}

// =============================
// Preview
// =============================
function atualizarPreview() {
  const iframe = document.getElementById("previewIframe");
  iframe.srcdoc = gerarTotemHTML();
}

function gerarTotemHTML() {
  return `
    <html>
      <head><title>${state.loja.nome}</title></head>
      <body style="font-family:Arial,sans-serif;">
        <header style="background:${state.loja.corPrimaria};color:#fff;padding:10px;text-align:center;">
          <img src="${state.loja.logo}" style="height:40px;">
          <h1>${state.loja.nome}</h1>
        </header>
        <main>
          <h2>Produtos:</h2>
          <ul>
            ${state.produtos.map(p=>`<li>${p.nome} - R$ ${p.preco}</li>`).join('')}
          </ul>
        </main>
      </body>
    </html>
  `;
}

// =============================
// Navegação entre Abas
// =============================
const tabs = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('#menu li');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.tab;
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    if (target === "dashboard") renderDashboard();
    if (target === "preview") atualizarPreview();
  });
});

// =============================
// Inicialização
// =============================
window.onload = () => {
  carregarLocal();
  renderTudo();
};

// Renderizar tudo ao carregar
function renderTudo() {
  renderCategorias();
  renderProdutos();
  renderDashboard();
}
