let state = {};
let carrinho = [];
let tipoPedido = ""; // Delivery ou Retirar

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
  document.getElementById("lojaNome").innerText = state.loja.nome;
  document.getElementById("lojaLogo").src = state.loja.logo;

  document.getElementById("bannerTexto").innerText = state.publicidade.banner.texto;
  document.getElementById("bannerImg").src = state.publicidade.banner.imagem;
  document.getElementById("bannerLink").href = state.publicidade.banner.link;

  const carrossel = document.getElementById("carrossel");
  carrossel.innerHTML = state.publicidade.carrossel
    .map(img => `<img src="${img}" alt="Carrossel">`).join("");

  const categoriasDiv = document.getElementById("categorias");
  categoriasDiv.innerHTML = state.categorias
    .map(c => `<button class="categoria">${c.nome}</button>`).join("");

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
document.getElementById("btnDelivery").addEventListener("click", ()=>{
  tipoPedido = "Delivery";
  document.getElementById("deliveryCampos").classList.remove("hidden");
  document.getElementById("carrinho").classList.add("show");
});
document.getElementById("btnRetirar").addEventListener("click", ()=>{
  tipoPedido = "Retirar";
  document.getElementById("deliveryCampos").classList.add("hidden");
  document.getElementById("carrinho").classList.add("show");
});
document.getElementById("btnAtendente").addEventListener("click", ()=>{
  window.open(document.getElementById("whatsappLink").href, "_blank");
});
document.getElementById("limparCarrinho").addEventListener("click", ()=> { carrinho=[]; renderCarrinho(); });

// Forma de pagamento (troco se dinheiro)
document.getElementById("formaPagamento").addEventListener("change", e=>{
  if(e.target.value === "Dinheiro") {
    document.getElementById("trocoCampo").classList.remove("hidden");
  } else {
    document.getElementById("trocoCampo").classList.add("hidden");
  }
});

// Enviar pedido para WhatsApp
document.getElementById("enviarPedido").addEventListener("click", ()=>{
  if(carrinho.length === 0) { alert("🛒 Carrinho vazio!"); return; }

  const nome = document.getElementById("clienteNome").value;
  const telefone = document.getElementById("clienteTelefone").value;
  const endereco = document.getElementById("clienteEndereco")?.value || "";
  const bairro = document.getElementById("clienteBairro")?.value || "";
  const cupom = document.getElementById("pedidoCupom").value;
  const pagamento = document.getElementById("formaPagamento").value;
  const troco = document.getElementById("trocoValor").value;

  let resumo = `🛒 *Novo Pedido - ${state.loja.nome}*%0A`;
  resumo += `👤 Cliente: ${nome}%0A📞 Telefone: ${telefone}%0A`;
  if(tipoPedido === "Delivery") {
    resumo += `🏠 Endereço: ${endereco}, Bairro: ${bairro}%0A`;
  } else {
    resumo += `🏪 Retirada no balcão%0A`;
  }
  resumo += `%0A*Itens:*%0A`;
  carrinho.forEach((p,i)=> resumo += `- ${p.nome} - R$ ${p.preco}%0A`);
  if(cupom) resumo += `%0A🎟️ Cupom: ${cupom}`;
  resumo += `%0A💳 Pagamento: ${pagamento}`;
  if(pagamento === "Dinheiro" && troco) resumo += ` (Troco p/ ${troco})`;

  const url = `https://wa.me/${state.loja.telefone}?text=${resumo}`;
  window.open(url, "_blank");
});

// Menu lateral
document.getElementById("abrirMenu").addEventListener("click", ()=> document.getElementById("menuLateral").classList.add("show"));
document.getElementById("fecharMenu").addEventListener("click", ()=> document.getElementById("menuLateral").classList.remove("show"));

// Inicialização
carregarDados();
