/* =========================================================
   PlayLog - catalogo.js
   Pagina Jogos: busca, filtro por genero e ordenacao.
   Depende de: dados.js, utils.js, cards.js
   ========================================================= */
"use strict";

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
  gerarCatalogo();
  var estado = { genero: "todos", busca: "", ordem: "padrao" };
  var tabela = document.querySelector("#tabelaJogos tbody");
  var campoBusca = document.getElementById("buscaCatalogo");
  var contador = document.getElementById("contadorCatalogo");
  var vazio = document.getElementById("vazioCatalogo");
  var rotuloOrdem = document.getElementById("rotuloOrdem");
  var nomesOrdem = { padrao: "Filtros", titulo: "Título (A-Z)", nota: "Melhor nota", ano: "Mais recentes" };

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
