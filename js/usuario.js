/* =========================================================
   PlayLog - usuario.js
   Usuario, saudacao, estatisticas e helpers de listas.
   Depende de: dados.js, utils.js
   ========================================================= */
"use strict";

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
