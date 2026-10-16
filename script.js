/* =========================================================
   PlayLog - JavaScript da Fase 2
   Depende de: bootstrap.bundle.min.js e dados.js (nessa ordem)
   Textos sem acento, como no restante do site.
   ========================================================= */
"use strict";

var CHAVE_USUARIO = "playlog_usuario";
var CHAVE_LISTAS = "playlog_listas";
var CHAVE_REGISTROS = "playlog_registros";

var ICONES_LISTA = {
  "favoritos": '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M12 20 C6 15 3 11.5 3 8 a4.5 4.5 0 0 1 9 -1.5 A4.5 4.5 0 0 1 21 8 c0 3.5 -3 7 -9 12 Z" fill="var(--color-purple)"/></svg>',
  "quero-jogar": '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M6 3 h12 v18 l-6 -4 -6 4 Z" fill="var(--color-purple)"/></svg>',
  "zerados": '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="var(--color-purple)"/><path d="M8 12 l3 3 5 -6" fill="none" stroke="var(--color-ink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  "personalizada": '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><rect x="4" y="5" width="16" height="3" rx="1" fill="var(--color-purple)"/><rect x="4" y="10.5" width="16" height="3" rx="1" fill="var(--color-purple)"/><rect x="4" y="16" width="16" height="3" rx="1" fill="var(--color-purple)"/></svg>'
};

/* ---------- utilitarios ---------- */

function lerArmazenado(chave, padrao) {
  try {
    var texto = window.localStorage.getItem(chave);
    return texto ? JSON.parse(texto) : padrao;
  } catch (erro) {
    return padrao;
  }
}

function salvarArmazenado(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    return false;
  }
}

function textoNota(jogo) {
  return jogo.nota === null || jogo.nota === undefined ? "Sem nota" : "&#9733; " + jogo.nota.toFixed(1);
}

