// =========================
// 1️⃣ Estado inicial
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
    banner: { texto: "", imagem: "", link: "" },
    carrossel: [],
    redesSociais: { instagram: "", facebook: "", whatsapp: "" }
  },
  cobertura: []
};

// =========================
// 2️⃣ Controle de Abas
// =========================
const tabs = document.querySelectorAll(".tab");
const menuItems = document.querySelectorAll("#menu li");
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const target = item.dataset.tab;
    tabs.forEach(tab => tab.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// =========================
// 3️⃣ Toggle Menu lateral
// =========================
const sidebar = document.getElementById("sidebar");
document.getElementById("toggleMenu").addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// =========================
// 4️⃣ LocalStorage
// =========================
function salvarLocal() {
  localStorage.setItem("painelState", JSON.stringify(state));
  alert("💾 Salvo localmente!");
}
function carregarLocal() {
  const saved = localStorage.getItem("painelState");
  if (saved) {
    state = JSON.parse(saved);
    renderTudo();
  }
}

// =========================
// 5️⃣ Publicar no JSONBin
// =========================
function publicarTotem() {
  const binId = document.getElementById("jsonbinId").value.trim();
  const masterKey = document.getElementById("masterKey").value.trim();
  if (!binId || !masterKey) {
    alert("⚠️ Configure JSONBin ID e Master Key");
    return;
  }
  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": masterKey },
    body: JSON.stringify(state)
  })
    .then(res => res.json())
    .then(json => alert("✅ Publicado com sucesso!"))
    .catch(err => alert("❌ Erro ao publicar."));
}

// =========================
// 6️⃣ Restaurar padrão
// =========================
function restaurarPadrao() {
  const senha = prompt("Digite a senha para restaurar:");
  if (senha !== "1234") {
    alert("❌ Senha incorreta");
    return;
  }
  state = {
    loja: {
      nome: "", telefone: "", pix: "", banco: "",
      endereco: "", logo: "", horarios: "",
      corPrimaria: "#3498db", corSecundaria: "#95a5a6",
      fundo: "", botaoCarrinho: "", modoEscuro: false, musicaAmbiente: ""
    },
    categorias: [], modosVenda: [], produtos: [], clientes: [],
    cupons: [], publicidade: { banner: { texto: "", imagem: "", link: "" }, carrossel: [], redesSociais: { instagram: "", facebook: "", whatsapp: "" } },
    cobertura: []
  };
  salvarLocal();
  renderTudo();
  alert("🔄 Padrão restaurado!");
}

// =========================
// 7️⃣ Exportar / Importar
// =========================
function exportarJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "painelState.json";
  a.click();
  URL.revokeObjectURL(url);
}
function importarJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    state = JSON.parse(e.target.result);
    salvarLocal();
    renderTudo();
  };
  reader.readAsText(file);
}

// =========================
// 8️⃣ CRUD Categorias
// =========================
function renderCategorias() {
  const c = document.getElementById("category-tree");
  c.innerHTML = state.categorias.map((cat, i) =>
    `<div class="item">
      <input type="text" value="${cat.nome}" onchange="editarCategoria(${i}, this.value)">
      <button onclick="removerCategoria(${i})">❌</button>
    </div>`).join("");
}
function adicionarCategoria() {
  const nome = document.getElementById("novaCategoria").value.trim();
  if (nome) {
    state.categorias.push({ nome, subcategorias: [] });
    salvarLocal(); renderCategorias();
    document.getElementById("novaCategoria").value = "";
  }
}
function editarCategoria(i, v) { state.categorias[i].nome = v; salvarLocal(); }
function removerCategoria(i) { state.categorias.splice(i, 1); salvarLocal(); renderCategorias(); }
document.getElementById("btnAdicionarCategoria").addEventListener("click", adicionarCategoria);

// =========================
// 9️⃣ CRUD Modos de Venda
// =========================
function renderModos() {
  const s = document.getElementById("listaModosVenda");
  if (!s) return;
  s.innerHTML = state.modosVenda.map((m, i) =>
    `<div class="item">
      <input type="text" value="${m}" onchange="editarModo(${i}, this.value)">
      <button onclick="removerModo(${i})">❌</button>
    </div>`).join("");
}
function adicionarModo() {
  const modo = document.getElementById("selectModoVenda").value;
  const ex = document.getElementById("inputModoVendaExemplo").value;
  if (modo) {
    state.modosVenda.push(modo + (ex ? " (" + ex + ")" : ""));
    salvarLocal(); renderModos();
    document.getElementById("inputModoVendaExemplo").value = "";
  }
}
function editarModo(i, v) { state.modosVenda[i] = v; salvarLocal(); }
function removerModo(i) { state.modosVenda.splice(i, 1); salvarLocal(); renderModos(); }

