/* =========================================================
   PlayLog - atividade.js
   Pagina Atividade: grafico de tempo de jogo.
   Depende de: dados.js, utils.js
   ========================================================= */
"use strict";

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
  if (legenda) { legenda.textContent = "Total no período: " + (Math.round(total * 10) / 10) + unidade + ". Dados ilustrativos."; }
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
      document.getElementById("rotuloPeriodo").textContent = "Últimos " + estado.dias + " dias";
      document.querySelectorAll("[data-periodo]").forEach(function (x) { x.classList.toggle("active", x === item); });
      renderizarGrafico(estado.metrica, estado.dias);
    });
  });
}