function escaparHtml(texto) {
  return String(texto).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function normalizar(texto) {
  return String(texto).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function buscarJogo(id) {
  return jogos.find(function (j) { return j.id === id; });
}

function nomeDoGenero(id) {
  var g = generos.find(function (x) { return x.id === id; });
  return g ? g.nome : id;
}

function estrelas(qtd) {
  return "★".repeat(qtd) + "☆".repeat(5 - qtd);
}

/* ---------- feedback: toast ---------- */

function mostrarToast(mensagem, tipo) {
  var area = document.getElementById("areaToast");
  if (!area) {
    area = document.createElement("div");
    area.id = "areaToast";
    area.className = "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(area);
  }
  var el = document.createElement("div");
  el.className = "toast align-items-center border-0 toast-" + (tipo || "sucesso");
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.innerHTML = '<div class="d-flex"><div class="toast-body">' + escaparHtml(mensagem) +
    '</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button></div>';
  area.appendChild(el);
  el.addEventListener("hidden.bs.toast", function () { el.remove(); });
  new bootstrap.Toast(el, { delay: 3500 }).show();
}

/* ---------- usuario, saudacao e estatisticas ---------- */

function obterUsuario() {
  return lerArmazenado(CHAVE_USUARIO, { nome: "Jogador123" });
}

function obterSaudacao(data) {
  var hora = (data || new Date()).getHours();
  if (hora < 5) { return "Boa madrugada"; }
  if (hora < 12) { return "Bom dia"; }
  if (hora < 18) { return "Boa tarde"; }
  return "Boa noite";
}

function aplicarUsuario() {
  var usuario = obterUsuario();
  document.querySelectorAll("[data-usuario]").forEach(function (el) { el.textContent = usuario.nome; });
  document.querySelectorAll("[data-saudacao]").forEach(function (el) { el.textContent = obterSaudacao() + ","; });
}

function copiaProfunda(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function obterListas() {
  return lerArmazenado(CHAVE_LISTAS, copiaProfunda(listasPadrao));
}

function obterRegistros() {
  return lerArmazenado(CHAVE_REGISTROS, []);
}

function calcularEstatisticas() {
  var registros = obterRegistros();
  var personalizadas = obterListas().filter(function (l) { return !l.padrao; }).length;
  return {
    jogados: 18 + registros.length,
    queroJogar: 7,
    reviews: 12 + registros.filter(function (r) { return r.comentario; }).length,
    listas: 5 + personalizadas
  };
}

function atualizarEstatisticas() {
  var e = calcularEstatisticas();
  document.querySelectorAll("[data-stat]").forEach(function (el) {
    if (e[el.dataset.stat] !== undefined) { el.textContent = e[el.dataset.stat]; }
  });
}

/* ---------- listas ---------- */

function capasDaLista(lista) {
  var ids = lista.adicionados.slice().reverse().concat(lista.capas);
  return ids.filter(function (id, i) { return ids.indexOf(id) === i; }).slice(0, 4);
}

function adicionarJogoNaLista(idLista, idJogo) {
  var todas = obterListas();
  var lista = todas.find(function (l) { return l.id === idLista; });
  if (!lista || lista.adicionados.indexOf(idJogo) !== -1) { return false; }
  lista.adicionados.push(idJogo);
  lista.qtd += 1;
  salvarArmazenado(CHAVE_LISTAS, todas);
  return true;
}

/* ---------- cards de jogo e modais ---------- */

function criarCardJogo(jogo) {
  var tags = jogo.tags.map(function (t) { return "<span>" + escaparHtml(t) + "</span>"; }).join("");
  return '<div class="col"><article class="game-card card" data-detalhes="' + jogo.id + '" role="button" tabindex="0">' +
    '<img src="' + jogo.capa + '" alt="Capa do jogo ' + escaparHtml(jogo.titulo) + '">' +
    "<h3>" + escaparHtml(jogo.titulo) + '</h3><p class="rating">' + textoNota(jogo) + "</p>" +
    '<div class="game-tags">' + tags + "</div></article></div>";
}

function criarModal(id, titulo, corpo, rodape) {
  var existente = document.getElementById(id);
  if (existente) { return existente; }
  var el = document.createElement("div");
  el.className = "modal fade";
  el.id = id;
  el.tabIndex = -1;
  el.setAttribute("aria-labelledby", id + "Titulo");
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"><div class="modal-content">' +
    '<div class="modal-header"><h2 class="modal-title" id="' + id + 'Titulo">' + titulo + "</h2>" +
    '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button></div>' +
    '<div class="modal-body">' + corpo + "</div>" +
    (rodape ? '<div class="modal-footer">' + rodape + "</div>" : "") +
    "</div></div>";
  document.body.appendChild(el);
  return el;
}

function abrirDetalhesJogo(id) {
  var jogo = buscarJogo(id);
  if (!jogo) { return; }
  var el = criarModal("modalJogo", "Detalhes do jogo", '<div id="modalJogoCorpo"></div>',
    '<button type="button" class="cta-button btn" data-bs-dismiss="modal">Fechar</button>' +
    '<button type="button" class="cta-button cta-solid btn" id="modalJogoAdicionar">Registrar jogo</button>');
  document.getElementById("modalJogoCorpo").innerHTML =
    '<div class="row g-3"><div class="col-5"><img src="' + jogo.capa + '" class="modal-capa" alt="Capa do jogo ' + escaparHtml(jogo.titulo) + '"></div>' +
    '<div class="col-7"><h3>' + escaparHtml(jogo.titulo) + '</h3><p class="rating">' + textoNota(jogo) + "</p>" +
    '<div class="game-tags">' + jogo.tags.map(function (t) { return "<span>" + escaparHtml(t) + "</span>"; }).join("") + "</div></div></div>" +
    '<table class="game-table mt-3"><caption class="visually-hidden">Ficha tecnica</caption><tbody>' +
    '<tr><th scope="row">Desenvolvedora</th><td>' + escaparHtml(jogo.desenvolvedora) + "</td></tr>" +
    '<tr><th scope="row">Ano</th><td>' + (jogo.ano || "Em breve") + "</td></tr>" +
    '<tr><th scope="row">Pais</th><td>' + escaparHtml(jogo.pais) + "</td></tr>" +
    '<tr><th scope="row">Plataformas</th><td>' + escaparHtml(jogo.plataformas) + "</td></tr></tbody></table>";
  document.getElementById("modalJogoAdicionar").onclick = function () {
    bootstrap.Modal.getOrCreateInstance(el).hide();
    abrirRegistrarJogo(jogo.id);
  };
  bootstrap.Modal.getOrCreateInstance(el).show();
}

function confirmarAcao(mensagem, aoConfirmar) {
  var el = criarModal("modalConfirmar", "Confirmar acao", '<p id="modalConfirmarTexto"></p>',
    '<button type="button" class="cta-button btn" data-bs-dismiss="modal">Cancelar</button>' +
    '<button type="button" class="btn btn-perigo" id="modalConfirmarOk">Confirmar</button>');
  document.getElementById("modalConfirmarTexto").textContent = mensagem;
  document.getElementById("modalConfirmarOk").onclick = function () {
    bootstrap.Modal.getOrCreateInstance(el).hide();
    aoConfirmar();
  };
  bootstrap.Modal.getOrCreateInstance(el).show();
}

/* ---------- validacao de formularios ---------- */

function mensagemDeErro(campo) {
  var v = campo.validity;
  var rotulo = campo.dataset.rotulo || "Este campo";
  var curto = campo.minLength > 0 && campo.value.length > 0 && campo.value.length < campo.minLength;
  if (v.valueMissing) { return campo.type === "checkbox" ? "Voce precisa aceitar para continuar." : rotulo + " e obrigatorio."; }
  if (v.customError) { return campo.validationMessage; }
  if (v.typeMismatch) { return "Informe um valor valido para " + rotulo.toLowerCase() + "."; }
  if (v.tooShort || curto) { return rotulo + " deve ter no minimo " + campo.minLength + " caracteres."; }
  if (v.tooLong) { return rotulo + " deve ter no maximo " + campo.maxLength + " caracteres."; }
  if (v.patternMismatch) { return campo.title || rotulo + " esta em um formato invalido."; }
  return "Valor invalido.";
}

function avaliarCampo(campo) {
  /* garante o tamanho minimo mesmo com valor preenchido por script ou autofill */
  var curto = campo.minLength > 0 && campo.value.length > 0 && campo.value.length < campo.minLength;
  var ok = campo.checkValidity() && !curto;
  var bloco = campo.closest(".form-field") || campo.parentElement;
  var msg = bloco.querySelector(".invalid-feedback");
  /* campo opcional e vazio: sem destaque de valido/invalido */
  var neutro = ok && !campo.required && campo.value === "";
  campo.classList.toggle("is-valid", ok && !neutro);
  campo.classList.toggle("is-invalid", !ok);
  if (msg) {
    msg.textContent = ok ? "" : mensagemDeErro(campo);
    msg.style.display = ok ? "" : "block";
  }
  return ok;
}

function validarFormulario(form) {
  var primeiroInvalido = null;
  form.querySelectorAll("input, select, textarea").forEach(function (campo) {
    if (campo.type === "hidden" || campo.type === "range") { return; }
    if (!avaliarCampo(campo) && !primeiroInvalido) { primeiroInvalido = campo; }
  });
  if (primeiroInvalido) { primeiroInvalido.focus(); }
  return !primeiroInvalido;
}

function configurarValidacao(form, extra) {
  form.setAttribute("novalidate", "novalidate");
  form.querySelectorAll("input, select, textarea").forEach(function (campo) {
    if (campo.type === "range") { return; }
    var evento = (campo.type === "checkbox" || campo.tagName === "SELECT") ? "change" : "input";
    campo.addEventListener(evento, function () {
      if (extra) { extra(campo); }
      if (campo.value || campo.type === "checkbox" || campo.classList.contains("is-invalid")) { avaliarCampo(campo); }
    });
    campo.addEventListener("blur", function () {
      if (campo.value || campo.classList.contains("is-invalid")) { avaliarCampo(campo); }
    });
  });
}

function limparValidacao(form) {
  form.reset();
  form.querySelectorAll(".is-valid, .is-invalid").forEach(function (c) { c.classList.remove("is-valid", "is-invalid"); });
}

/* ---------- registrar jogo (modal com formulario) ---------- */

function abrirRegistrarJogo(idJogo) {
  var opcoesJogos = jogos.map(function (j) { return '<option value="' + j.id + '">' + escaparHtml(j.titulo) + "</option>"; }).join("");
  var opcoesListas = obterListas().map(function (l) { return '<option value="' + l.id + '">' + escaparHtml(l.nome) + "</option>"; }).join("");
  var el = criarModal("modalRegistro", "Registrar jogo",
    '<form id="formRegistro" class="form-modal" novalidate>' +
    '<div class="form-field"><label for="regJogo">Jogo</label>' +
    '<select class="form-select" id="regJogo" required data-rotulo="O jogo"><option value="">Selecione...</option>' + opcoesJogos + "</select>" +
    '<div class="invalid-feedback"></div></div>' +
    '<div class="form-field"><label for="regLista">Adicionar a lista</label>' +
    '<select class="form-select" id="regLista" required data-rotulo="A lista"><option value="">Selecione...</option>' + opcoesListas + "</select>" +
    '<div class="invalid-feedback"></div></div>' +
    '<div class="form-field"><label for="regNota">Sua nota: <output id="regNotaValor">3</output> de 5</label>' +
    '<input type="range" class="form-range" id="regNota" min="1" max="5" step="1" value="3"></div>' +
    '<div class="form-field"><label for="regComentario">Comentario (opcional)</label>' +
    '<textarea class="form-control" id="regComentario" rows="3" maxlength="200" data-rotulo="O comentario"></textarea>' +
    '<div class="form-text"><span id="regContador">0</span>/200 caracteres</div><div class="invalid-feedback"></div></div>' +
    '<div class="modal-acoes"><button type="button" class="cta-button btn" data-bs-dismiss="modal">Cancelar</button>' +
    '<button type="submit" class="cta-button cta-solid btn">Salvar</button></div></form>');
  var form = document.getElementById("formRegistro");
  if (!form.dataset.pronto) {
    form.dataset.pronto = "1";
    configurarValidacao(form);
    document.getElementById("regNota").addEventListener("input", function (e) { document.getElementById("regNotaValor").textContent = e.target.value; });
    document.getElementById("regComentario").addEventListener("input", function (e) { document.getElementById("regContador").textContent = e.target.value.length; });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validarFormulario(form)) { return; }
      var registro = {
        jogo: document.getElementById("regJogo").value,
        lista: document.getElementById("regLista").value,
        nota: Number(document.getElementById("regNota").value),
        comentario: document.getElementById("regComentario").value.trim()
      };
      var registros = obterRegistros();
      registros.push(registro);
      salvarArmazenado(CHAVE_REGISTROS, registros);
      var novo = adicionarJogoNaLista(registro.lista, registro.jogo);
      bootstrap.Modal.getOrCreateInstance(el).hide();
      limparValidacao(form);
      document.getElementById("regNotaValor").textContent = "3";
      document.getElementById("regContador").textContent = "0";
      atualizarEstatisticas();
      mostrarToast(novo ? "Jogo registrado e adicionado a lista!" : "Jogo registrado! Ele ja estava nessa lista.");
      if (document.getElementById("listasUsuario")) { renderizarListas(); }
      if (document.getElementById("perfilReviews")) { iniciarPerfil(); }
    });
  }
  /* as listas podem ter mudado desde a ultima abertura */
  document.getElementById("regLista").innerHTML = '<option value="">Selecione...</option>' + opcoesListas;
  if (idJogo) { document.getElementById("regJogo").value = idJogo; }
  bootstrap.Modal.getOrCreateInstance(el).show();
}

