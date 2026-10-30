/* =========================================================
   PlayLog - main.js
   Inicializacao: liga cada pagina quando o DOM carrega.
   Depende de: todos os arquivos acima
   ========================================================= */
"use strict";

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
    if (soon) { e.preventDefault(); mostrarToast("Esta área ainda está em construção.", "aviso"); return; }
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
