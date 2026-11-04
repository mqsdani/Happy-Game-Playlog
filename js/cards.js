/* =========================================================
   PlayLog - cards.js
   Cards de jogo (gerados com for), modais e registro de jogo.
   Depende de: dados.js, utils.js, usuario.js, validacao.js
   ========================================================= */
"use strict";

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
    '<table class="game-table mt-3"><caption class="visually-hidden">Ficha técnica</caption><tbody>' +
    '<tr><th scope="row">Desenvolvedora</th><td>' + escaparHtml(jogo.desenvolvedora) + "</td></tr>" +
    '<tr><th scope="row">Ano</th><td>' + (jogo.ano || "Em breve") + "</td></tr>" +
    '<tr><th scope="row">País</th><td>' + escaparHtml(jogo.pais) + "</td></tr>" +
    '<tr><th scope="row">Plataformas</th><td>' + escaparHtml(jogo.plataformas) + "</td></tr></tbody></table>";
  document.getElementById("modalJogoAdicionar").onclick = function () {
    bootstrap.Modal.getOrCreateInstance(el).hide();
    abrirRegistrarJogo(jogo.id);
  };
  bootstrap.Modal.getOrCreateInstance(el).show();
}

function confirmarAcao(mensagem, aoConfirmar) {
  var el = criarModal("modalConfirmar", "Confirmar ação", '<p id="modalConfirmarTexto"></p>',
    '<button type="button" class="cta-button btn" data-bs-dismiss="modal">Cancelar</button>' +
    '<button type="button" class="btn btn-perigo" id="modalConfirmarOk">Confirmar</button>');
  document.getElementById("modalConfirmarTexto").textContent = mensagem;
  document.getElementById("modalConfirmarOk").onclick = function () {
    bootstrap.Modal.getOrCreateInstance(el).hide();
    aoConfirmar();
  };
  bootstrap.Modal.getOrCreateInstance(el).show();
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
    '<div class="form-field"><label for="regComentario">Comentário (opcional)</label>' +
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
      mostrarToast(novo ? "Jogo registrado e adicionado à lista!" : "Jogo registrado! Ele já estava nessa lista.");
      if (document.getElementById("listasUsuario")) { renderizarListas(); }
      if (document.getElementById("perfilReviews")) { iniciarPerfil(); }
    });
  }
  /* as listas podem ter mudado desde a ultima abertura */
  document.getElementById("regLista").innerHTML = '<option value="">Selecione...</option>' + opcoesListas;
  if (idJogo) { document.getElementById("regJogo").value = idJogo; }
  bootstrap.Modal.getOrCreateInstance(el).show();
}

/* ---------- catalogo: cards e ficha tecnica gerados com for ---------- */

function criarCardCatalogo(jogo) {
  var tags = "";
  for (var t = 0; t < jogo.tags.length; t++) {
    tags += "<span>" + escaparHtml(jogo.tags[t]) + "</span>";
  }
  var ano = jogo.ano ? jogo.ano : "Em breve";
  return '<div class="col" data-id="' + jogo.id + '"><article class="game-card card">' +
    '<img src="' + jogo.capa + '" alt="Capa do jogo ' + escaparHtml(jogo.titulo) + '">' +
    "<h3>" + escaparHtml(jogo.titulo) + '</h3><p class="rating">' + textoNota(jogo) + "</p>" +
    '<div class="game-tags">' + tags + "</div>" +
    '<div class="game-meta"><p>' + escaparHtml(jogo.desenvolvedora) + " &middot; " + ano + " &middot; " + escaparHtml(jogo.pais) + "</p>" +
    "<p>" + escaparHtml(jogo.plataformas) + "</p></div>" +
    '<button type="button" class="cta-button btn detalhes-btn" data-detalhes="' + jogo.id + '">Ver detalhes</button>' +
    "</article></div>";
}

function criarLinhaFicha(jogo) {
  return '<tr data-id="' + jogo.id + '"><td>' + escaparHtml(jogo.fichaTitulo) + "</td><td>" + escaparHtml(jogo.tags.join(", ")) +
    "</td><td>" + escaparHtml(jogo.desenvolvedora) + "</td><td>" + (jogo.ano ? jogo.ano : "Em breve") +
    "</td><td>" + escaparHtml(jogo.plataformas) + "</td><td>" + escaparHtml(jogo.pais) + "</td></tr>";
}

function gerarCatalogo() {
  var area = document.getElementById("catalogo");
  var corpoTabela = document.querySelector("#tabelaJogos tbody");
  var htmlCards = "";
  var htmlLinhas = "";
  for (var i = 0; i < jogos.length; i++) {
    htmlCards += criarCardCatalogo(jogos[i]);
    htmlLinhas += criarLinhaFicha(jogos[i]);
  }
  if (area) { area.innerHTML = htmlCards; }
  if (corpoTabela) { corpoTabela.innerHTML = htmlLinhas; }
}