/* ---------- jogos: busca, filtro por genero, ordenacao ---------- */

function filtrarJogos(lista, genero, busca) {
  var termo = normalizar(busca || "");
  return lista.filter(function (j) {
    var noGenero = genero === "todos" || j.generos.indexOf(genero) !== -1;
    var texto = normalizar([j.titulo, j.desenvolvedora, j.tags.join(" ")].join(" "));
    return noGenero && (!termo || texto.indexOf(termo) !== -1);
  });
}

function ordenarJogos(lista, criterio) {
  var copia = lista.slice();
  if (criterio === "nota") { copia.sort(function (a, b) { return (b.nota || 0) - (a.nota || 0); }); }
  else if (criterio === "ano") { copia.sort(function (a, b) { return (b.ano || 0) - (a.ano || 0); }); }
  else if (criterio === "titulo") { copia.sort(function (a, b) { return a.titulo.localeCompare(b.titulo, "pt-BR"); }); }
  else { copia.sort(function (a, b) { return jogos.indexOf(a) - jogos.indexOf(b); }); }
  return copia;
}

function iniciarCatalogo() {
  var area = document.getElementById("catalogo");
  if (!area) { return; }
  var estado = { genero: "todos", busca: "", ordem: "padrao" };
  var tabela = document.querySelector("#tabelaJogos tbody");
  var campoBusca = document.getElementById("buscaCatalogo");
  var contador = document.getElementById("contadorCatalogo");
  var vazio = document.getElementById("vazioCatalogo");
  var rotuloOrdem = document.getElementById("rotuloOrdem");
  var nomesOrdem = { padrao: "Filtros", titulo: "Titulo (A-Z)", nota: "Melhor nota", ano: "Mais recentes" };

  function renderizar() {
    var visiveis = ordenarJogos(filtrarJogos(jogos, estado.genero, estado.busca), estado.ordem);
    var ids = visiveis.map(function (j) { return j.id; });
    /* reordena os elementos existentes: primeiro os visiveis, na ordem escolhida */
    visiveis.forEach(function (j) {
      var card = area.querySelector('[data-id="' + j.id + '"]');
      if (card) { card.hidden = false; area.appendChild(card); }
      var linha = tabela && tabela.querySelector('[data-id="' + j.id + '"]');
      if (linha) { linha.hidden = false; tabela.appendChild(linha); }
    });
    area.querySelectorAll("[data-id]").forEach(function (c) { if (ids.indexOf(c.dataset.id) === -1) { c.hidden = true; } });
    if (tabela) { tabela.querySelectorAll("[data-id]").forEach(function (c) { if (ids.indexOf(c.dataset.id) === -1) { c.hidden = true; } }); }
    contador.textContent = visiveis.length + (visiveis.length === 1 ? " jogo encontrado" : " jogos encontrados");
    vazio.hidden = visiveis.length > 0;
    rotuloOrdem.textContent = nomesOrdem[estado.ordem];
  }

  document.querySelectorAll("[data-genre]").forEach(function (aba) {
    aba.addEventListener("click", function () {
      estado.genero = aba.dataset.genre;
      document.querySelectorAll("[data-genre]").forEach(function (b) {
        b.classList.toggle("active", b === aba);
        b.setAttribute("aria-selected", b === aba);
      });
      renderizar();
    });
  });
  campoBusca.addEventListener("input", function () { estado.busca = campoBusca.value; renderizar(); });
  document.querySelectorAll("[data-ordem]").forEach(function (item) {
    item.addEventListener("click", function () { estado.ordem = item.dataset.ordem; renderizar(); });
  });
  document.getElementById("limparFiltros").addEventListener("click", function () {
    estado = { genero: "todos", busca: "", ordem: "padrao" };
    campoBusca.value = "";
    document.querySelector('[data-genre="todos"]').click();
  });

  var q = new URLSearchParams(window.location.search).get("q");
  if (q) { estado.busca = q; campoBusca.value = q; }
  renderizar();
}