// =========================
// 🔟 CRUD Produtos
// =========================
function renderProdutos() {
  const c = document.getElementById("listaProdutosContainer");
  c.innerHTML = state.produtos.map((p, i) =>
    `<div class="item">
      <input type="text" value="${p.nome}" onchange="editarProduto(${i}, 'nome', this.value)">
      <input type="number" value="${p.preco}" onchange="editarProduto(${i}, 'preco', this.value)">
      <img src="${p.imagem}" style="height:40px;">
      <button onclick="removerProduto(${i})">❌</button>
    </div>`).join("");
}
function adicionarProduto() {
  const p = {
    nome: document.getElementById("prodNome").value,
    preco: parseFloat(document.getElementById("prodPreco").value),
    imagem: document.getElementById("prodImagem").value,
    descricao: document.getElementById("prodDescricao").value,
    estoque: document.getElementById("prodEstoque").value,
    destaque: document.getElementById("prodDestaque").checked,
    ativo: document.getElementById("prodAtivo").checked
  };
  if (p.nome && p.preco) {
    state.produtos.push(p);
    salvarLocal(); renderProdutos();
    document.querySelectorAll("#produtos input, #produtos textarea").forEach(el => {
      if (el.type === "checkbox") el.checked = false; else el.value = "";
    });
  }
}
function editarProduto(i, campo, v) { state.produtos[i][campo] = v; salvarLocal(); }
function removerProduto(i) { state.produtos.splice(i, 1); salvarLocal(); renderProdutos(); }
document.getElementById("btnAdicionarProduto").addEventListener("click", adicionarProduto);

// =========================
// 1️⃣1️⃣ CRUD Clientes
// =========================
function renderClientes() {
  const c = document.getElementById("listaClientes");
  if (!c) return;
  c.innerHTML = state.clientes.map((cli, i) =>
    `<div class="item">
      <input type="text" value="${cli.nome}" onchange="editarCliente(${i}, 'nome', this.value)">
      <input type="text" value="${cli.telefone}" onchange="editarCliente(${i}, 'telefone', this.value)">
      <button onclick="removerCliente(${i})">❌</button>
    </div>`).join("");
}
function adicionarCliente() {
  const c = {
    nome: document.querySelector("#clientes input[placeholder='Nome']").value,
    telefone: document.querySelector("#clientes input[placeholder='Telefone']").value,
    endereco: document.querySelector("#clientes input[placeholder='Endereço']").value,
    bairro: document.querySelector("#clientes input[placeholder='Bairro']").value,
    obs: document.querySelector("#clientes textarea").value,
    notificacoes: document.querySelector("#clientes input[type='checkbox']").checked
  };
  if (c.nome) {
    state.clientes.push(c); salvarLocal(); renderClientes();
    document.querySelectorAll("#clientes input, #clientes textarea").forEach(el => {
      if (el.type === "checkbox") el.checked = false; else el.value = "";
    });
  }
}
function editarCliente(i, campo, v) { state.clientes[i][campo] = v; salvarLocal(); }
function removerCliente(i) { state.clientes.splice(i, 1); salvarLocal(); renderClientes(); }

// =========================
// 1️⃣2️⃣ CRUD Cupons
// =========================
function renderCupons() {
  const c = document.getElementById("listaCupons");
  if (!c) return;
  c.innerHTML = state.cupons.map((cup, i) =>
    `<div class="item">
      <input type="text" value="${cup.codigo}" onchange="editarCupom(${i}, 'codigo', this.value)">
      <input type="number" value="${cup.valor}" onchange="editarCupom(${i}, 'valor', this.value)">
      <button onclick="removerCupom(${i})">❌</button>
    </div>`).join("");
}
function adicionarCupom() {
  const c = {
    codigo: document.querySelector("#cupons input[placeholder='Código']").value,
    tipo: document.querySelector("#cupons select").value,
    valor: document.querySelector("#cupons input[placeholder='Valor']").value,
    validade: document.querySelector("#cupons input[placeholder='Validade']").value,
    pedidoMin: document.querySelector("#cupons input[placeholder='Pedido Mínimo']").value,
    limite: document.querySelector("#cupons input[placeholder='Limite de Uso']").value,
    msg: document.querySelector("#cupons textarea").value,
    ativo: document.querySelector("#cupons input[type='checkbox']").checked
  };
  if (c.codigo) {
    state.cupons.push(c); salvarLocal(); renderCupons();
    document.querySelectorAll("#cupons input, #cupons textarea").forEach(el => {
      if (el.type === "checkbox") el.checked = false; else el.value = "";
    });
  }
}
function editarCupom(i, campo, v) { state.cupons[i][campo] = v; salvarLocal(); }
function removerCupom(i) { state.cupons.splice(i, 1); salvarLocal(); renderCupons(); }

