// ==========================
// 1️⃣ Estado inicial
// ==========================
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
    banner: { texto: "", imagem: "", link: "" },
    carrossel: [],
    redesSociais: { instagram: "", facebook: "", whatsapp: "" }
  },
  cobertura: []
};

// ==========================
// 2️⃣ Abas (menu lateral)
// ==========================
const tabs = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('#menu li');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.tab;
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// Toggle Sidebar
document.getElementById('toggleMenu').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

// ==========================
// 3️⃣ CRUD Categorias
// ==========================
function renderCategorias() {
  const container = document.getElementById("category-tree");
  container.innerHTML = state.categorias.map((cat, i) =>
    `<div>
      <b>${cat.nome}</b> 
      <button onclick="removerCategoria(${i})">❌</button>
    </div>`
  ).join("");
}
function removerCategoria(i){
  state.categorias.splice(i,1);
  salvarLocal(); renderCategorias();
}
document.getElementById("btnAdicionarCategoria").addEventListener("click", () => {
  const nome = document.getElementById("novaCategoria").value.trim();
  if(nome){
    state.categorias.push({ nome, subcategorias: [] });
    salvarLocal(); renderCategorias();
    document.getElementById("novaCategoria").value = "";
  }
});

// ==========================
// 4️⃣ CRUD Produtos
// ==========================
function renderProdutos(){
  const container = document.getElementById("listaProdutosContainer");
  container.innerHTML = state.produtos.map((p,i) => 
    `<div class="card">
      <img src="${p.imagem}" style="height:50px;">
      <b>${p.nome}</b> - R$ ${p.preco.toFixed(2)}
      <button onclick="removerProduto(${i})">❌</button>
    </div>`
  ).join("");
}
function removerProduto(i){
  state.produtos.splice(i,1);
  salvarLocal(); renderProdutos();
}
document.getElementById("btnAdicionarProduto").addEventListener("click", () => {
  const produto = {
    nome: document.getElementById("prodNome").value,
    preco: parseFloat(document.getElementById("prodPreco").value),
    imagem: document.getElementById("prodImagem").value,
    descricao: document.getElementById("prodDescricao").value,
    ativo: true
  };
  if(produto.nome && produto.preco){
    state.produtos.push(produto);
    salvarLocal(); renderProdutos();
    document.getElementById("prodNome").value = "";
    document.getElementById("prodPreco").value = "";
    document.getElementById("prodImagem").value = "";
    document.getElementById("prodDescricao").value = "";
  }
});

// ==========================
// 5️⃣ CRUD Clientes
// ==========================
function renderClientes(){
  // Exibição simples
  console.log("👥 Clientes:", state.clientes);
}
document.querySelector("#clientes button").addEventListener("click", () => {
  const inputs = document.querySelectorAll("#clientes input, #clientes textarea");
  const cliente = {
    nome: inputs[0].value, telefone: inputs[1].value, endereco: inputs[2].value,
    bairro: inputs[3].value, obs: inputs[4].value, notificacoes: inputs[5].checked
  };
  if(cliente.nome){
    state.clientes.push(cliente);
    salvarLocal(); renderClientes();
    inputs.forEach(i=>i.value="");
  }
});

// ==========================
// 6️⃣ CRUD Cupons
// ==========================
function renderCupons(){
  console.log("🎟️ Cupons:", state.cupons);
}
document.querySelector("#cupons button").addEventListener("click", () => {
  const inputs = document.querySelectorAll("#cupons input, #cupons select, #cupons textarea");
  const cupom = {
    codigo: inputs[0].value, tipo: inputs[1].value, valor: inputs[2].value,
    validade: inputs[3].value, pedidoMin: inputs[4].value,
    limite: inputs[5].value, msg: inputs[6].value, ativo: inputs[7].checked
  };
  if(cupom.codigo){
    state.cupons.push(cupom);
    salvarLocal(); renderCupons();
    inputs.forEach(i=>{ if(i.type!="checkbox") i.value=""; else i.checked=false; });
  }
});

// ==========================
// 7️⃣ CRUD Cobertura
// ==========================
function renderCobertura(){
  console.log("🗺️ Cobertura:", state.cobertura);
}
document.querySelector("#cobertura button").addEventListener("click", () => {
  const inputs = document.querySelectorAll("#cobertura input");
  const bairro = {
    nome: inputs[0].value, taxa: inputs[1].value, tempo: inputs[2].value
  };
  if(bairro.nome){
    state.cobertura.push(bairro);
    salvarLocal(); renderCobertura();
    inputs.forEach(i=>i.value="");
  }
});

// ==========================
// 8️⃣ LocalStorage
// ==========================
function salvarLocal() {
  localStorage.setItem('painelState', JSON.stringify(state));
}
function carregarLocal() {
  const saved = localStorage.getItem('painelState');
  if(saved) {
    state = JSON.parse(saved);
    renderCategorias(); renderProdutos();
    renderClientes(); renderCupons(); renderCobertura();
  }
}

// ==========================
// 9️⃣ JSONBin
// ==========================
function publicarTotem() {
  const binId = document.getElementById("jsonbinId").value.trim();
  const masterKey = document.getElementById("masterKey").value.trim();
  if(!binId || !masterKey){ alert("⚠️ Configure JSONBin ID e Master Key"); return; }

  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": masterKey },
    body: JSON.stringify(state)
  }).then(r=>r.json()).then(j=>{
    alert("✅ Publicado no Totem!");
    console.log(j);
  }).catch(()=>alert("❌ Erro ao publicar!"));
}

// ==========================
// 🔟 Restaurar Padrão
// ==========================
function restaurarPadrao(){
  const senha = prompt("Senha para restaurar padrão:");
  if(senha!=="1234"){ alert("❌ Senha incorreta"); return; }
  localStorage.removeItem("painelState");
  state = { ...JSON.parse(JSON.stringify(state)) }; // reinicia
  location.reload();
}

// ==========================
// 1️⃣1️⃣ Preview em tempo real
// ==========================
function atualizarPreview(){
  const iframe = document.getElementById("previewIframe");
  if(iframe) iframe.srcdoc = gerarTotemHTML();
}
function gerarTotemHTML(){
  return `
    <html>
    <head><title>${state.loja.nome}</title></head>
    <body style="font-family:Arial;">
      <header style="background:${state.loja.corPrimaria};color:#fff;padding:10px;">
        <img src="${state.loja.logo}" style="height:40px;"> <b>${state.loja.nome}</b>
      </header>
      <h3>Produtos</h3>
      <ul>${state.produtos.map(p=>`<li>${p.nome} - R$${p.preco}</li>`).join("")}</ul>
    </body></html>
  `;
}

// ==========================
// 1️⃣2️⃣ Inicialização
// ==========================
window.onload = () => {
  carregarLocal();
  renderCategorias(); renderProdutos();
  renderClientes(); renderCupons(); renderCobertura();
  atualizarPreview();
};