/* ---------- atividade: grafico ---------- */

var MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function rotuloDoDia(fim, deslocamento) {
  var partes = fim.split("-");
  var d = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]) - deslocamento);
  return d.getDate() + " " + MESES[d.getMonth()];
}

function renderizarGrafico(metrica, dias) {
  var plot = document.getElementById("graficoPlot");
  var eixo = document.getElementById("graficoEixo");
  if (!plot) { return; }
  var serie = tempoDeJogo[metrica].slice(-dias);
  var topo = metrica === "horas" ? 8 : 4;
  var unidade = metrica === "horas" ? "h" : (metrica === "jogos" ? " jogo(s)" : "");
  var passo = topo / 4;
  eixo.innerHTML = [4, 3, 2, 1, 0].map(function (i) { return "<span>" + (i * passo) + (metrica === "horas" ? "h" : "") + "</span>"; }).join("");
  plot.innerHTML = serie.map(function (v, i) {
    var rotulo = rotuloDoDia(tempoDeJogo.fim, serie.length - 1 - i);
    var mostrarRotulo = dias <= 14 || i % 2 === (serie.length - 1) % 2;
    return '<div class="bar-chart-col" title="' + rotulo + ": " + v + unidade + '"><span class="bar" style="height: ' +
      Math.round(Math.min(v / topo, 1) * 100) + '%"></span><span class="bar-chart-day">' + (mostrarRotulo ? rotulo : "&nbsp;") + "</span></div>";
  }).join("");
  var total = serie.reduce(function (s, v) { return s + v; }, 0);
  var legenda = document.getElementById("legendaGrafico");
  if (legenda) { legenda.textContent = "Total no periodo: " + (Math.round(total * 10) / 10) + unidade + ". Dados ilustrativos."; }
}

