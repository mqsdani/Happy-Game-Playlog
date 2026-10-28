/* =========================================================
   PlayLog - validacao.js
   Validacao de formularios: mensagens, estados do Bootstrap e lista de erros.
   Depende de: utils.js
   ========================================================= */
"use strict";

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

/* percorre os campos com for e devolve um array de erros: [{ campo, mensagem }] */
function listarErros(form) {
  var erros = [];
  var campos = form.querySelectorAll("input, select, textarea");
  for (var i = 0; i < campos.length; i++) {
    var campo = campos[i];
    if (campo.type === "hidden" || campo.type === "range") { continue; }
    if (!avaliarCampo(campo)) {
      erros.push({ campo: campo, mensagem: mensagemDeErro(campo) });
    }
  }
  return erros;
}

function validarFormulario(form) {
  var erros = listarErros(form);
  if (erros.length > 0) { erros[0].campo.focus(); }
  return erros.length === 0;
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
