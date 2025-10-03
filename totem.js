let state = {};
let carrinho = [];

// Carregar dados do JSONBin pelo ?bin=ID
async function carregarDados() {
  const urlParams = new URLSearchParams(window.location.search);
  const binId = urlParams.get("bin");
  if (!binId) {
    document.getElementById("lojaNome").innerText = "⚠️ Nenhum BinID configurado!";
    return;
  }

  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`);
    const json = await res.json();
    state = json.record;
    preencherDados();
  } catch (err) {
    console.error("Erro ao carregar:", err);
    document.getElementById("lojaNome").innerText = "❌ Erro ao carregar dados!";
  }
}

// Preencher totem
function preencherDados() {
  // Loja
  document.getElementById("lojaNome").innerText = state.loja.nome;
  document.getElementById("lojaLogo").src = state.loja.logo;

  // Banner
  document.getElementById("bannerTexto").innerText = state.publicidade.banner.texto;
  document.getElementById("bannerImg").src = state.publicidade.banner.imagem;
  document.getElementById("bannerLink").href = state.publicidade.banner.link;

  // Carrossel
  const carrossel = document.getElementById("carrossel");
  carrossel.innerHTML = state.publicidade.carrossel
    .map(img => `<img src="${img}" alt="Carrossel">`).join("");

  // Categorias
  const categoriasDiv = document.getElementById("categorias");
  categoriasDiv.innerHTML = state.categorias
    .map(c => `<button class="categoria">${c.nome}</button>`).join("");

  // Produtos
  const produtosDiv = document.getElementById("produtos");
  produtosDiv.innerHTML = state.produtos
    .map((p,i)=>`
      <div class="produto">
        <img src="${p.imagem}" alt="${p.nome}" style="width:80px;">
        <h3>${p.nome}</h3>
        <p>R$ ${p.preco}</p>
        <button onclick="adicionarCarrinho(${i})">➕ Adicionar</button>
      </div>
    `).join("");

  // WhatsApp
  document.getElementById("whatsappLink").href = `https://wa.me/${state.loja.telefone}`;
}

// Carrinho
function adicionarCarrinho(i) {
  carrinho.push(state.produtos[i]);
  renderCarrinho();
}
function renderCarrinho() {
  const div = document.getElementById("itensCarrinho");
  div.innerHTML = carrinho.map((p,i)=>`
    <div>
      ${p.nome} - R$ ${p.preco}
      <button onclick="removerCarrinho(${i})">❌</button>
    </div>
  `).join("");
}
function removerCarrinho(i) {
  carrinho.splice(i,1);
  renderCarrinho();
}

// Mostrar/ocultar carrinho
document.getElementById("btnDelivery").addEventListener("click", ()=> document.getElementById("carrinho").classList.add("show"));
document.getElementById("btnRetirar").addEventListener("click", ()=> document.getElementById("carrinho").classList.add("show"));
document.getElementById("btnAtendente").addEventListener("click", ()=> window.open(document.getElementById("whatsappLink").href, "_blank"));
document.getElementById("limparCarrinho").addEventListener("click", ()=> { carrinho=[]; renderCarrinho(); });

// Menu lateral
document.getElementById("abrirMenu").addEventListener("click", ()=> document.getElementById("menuLateral").classList.add("show"));
document.getElementById("fecharMenu").addEventListener("click", ()=> document.getElementById("menuLateral").classList.remove("show"));

// Inicialização
carregarDados();