function iniciarAtividade() {
  if (!document.getElementById("graficoPlot")) { return; }
  var estado = { metrica: "horas", dias: 14 };
  renderizarGrafico(estado.metrica, estado.dias);
  document.querySelectorAll("[data-metrica]").forEach(function (b) {
    b.addEventListener("click", function () {
      estado.metrica = b.dataset.metrica;
      document.querySelectorAll("[data-metrica]").forEach(function (x) {
        x.classList.toggle("active", x === b);
        x.setAttribute("aria-pressed", x === b);
      });
      renderizarGrafico(estado.metrica, estado.dias);
    });
  });
  document.querySelectorAll("[data-periodo]").forEach(function (item) {
    item.addEventListener("click", function () {
      estado.dias = Number(item.dataset.periodo);
      document.getElementById("rotuloPeriodo").textContent = "Ultimos " + estado.dias + " dias";
      document.querySelectorAll("[data-periodo]").forEach(function (x) { x.classList.toggle("active", x === item); });
      renderizarGrafico(estado.metrica, estado.dias);
    });
  });
}

/* ---------- listas ---------- */

function renderizarListas() {
  var area = document.getElementById("listasUsuario");
  if (!area) { return; }
  area.innerHTML = obterListas().map(function (l) {
    var capas = capasDaLista(l).map(function (id) {
      var j = buscarJogo(id);
      return j ? '<img src="' + j.capa + '" alt="Capa do jogo ' + escaparHtml(j.titulo) + '">' : "";
    }).join("");
    var excluir = l.padrao ? "" : '<li><button type="button" class="dropdown-item" data-excluir-lista="' + l.id + '">Excluir lista</button></li>';
    return '<article class="list-card card">' +
      '<div class="list-card-header"><span class="list-card-icon">' + (ICONES_LISTA[l.icone] || ICONES_LISTA.personalizada) + "</span>" +
      '<div class="list-card-title"><h3>' + escaparHtml(l.nome) + "</h3><p>" + l.qtd + (l.qtd === 1 ? " jogo" : " jogos") + "</p></div>" +
      '<div class="dropdown"><button type="button" class="list-card-menu" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Mais opcoes da lista ' + escaparHtml(l.nome) + '">&#8942;</button>' +
      '<ul class="dropdown-menu dropdown-menu-end dropdown-menu-playlog"><li><button type="button" class="dropdown-item" data-ver-lista="' + l.id + '">Ver jogos</button></li>' + excluir + "</ul></div></div>" +
      '<div class="list-card-covers">' + capas + "</div></article>";
  }).join("");
  atualizarEstatisticas();
}

