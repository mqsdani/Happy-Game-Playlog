/* =========================================================
   PlayLog - cadastro.js
   Cadastro, login (modal) e pagina de sucesso.
   Depende de: utils.js, usuario.js, validacao.js
   ========================================================= */
"use strict";

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
    var erros = listarErros(form);
    if (erros.length > 0) {
      erros[0].campo.focus();
      mostrarToast("Corrija " + erros.length + (erros.length === 1 ? " campo destacado" : " campos destacados") + " para continuar.", "erro");
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
