// Estado inicial
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

// Alternar abas
const tabs = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('#menu li');
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.tab;
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
document.getElementById('toggleMenu').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// Salvar local
function salvarLocal() {
  localStorage.setItem('painelState', JSON.stringify(state));
  alert("💾 Salvo localmente!");
}

// Carregar local
function carregarLocal() {
  const saved = localStorage.getItem('painelState');
  if(saved) {
    state = JSON.parse(saved);
    atualizarPreview();
  }
}

// Publicar no JSONBin
function publicarTotem() {
  const binId = document.getElementById("jsonbinId").value.trim();
  const masterKey = document.getElementById("masterKey").value.trim();
  if(!binId || !masterKey) { alert("⚠️ Configure JSONBin ID e Master Key"); return; }

  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": masterKey },
    body: JSON.stringify(state)
  }).then(res => res.json())
    .then(() => alert("✅ Publicado com sucesso!"))
    .catch(() => alert("❌ Erro ao publicar."));
}

// Restaurar padrão
function restaurarPadrao() {
  const senha = prompt("Senha para restaurar padrão:");
  if(senha !== "1234"){ alert("❌ Senha incorreta"); return; }
  state = {
    loja: { nome:"", telefone:"", pix:"", banco:"", endereco:"", logo:"", horarios:"",
            corPrimaria:"#3498db", corSecundaria:"#95a5a6", fundo:"", botaoCarrinho:"",
            modoEscuro:false, musicaAmbiente:"" },
    categorias: [], produtos: [], clientes: [], cupons: [],
    publicidade: { banner:{texto:"",imagem:"",link:""}, carrossel:[], redesSociais:{instagram:"",facebook:"",whatsapp:""} },
    cobertura:[]
  };
  salvarLocal();
  atualizarPreview();
}

// Preview
function atualizarPreview(){
  const iframe = document.getElementById('previewIframe');
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
            ${state.produtos.map(p=>`<li>${p.nome} - R$ ${p.preco}</li>`).join('')}
          </ul>
        </main>
      </body>
    </html>
  `;
}

// Categorias
document.getElementById("btnAdicionarCategoria").addEventListener("click", () => {
  const nome = document.getElementById("novaCategoria").value.trim();
  if(nome){
    state.categorias.push({ nome });
    document.getElementById("novaCategoria").value = "";
    renderCategorias();
    salvarLocal();
  }
});

function renderCategorias(){
  document.getElementById("category-tree").innerHTML = state.categorias
    .map(c=>`<div>${c.nome}</div>`).join('');
}

// Produtos
document.getElementById("btnAdicionarProduto").addEventListener("click", () => {
  const nome = document.getElementById("prodNome").value.trim();
  const preco = parseFloat(document.getElementById("prodPreco").value);
  if(nome && !isNaN(preco)){
    state.produtos.push({ nome, preco });
    document.getElementById("prodNome").value = "";
    document.getElementById("prodPreco").value = "";
    renderProdutos();
    salvarLocal();
  }
});

function renderProdutos(){
  document.getElementById("listaProdutosContainer").innerHTML = state.produtos
    .map(p=>`<div>${p.nome} - R$ ${p.preco}</div>`).join('');
}

// Inicialização
window.onload = () => { carregarLocal(); renderCategorias(); renderProdutos(); };