function abrirJogosDaLista(id) {
  var lista = obterListas().find(function (l) { return l.id === id; });
  if (!lista) { return; }
  var ids = lista.adicionados.slice().reverse().concat(lista.capas);
  ids = ids.filter(function (x, i) { return ids.indexOf(x) === i; });
  var el = criarModal("modalVerLista", "Jogos da lista", '<div id="modalVerListaCorpo"></div>',
    '<button type="button" class="cta-button btn" data-bs-dismiss="modal">Fechar</button>');
  document.getElementById("modalVerListaTitulo").textContent = lista.nome;
  document.getElementById("modalVerListaCorpo").innerHTML =
    '<ul class="list-group list-group-playlog">' + ids.map(function (i) {
      var j = buscarJogo(i);
      return '<li class="list-group-item"><img src="' + j.capa + '" alt="" class="recent-thumb"> ' + escaparHtml(j.titulo) +
        '<span class="rating ms-auto">' + textoNota(j) + "</span></li>";
    }).join("") + "</ul>" +
    (lista.qtd > ids.length ? '<p class="form-text mt-2">Mostrando os jogos de exemplo. A lista tem ' + lista.qtd + " jogos no total.</p>" : "");
  bootstrap.Modal.getOrCreateInstance(el).show();
}

function iniciarListas() {
  var area = document.getElementById("listasUsuario");
  if (!area) { return; }
  renderizarListas();

  area.addEventListener("click", function (e) {
    var ver = e.target.closest("[data-ver-lista]");
    if (ver) { abrirJogosDaLista(ver.dataset.verLista); return; }
    var exc = e.target.closest("[data-excluir-lista]");
    if (!exc) { return; }
    var id = exc.dataset.excluirLista;
    confirmarAcao("Deseja realmente excluir esta lista?", function () {
      salvarArmazenado(CHAVE_LISTAS, obterListas().filter(function (l) { return l.id !== id; }));
      renderizarListas();
      mostrarToast("Lista excluida.", "aviso");
    });
  });

  document.getElementById("botaoNovaLista").addEventListener("click", function () {
    var el = criarModal("modalLista", "Nova lista",
      '<form id="formLista" class="form-modal" novalidate>' +
      '<div class="form-field"><label for="listaNome">Nome da lista</label>' +
      '<input type="text" class="form-control" id="listaNome" required minlength="3" maxlength="30" data-rotulo="O nome da lista">' +
      '<div class="invalid-feedback"></div></div>' +
      '<div class="form-field"><label for="listaDescricao">Descricao (opcional)</label>' +
      '<textarea class="form-control" id="listaDescricao" rows="2" maxlength="100" data-rotulo="A descricao"></textarea><div class="invalid-feedback"></div></div>' +
      '<fieldset class="form-field"><legend>Visibilidade</legend>' +
      '<div class="form-check"><input class="form-check-input" type="radio" name="visibilidade" id="visPublica" value="publica" checked><label class="form-check-label" for="visPublica">Publica</label></div>' +
      '<div class="form-check"><input class="form-check-input" type="radio" name="visibilidade" id="visPrivada" value="privada"><label class="form-check-label" for="visPrivada">Privada</label></div></fieldset>' +
      '<div class="modal-acoes"><button type="button" class="cta-button btn" data-bs-dismiss="modal">Cancelar</button>' +
      '<button type="submit" class="cta-button cta-solid btn">Criar lista</button></div></form>');
    var form = document.getElementById("formLista");
    if (!form.dataset.pronto) {
      form.dataset.pronto = "1";
      configurarValidacao(form);
      document.getElementById("listaNome").addEventListener("input", function (ev) { ev.target.setCustomValidity(""); });
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var campo = document.getElementById("listaNome");
        var nome = campo.value.trim();
        campo.setCustomValidity("");
        if (nome.length >= 3 && obterListas().some(function (l) { return normalizar(l.nome) === normalizar(nome); })) {
          campo.setCustomValidity("Ja existe uma lista com esse nome.");
        }
        if (!validarFormulario(form)) { return; }
        var todas = obterListas();
        todas.push({
          id: "lista-" + Date.now(), nome: nome, icone: "personalizada", qtd: 0, capas: [], adicionados: [], padrao: false,
          descricao: document.getElementById("listaDescricao").value.trim(),
          visibilidade: form.elements.visibilidade.value
        });
        salvarArmazenado(CHAVE_LISTAS, todas);
        bootstrap.Modal.getOrCreateInstance(el).hide();
        limparValidacao(form);
        renderizarListas();
        mostrarToast("Lista " + nome + " criada!");
      });
    }
    bootstrap.Modal.getOrCreateInstance(el).show();
  });
}

