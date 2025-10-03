// =========================
// Estado inicial
// =========================
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

// =========================
// Abas (tabs) e menu
// =========================
const tabs = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('#menu li');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.tab;
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// Toggle menu lateral
const sidebar = document.getElementById('sidebar');
document.getElementById('toggleMenu').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// =========================
// Funções LocalStorage
// =========================
function salvarLocal() {
  localStorage.setItem('painelState', JSON.stringify(state));
  alert("💾 Salvo no dispositivo!");
}
function carregarLocal() {
  const saved = localStorage.getItem('painelState');
  if (saved) {
    state = JSON.parse(saved);
    alert("🔄 Configurações carregadas!");
    atualizarPreview();
    renderDashboard();
    renderCategorias();
    renderProdutos();
  }
}

// =========================
// Dashboard
// =========================
function renderDashboard() {
  const ctx = document.getElementById("vendasChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Produtos", "Clientes", "Cupons", "Cobertura"],
      datasets: [{
        label: "Estatísticas",
        data: [
          state.produtos.length,
          state.clientes.length,
          state.cupons.length,
          state.cobertura.length
        ],
        backgroundColor: ["#3498db","#2ecc71","#e74c3c","#f39c12"]
      }]
    }
  });
}

// =========================
// Categorias
// =========================
function adicionarCategoria() {
  const nome = document.getElementById("novaCategoria").value;
  if (!nome) return;
  state.categorias.push({ nome, subcategorias: [] });
  document.getElementById("novaCategoria").value = "";
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

// =========================
// Modo de Venda
// =========================
function adicionarModoVenda() {
  const tipo = document.getElementById("selectModoVenda").value;
  const exemplo = document.getElementById("inputModoVendaExemplo").value;
  state.modosVenda.push({ tipo, exemplo });
  salvarLocal();
  alert("⚖️ Modo de venda adicionado!");
}

// =========================
// Produtos
// =========================
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

// =========================
// Clientes
// =========================
function salvarCliente(cliente) {
  state.clientes.push(cliente);
  salvarLocal();
  alert("👥 Cliente salvo!");
}

// =========================
// Cupons
// =========================
function criarCupom(cupom) {
  state.cupons.push(cupom);
  salvarLocal();
  alert("🎟️ Cupom criado!");
}

// =========================
// Publicidade
// =========================
function salvarPublicidade(dados) {
  state.publicidade = dados;
  salvarLocal();
  alert("📢 Publicidade salva!");
}

// =========================
// Dados da Loja
// =========================
function salvarDadosLoja(dados) {
  Object.assign(state.loja, dados);
  salvarLocal();
  alert("🗝️ Dados da loja atualizados!");
}

// =========================
// Cobertura
// =========================
function adicionarBairro(bairro, taxa, tempo) {
  state.cobertura.push({ bairro, taxa, tempo });
  salvarLocal();
  alert("🗺️ Bairro adicionado!");
}

// =========================
// Customizar
// =========================
function customizarLoja(config) {
  Object.assign(state.loja, config);
  salvarLocal();
  alert("🎨 Personalização aplicada!");
}

// =========================
// Preview
// =========================
function atualizarPreview(){
  const iframe = document.getElementById("previewIframe");
  iframe.srcdoc = gerarTotemHTML();
}
function gerarTotemHTML(){
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
            ${state.produtos.map(p=>`<li>${p.nome} - R$ ${p.preco.toFixed(2)}</li>`).join('')}
          </ul>
        </main>
      </body>
    </html>
  `;
}

// =========================
// Publicar no JSONBin
// =========================
function publicarTotem() {
  const binId = document.getElementById("jsonbinId").value.trim();
  const masterKey = document.getElementById("masterKey").value.trim();
  if(!binId || !masterKey) { alert("⚠️ Configure JSONBin ID e Master Key"); return; }

  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": masterKey },
    body: JSON.stringify(state)
  }).then(res => res.json())
    .then(()=> alert("✅ Publicado com sucesso!"))
    .catch(()=> alert("❌ Erro ao publicar."));
}

// =========================
// Restaurar padrão
// =========================
function restaurarPadrao() {
  const senha = prompt("Senha para restaurar padrão:");
  if(senha !== "1234"){ alert("❌ Senha incorreta"); return; }
  state = {
    loja: {
      nome:"",telefone:"",pix:"",banco:"",endereco:"",logo:"",horarios:"",
      corPrimaria:"#3498db",corSecundaria:"#95a5a6",fundo:"",botaoCarrinho:"",
      modoEscuro:false,musicaAmbiente:""
    },
    categorias:[], modosVenda:[], produtos:[], clientes:[], cupons:[],
    publicidade:{banner:{texto:"",imagem:"",link:""},carrossel:[],redesSociais:{instagram:"",facebook:"",whatsapp:""}},
    cobertura:[]
  };
  salvarLocal();
  atualizarPreview();
  alert("🔄 Estado restaurado!");
}

// =========================
// Inicialização
// =========================
window.onload = () => {
  carregarLocal();
  renderDashboard();
  renderCategorias();
  renderProdutos();
  atualizarPreview();
  document.getElementById("btnAdicionarCategoria")?.addEventListener("click", adicionarCategoria);
  document.getElementById("btnAdicionarProduto")?.addEventListener("click", adicionarProduto);
};
