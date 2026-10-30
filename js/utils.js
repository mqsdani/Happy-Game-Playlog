/* =========================================================
   PlayLog - utils.js
   Constantes, funcoes de apoio e avisos (toast).
   Depende de: nada (carregue antes dos demais)
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