/* ---------- perfil (abas) ---------- */

function iniciarPerfil() {
  if (!document.getElementById("perfilJogos")) { return; }
  document.getElementById("perfilJogos").innerHTML = jogos.map(criarCardJogo).join("");

  var registros = obterRegistros().filter(function (r) { return r.comentario; });
  var reviews = registros.concat(reviewsPadrao.map(function (r) { return r; }));
  document.getElementById("perfilReviews").innerHTML = reviews.map(function (r) {
    var j = buscarJogo(r.jogo);
    return '<li class="list-group-item"><img src="' + j.capa + '" alt="" class="recent-thumb"><div><strong>' + escaparHtml(j.titulo) +
      '</strong> <span class="rating" aria-label="' + r.nota + ' de 5">' + estrelas(r.nota) + "</span><br>" + escaparHtml(r.comentario) + "</div></li>";
  }).join("");

  document.getElementById("perfilListas").innerHTML = obterListas().map(function (l) {
    return '<li class="list-group-item"><span class="list-card-icon">' + (ICONES_LISTA[l.icone] || ICONES_LISTA.personalizada) + "</span> " +
      escaparHtml(l.nome) + '<span class="ms-auto">' + l.qtd + (l.qtd === 1 ? " jogo" : " jogos") + "</span></li>";
  }).join("");

  document.getElementById("perfilConquistas").innerHTML = conquistas.map(function (c) {
    var j = buscarJogo(c.jogo);
    return '<li class="list-group-item"><img src="' + j.capa + '" alt="" class="recent-thumb"><div><strong>' + escaparHtml(c.nome) +
      "</strong><br><small>" + escaparHtml(c.descricao) + "</small></div></li>";
  }).join("");

  document.getElementById("perfilAtividade").innerHTML = atividadesRecentes.map(function (a) {
    var j = buscarJogo(a.jogo);
    return '<li class="list-group-item"><img src="' + j.capa + '" alt="" class="recent-thumb"><div><strong>' + escaparHtml(j.titulo) +
      "</strong><br><small>" + escaparHtml(a.texto) + '</small></div><span class="ms-auto recent-time">' + escaparHtml(a.quando) + "</span></li>";
  }).join("");
}

/* ---------- cadastro e login ---------- */

var REQUISITOS_SENHA = {
  tamanho: function (s) { return s.length >= 8; },
  minuscula: function (s) { return /[a-z]/.test(s); },
  maiuscula: function (s) { return /[A-Z]/.test(s); },
  numero: function (s) { return /\d/.test(s); },
  especial: function (s) { return /[^A-Za-z0-9]/.test(s); }
};

function avaliarSenha(senha) {
  var atendidos = 0;
  var detalhes = {};
  Object.keys(REQUISITOS_SENHA).forEach(function (chave) {
    detalhes[chave] = REQUISITOS_SENHA[chave](senha);
    if (detalhes[chave]) { atendidos++; }
  });
  return { atendidos: atendidos, total: Object.keys(REQUISITOS_SENHA).length, detalhes: detalhes };
}

