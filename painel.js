// =============================
// 1️⃣ Estado Inicial
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
// 2️⃣ Sistema de Abas e Sidebar
// =============================
const tabs = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('#menu li');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.tab;
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// Toggle Menu lateral
const sidebar = document.getElementById('sidebar');
document.getElementById('toggleMenu').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// =============================
// 3️⃣ LocalStorage
// =============================
function salvarLocal() {
  localStorage.setItem('painelState', JSON.stringify(state));
  alert("💾 Configurações salvas localmente!");
}
function carregarLocal() {
  const saved = localStorage.getItem('painelState');
  if(saved) {
    state = JSON.parse(saved);
    console.log("🔄 Estado carregado:", state);
    atualizarPreview();
  }
}

// =============================
// 4️⃣ JSONBin Integração
// =============================
function publicarTotem() {
  const binId = document.getElementById("jsonbinId").value.trim();
  const masterKey = document.getElementById("masterKey").value.trim();
  if(!binId || !masterKey) { alert("⚠️ Configure JSONBin ID e Master Key"); return; }

  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": masterKey },
    body: JSON.stringify(state)
  })
  .then(res => res.json())
  .then(json => { alert("✅ Publicado com sucesso!"); console.log(json); })
  .catch(err => alert("❌ Erro ao publicar: " + err));
}

// =============================
// 5️⃣ Restaurar Padrão
// =============================
function restaurarPadrao() {
  const senha = prompt("Digite a senha para restaurar:");
  if(senha !== "1234"){ alert("❌ Senha incorreta"); return; }

  state = {
    loja:{nome:"",telefone:"",pix:"",banco:"",endereco:"",logo:"",horarios:"",corPrimaria:"#3498db",corSecundaria:"#95a5a6",fundo:"",botaoCarrinho:"",modoEscuro:false,musicaAmbiente:""},
    categorias:[], modosVenda:[], produtos:[], clientes:[], cupons:[],
    publicidade:{banner:{texto:"",imagem:"",link:""},carrossel:[],redesSociais:{instagram:"",facebook:"",whatsapp:""}},
    cobertura:[]
  };
  salvarLocal();
  atualizarPreview();
  alert("🔄 Estado restaurado para o padrão.");
}

// =============================
// 6️⃣ Dashboard
// =============================
function renderDashboard() {
  const ctx = document.getElementById("vendasChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Produtos", "Clientes", "Cupons", "Bairros"],
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

// =============================
// 7️⃣ Categorias CRUD
// =============================
function adicionarCategoria() {
  const nome = document.getElementById("novaCategoria").value;
  if(!nome) return;
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
      <ul>${c.subcategorias.map(s=>`<li>${s}</li>`).join("")}</ul>
    </div>
  `).join("");
}

// =============================
// 8️⃣ Modos de Venda CRUD
// =============================
function adicionarModoVenda() {
  const tipo = document.getElementById("selectModoVenda").value;
  const exemplo = document.getElementById("inputModoVendaExemplo").value;
  state.modosVenda.push({ tipo, exemplo });
  salvarLocal();
  renderModosVenda();
}
function renderModosVenda() {
  // aqui você pode listar os modos cadastrados
}

// =============================
// 9️⃣ Produtos CRUD
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
// 🔟 Clientes CRUD
// =============================
function salvarCliente(cliente) {
  state.clientes.push(cliente);
  salvarLocal();
}

// =============================
// 1️⃣1️⃣ Cupons CRUD
// =============================
function criarCupom(cupom) {
  state.cupons.push(cupom);
  salvarLocal();
}

// =============================
// 1️⃣2️⃣ Publicidade
// =============================
function salvarPublicidade(banner,carrossel,redes) {
  state.publicidade.banner = banner;
  state.publicidade.carrossel = carrossel;
  state.publicidade.redesSociais = redes;
  salvarLocal();
}

// =============================
// 1️⃣3️⃣ Dados da Loja
// =============================
function salvarDadosLoja(dados) {
  state.loja = {...state.loja, ...dados};
  salvarLocal();
}

// =============================
// 1️⃣4️⃣ Cobertura
// =============================
function adicionarCobertura(bairro,taxa,tempo) {
  state.cobertura.push({ bairro, taxa, tempo });
  salvarLocal();
}

// =============================
// 1️⃣5️⃣ Customização
// =============================
function salvarCustomizacao(custom) {
  state.loja = {...state.loja, ...custom};
  salvarLocal();
}

// =============================
// 1️⃣6️⃣ Preview em tempo real
// =============================
function atualizarPreview(){
  const iframe = document.getElementById("previewIframe");
  iframe.srcdoc = gerarTotemHTML();
}
function gerarTotemHTML(){
  return `
  <html>
    <head>
      <style>
        body { font-family: Arial; background:${state.loja.fundo || "#fff"}; }
        header { background:${state.loja.corPrimaria};color:#fff;padding:10px;text-align:center; }
        .produto { border:1px solid #ccc; margin:5px; padding:5px; }
      </style>
    </head>
    <body>
      <header>
        <img src="${state.loja.logo}" style="height:40px;">
        <h1>${state.loja.nome}</h1>
      </header>
      <main>
        <h2>Produtos:</h2>
        ${state.produtos.map(p=>`<div class="produto">${p.nome} - R$ ${p.preco.toFixed(2)}</div>`).join("")}
      </main>
    </body>
  </html>
  `;
}

// =============================
// 1️⃣7️⃣ Inicialização
// =============================
window.onload = () => {
  carregarLocal();
  renderDashboard();
  renderCategorias();
  renderProdutos();
};
