/* =========================================================
   PlayLog - nivel.js
   XP do jogador (função de 1º grau) e nível (função de 2º grau)
   ========================================================= */

/* XP do jogador: XP(x) = 50x + 100 */
function calcularXP(jogosRegistrados) {
  return 50 * jogosRegistrados + 100;
}
/* XP total para chegar ao nível n: N(n) = 100n² */
function xpParaNivel(n) {
  return 100 * n * n;
}
/* Nível atual: sobe enquanto o XP alcançar o próximo nível */
function calcularNivel(xp) {
  var nivel = 1;
  while (xpParaNivel(nivel + 1) <= xp) {
    nivel = nivel + 1;
  }
  return nivel;
}
/* Dados para a barra de progresso do Perfil */
function progressoDoJogador(jogosRegistrados) {
  var xp = calcularXP(jogosRegistrados);
  var nivel = calcularNivel(xp);
  var inicio = xpParaNivel(nivel);
  var proximo = xpParaNivel(nivel + 1);
  return {
    xp: xp,
    nivel: nivel,
    proximoNivel: proximo,
    faltam: proximo - xp,
    percentual: Math.round((xp - inicio) / (proximo - inicio) * 100)
  };
}