function iniciarCadastro() {
  var form = document.getElementById("formCadastro");
  if (!form) { return; }
  var senha = document.getElementById("senha");
  var confirmar = document.getElementById("confirmar-senha");
  var barra = document.getElementById("forcaBarra");

  function conferirConfirmacao() {
    confirmar.setCustomValidity(confirmar.value && confirmar.value !== senha.value ? "As senhas nao conferem." : "");
  }

  function atualizarRequisitos() {
    var r = avaliarSenha(senha.value);
    document.querySelectorAll("#requisitosSenha [data-req]").forEach(function (li) {
      var ok = r.detalhes[li.dataset.req];
      li.classList.toggle("ok", ok);
      li.querySelector(".marca").textContent = ok ? "✓" : "•";
    });
    var pct = Math.round((r.atendidos / r.total) * 100);
    barra.style.width = pct + "%";
    barra.className = "progress-bar " + (pct < 60 ? "bg-danger" : (pct < 100 ? "bg-warning" : "bg-success"));
    barra.parentElement.setAttribute("aria-valuenow", pct);
  }

  configurarValidacao(form, function (campo) {
    if (campo === senha) {
      atualizarRequisitos();
      conferirConfirmacao();
      if (confirmar.value) { avaliarCampo(confirmar); }
    }
    if (campo === confirmar) { conferirConfirmacao(); }
  });

  document.querySelectorAll("[data-mostrar-senha]").forEach(function (b) {
    b.addEventListener("click", function () {
      var alvo = document.getElementById(b.dataset.mostrarSenha);
      var mostrar = alvo.type === "password";
      alvo.type = mostrar ? "text" : "password";
      b.textContent = mostrar ? "Ocultar" : "Mostrar";
      b.setAttribute("aria-pressed", mostrar);
    });
  });

  document.querySelectorAll("[data-rede-social]").forEach(function (b) {
    b.addEventListener("click", function () { mostrarToast("Cadastro com " + b.dataset.redeSocial + " em breve.", "aviso"); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    conferirConfirmacao();
    if (!validarFormulario(form)) {
      mostrarToast("Corrija os campos destacados para continuar.", "erro");
      return;
    }
    salvarArmazenado(CHAVE_USUARIO, { nome: document.getElementById("usuario").value.trim() });
    window.location.href = "sucesso.html";
  });

  var abrirLogin = document.getElementById("abrirLogin");
  if (abrirLogin) {
    abrirLogin.addEventListener("click", function (e) {
      e.preventDefault();
      var el = criarModal("modalLogin", "Entrar",
        '<form id="formLogin" class="form-modal" novalidate>' +
        '<div class="form-field"><label for="loginEmail">E-mail</label>' +
        '<input type="email" class="form-control" id="loginEmail" required data-rotulo="O e-mail" autocomplete="email"><div class="invalid-feedback"></div></div>' +
        '<div class="form-field"><label for="loginSenha">Senha</label>' +
        '<input type="password" class="form-control" id="loginSenha" required minlength="8" data-rotulo="A senha" autocomplete="current-password"><div class="invalid-feedback"></div></div>' +
        '<div class="modal-acoes"><button type="button" class="cta-button btn" data-bs-dismiss="modal">Cancelar</button>' +
        '<button type="submit" class="cta-button cta-solid btn">Entrar</button></div></form>');
      var f = document.getElementById("formLogin");
      if (!f.dataset.pronto) {
        f.dataset.pronto = "1";
        configurarValidacao(f);
        f.addEventListener("submit", function (ev) {
          ev.preventDefault();
          if (!validarFormulario(f)) { return; }
          window.location.href = "index.html";
        });
      }
      bootstrap.Modal.getOrCreateInstance(el).show();
    });
  }
}

/* ---------- pagina de sucesso ---------- */

function iniciarSucesso() {
  var alvo = document.getElementById("mensagemUsuario");
  if (!alvo) { return; }
  var salvo = lerArmazenado(CHAVE_USUARIO, null);
  if (salvo && salvo.nome) {
    alvo.textContent = "Bem-vindo(a) ao PlayLog, " + salvo.nome + "!";
    alvo.hidden = false;
  }
}

/* ---------- inicializacao ---------- */

function iniciarBuscaSuperior() {
  var form = document.getElementById("buscaTopo");
  if (!form) { return; }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var termo = document.getElementById("campoBuscaTopo").value.trim();
    window.location.href = "jogos.html" + (termo ? "?q=" + encodeURIComponent(termo) : "");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  aplicarUsuario();
  atualizarEstatisticas();
  iniciarBuscaSuperior();
  iniciarCatalogo();
  iniciarAtividade();
  iniciarListas();
  iniciarPerfil();
  iniciarCadastro();
  iniciarSucesso();

  document.addEventListener("click", function (e) {
    var soon = e.target.closest("[data-soon]");
    if (soon) { e.preventDefault(); mostrarToast("Esta area ainda esta em construcao.", "aviso"); return; }
    var det = e.target.closest("[data-detalhes]");
    if (det) { abrirDetalhesJogo(det.dataset.detalhes); return; }
    if (e.target.closest("[data-registrar]")) { abrirRegistrarJogo(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") { return; }
    var det = e.target.closest && e.target.closest("article[data-detalhes]");
    if (det && e.target === det) { e.preventDefault(); abrirDetalhesJogo(det.dataset.detalhes); }
  });
});