// =========================
// 1️⃣3️⃣ CRUD Publicidade
// =========================
function renderPublicidade() {
  const c = document.getElementById("listaPublicidade");
  if (!c) return;
  c.innerHTML = `
    <p>Banner: ${state.publicidade.banner.texto}</p>
    <p>Carrossel: ${state.publicidade.carrossel.join(", ")}</p>
    <p>Instagram: ${state.publicidade.redesSociais.instagram}</p>
  `;
}
function salvarPublicidade() {
  state.publicidade.banner.texto = document.querySelector("#publicidade input[placeholder='Texto do Banner']").value;
  state.publicidade.banner.imagem = document.querySelector("#publicidade input[placeholder='URL Imagem Banner']").value;
  state.publicidade.banner.link = document.querySelector("#publicidade input[placeholder='Link do Banner']").value;
  state.publicidade.carrossel = document.querySelector("#publicidade textarea").value.split("\n");
  state.publicidade.redesSociais.instagram = document.querySelector("#publicidade input[placeholder='Instagram']").value;
  state.publicidade.redesSociais.facebook = document.querySelector("#publicidade input[placeholder='Facebook']").value;
  state.publicidade.redesSociais.whatsapp = document.querySelector("#publicidade input[placeholder='WhatsApp']").value;
  salvarLocal(); renderPublicidade();
}

// =========================
// 1️⃣4️⃣ CRUD Dados da Loja
// =========================
function salvarDadosLoja() {
  const sec = document.querySelector("#dados-loja");
  const inputs = sec.querySelectorAll("input, textarea");
  state.loja.nome = inputs[0].value;
  state.loja.telefone = inputs[1].value;
  state.loja.pix = inputs[2].value;
  state.loja.banco = inputs[3].value;
  state.loja.endereco = inputs[4].value;
  state.loja.logo = inputs[5].value;
  state.loja.horarios = inputs[6].value;
  salvarLocal();
}

// =========================
// 1️⃣5️⃣ CRUD Cobertura
// =========================
function renderCobertura() {
  const c = document.getElementById("listaCobertura");
  if (!c) return;
  c.innerHTML = state.cobertura.map((b, i) =>
    `<div class="item">
      <input type="text" value="${b.bairro}" onchange="editarCobertura(${i}, 'bairro', this.value)">
      <input type="number" value="${b.taxa}" onchange="editarCobertura(${i}, 'taxa', this.value)">
      <button onclick="removerCobertura(${i})">❌</button>
    </div>`).join("");
}
function adicionarCobertura() {
  const c = {
    bairro: document.querySelector("#cobertura input[placeholder='Bairro']").value,
    taxa: document.querySelector("#cobertura input[placeholder='Taxa de Entrega']").value,
    tempo: document.querySelector("#cobertura input[placeholder='Tempo Estimado (min)']").value
  };
  if (c.bairro) {
    state.cobertura.push(c); salvarLocal(); renderCobertura();
    document.querySelectorAll("#cobertura input").forEach(el => el.value = "");
  }
}
function editarCobertura(i, campo, v) { state.cobertura[i][campo] = v; salvarLocal(); }
function removerCobertura(i) { state.cobertura.splice(i, 1); salvarLocal(); renderCobertura(); }

// =========================
// 1️⃣6️⃣ Customizar
// =========================
function salvarCustomizacao() {
  state.loja.corPrimaria = document.getElementById("corPrimaria").value;
  state.loja.corSecundaria = document.getElementById("corSecundaria").value;
  state.loja.fundo = document.getElementById("fundo").value;
  state.loja.botaoCarrinho = document.getElementById("botaoCarrinho").value;
  state.loja.modoEscuro = document.getElementById("modoEscuro").checked;
  state.loja.musicaAmbiente = document.getElementById("musicaAmbiente").value;
  salvarLocal();
}

// =========================
// 1️⃣7️⃣ Renderizador Geral
// =========================
function renderTudo() {
  renderCategorias();
  renderModos();
  renderProdutos();
  renderClientes();
  renderCupons();
  renderPublicidade();
  renderCobertura();
  atualizarPreview();
}

// =========================
// 1️⃣8️⃣ Preview em Tempo Real
// =========================
function atualizarPreview() {
  const iframe = document.getElementById("previewIframe");
  if (!iframe) return;
  iframe.srcdoc = gerarTotemHTML();
}
function gerarTotemHTML() {
  return `
    <html>
    <head><title>${state.loja.nome}</title></head>
    <body style="font-family:Arial;">
      <header style="background:${state.loja.corPrimaria};color:#fff;padding:10px;text-align:center;">
        <img src="${state.loja.logo}" style="height:40px;">
        <h1>${state.loja.nome}</h1>
      </header>
      <main>
        <h2>Produtos:</h2>
        <ul>${state.produtos.map(p => `<li>${p.nome} - R$${p.preco}</li>`).join("")}</ul>
      </main>
    </body>
    </html>`;
}

// =========================
// 🚀 Inicialização
// =========================
window.onload = () => {
  carregarLocal();
  renderTudo();
};
