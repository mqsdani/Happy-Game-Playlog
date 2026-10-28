/* =========================================================
   PlayLog - listas.js
   Paginas Listas e Perfil.
   Depende de: dados.js, utils.js, usuario.js, cards.js, validacao.js
   ========================================================= */
"use strict";

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
