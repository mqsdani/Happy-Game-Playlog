/* =========================================================
   PlayLog - dados do site (arrays de objetos)
   Jogos: informacoes da Fase 1 (ficha tecnica do grupo).
   Atividades, listas e series do grafico: dados ilustrativos.
   ========================================================= */

var generos = [
  { id: "todos", nome: "Todos" },
  { id: "acao", nome: "Acao" },
  { id: "aventura", nome: "Aventura" },
  { id: "rpg", nome: "RPG" },
  { id: "terror", nome: "Terror" },
  { id: "simulacao", nome: "Simulacao" },
  { id: "estrategia", nome: "Estrategia" },
  { id: "esporte", nome: "Esporte" },
  { id: "indie", nome: "Indie" }
];

var jogos = [
  {
    id: "171", titulo: "171", fichaTitulo: "171",
    capa: "assets/171_cover.jpg", nota: 4.6,
    generos: ["acao", "aventura"], tags: ["Acao", "Aventura", "Mundo Aberto"],
    desenvolvedora: "Betagames Group", ano: 2026, pais: "Brasil",
    plataformas: "PC, PS4, PS5, Xbox One, Xbox Series, Nintendo Switch"
  },
  {
    id: "enigma-do-medo", titulo: "Enigma do Medo", fichaTitulo: "Enigma do Medo",
    capa: "assets/enigma_do_medo_cover.jpg", nota: 4.3,
    generos: ["terror", "aventura", "indie"], tags: ["Terror", "Aventura", "Indie"],
    desenvolvedora: "Dumativa, Cellbit", ano: 2024, pais: "Brasil",
    plataformas: "PC (Windows)"
  },
  {
    id: "dandara", titulo: "Dandara", fichaTitulo: "Dandara",
    capa: "assets/dandara_cover.jpeg", nota: 4.5,
    generos: ["acao", "rpg"], tags: ["Acao", "RPG"],
    desenvolvedora: "Long Hat House", ano: 2018, pais: "Brasil",
    plataformas: "PC, PS4, Xbox One, Nintendo Switch, iOS, Android"
  },
  {
    id: "fobia", titulo: "Fobia", fichaTitulo: "Fobia - St. Dinfna Hotel",
    capa: "assets/fobia_cover.jpg", nota: 4.4,
    generos: ["terror"], tags: ["Terror"],
    desenvolvedora: "Pulsatrix Studios", ano: 2022, pais: "Brasil",
    plataformas: "PC, PS4, PS5, Xbox One, Xbox Series X/S"
  },
  {
    id: "9-kings", titulo: "9 Kings", fichaTitulo: "9 Kings",
    capa: "assets/9kings_cover.jpeg", nota: 4.2,
    generos: ["estrategia", "indie"], tags: ["Estrategia", "Indie", "Roguelike"],
    desenvolvedora: "Sad Socket", ano: 2025, pais: "Brasil",
    plataformas: "PC (Windows, macOS)"
  },
  {
    id: "arida", titulo: "Arida", fichaTitulo: "Arida: Backland's Awakening",
    capa: "assets/arida_cover.jpeg", nota: 4.1,
    generos: ["aventura", "indie"], tags: ["Aventura", "Indie", "Sobrevivencia"],
    desenvolvedora: "Aoca Game Lab", ano: 2019, pais: "Brasil",
    plataformas: "PC, Android, iOS"
  },
  {
    id: "arida-2", titulo: "Arida 2", fichaTitulo: "Arida 2: Rise of the Brave",
    capa: "assets/arida2_cover.jpeg", nota: null,
    generos: ["aventura", "indie"], tags: ["Aventura", "Indie"],
    desenvolvedora: "Aoca Game Lab", ano: null, pais: "Brasil",
    plataformas: "PC"
  },
  {
    id: "dodgeball-academia", titulo: "Dodgeball Academia", fichaTitulo: "Dodgeball Academia",
    capa: "assets/dodgeball_cover.jpeg", nota: 4.4,
    generos: ["esporte", "rpg", "indie"], tags: ["Esporte", "RPG", "Indie"],
    desenvolvedora: "Pocket Trap", ano: 2021, pais: "Brasil",
    plataformas: "PC, PS4, Xbox One, Xbox Series X/S, Nintendo Switch"
  },
  {
    id: "em-busca-dos-tesouros", titulo: "Em Busca dos Tesouros", fichaTitulo: "Em Busca dos Tesouros",
    capa: "assets/em_busca_dos_tesouros_cover.jpeg", nota: 3.8,
    generos: ["aventura", "indie"], tags: ["Aventura", "Retro"],
    desenvolvedora: "Fernando Rodrigues Salvio", ano: 2024, pais: "Brasil",
    plataformas: "Atari 2600"
  },
  {
    id: "gaucho", titulo: "Gaucho and the Grassland", fichaTitulo: "Gaucho and the Grassland",
    capa: "assets/gaucho_cover.jpeg", nota: 4.0,
    generos: ["aventura", "simulacao", "indie"], tags: ["Aventura", "Simulacao", "Indie"],
    desenvolvedora: "Epopeia Games", ano: 2025, pais: "Brasil",
    plataformas: "PC"
  },
  {
    id: "monica", titulo: "Monica no Castelo do Dragao", fichaTitulo: "Monica no Castelo do Dragao",
    capa: "assets/monica_cover.jpeg", nota: 4.0,
    generos: ["acao", "aventura"], tags: ["Acao", "Aventura", "Retro"],
    desenvolvedora: "Tec Toy", ano: 1991, pais: "Brasil",
    plataformas: "Master System"
  },
  {
    id: "no-place-for-bravery", titulo: "No Place for Bravery", fichaTitulo: "No Place for Bravery",
    capa: "assets/no_place_for_bravery_cover.jpeg", nota: 4.2,
    generos: ["acao", "rpg", "indie"], tags: ["Acao", "RPG", "Indie"],
    desenvolvedora: "Glitch Factory", ano: 2022, pais: "Brasil",
    plataformas: "PC, Nintendo Switch"
  },
  {
    id: "relic-hunters", titulo: "Relic Hunters Legend", fichaTitulo: "Relic Hunters Legend",
    capa: "assets/relic_hunters_cover.jpeg", nota: 4.3,
    generos: ["acao", "rpg", "indie"], tags: ["Acao", "RPG", "Indie"],
    desenvolvedora: "Rogue Snail", ano: 2025, pais: "Brasil",
    plataformas: "PC, Xbox Series"
  },
  {
    id: "last-nightmary", titulo: "The Last NightMary", fichaTitulo: "The Last NightMary - A Lenda do Cabeca de Cuia",
    capa: "assets/the_last_night_mary_cover.jpeg", nota: 3.9,
    generos: ["terror", "indie"], tags: ["Terror", "Indie"],
    desenvolvedora: "Submersivo Game Studio", ano: 2015, pais: "Brasil",
    plataformas: "PC, macOS, Linux"
  },
  {
    id: "unsighted", titulo: "Unsighted", fichaTitulo: "Unsighted",
    capa: "assets/unsighted_cover.jpeg", nota: 4.5,
    generos: ["acao", "rpg", "aventura", "indie"], tags: ["Acao", "RPG", "Indie"],
    desenvolvedora: "Studio Pixel Punk", ano: 2021, pais: "Brasil",
    plataformas: "PC, PS4, Xbox One, Xbox Series, Nintendo Switch"
  },
  {
    id: "chroma-squad", titulo: "Chroma Squad", fichaTitulo: "Chroma Squad",
    capa: "assets/chroma_squad_cover.jpeg", nota: 4.3,
    generos: ["estrategia", "rpg", "indie"], tags: ["Estrategia", "RPG", "Indie"],
    desenvolvedora: "Behold Studios", ano: 2015, pais: "Brasil",
    plataformas: "PC, PS4, Xbox One, Nintendo Switch, iOS, Android"
  },
  {
    id: "relicta", titulo: "Relicta", fichaTitulo: "Relicta",
    capa: "assets/relicta_cover.jpeg", nota: 4.0,
    generos: ["aventura", "indie"], tags: ["Aventura", "Quebra-cabeca", "Indie"],
    desenvolvedora: "Mighty Polygon", ano: 2020, pais: "Brasil",
    plataformas: "PC"
  }
];

/* listas padrao do usuario (qtd = total exibido; capas = ids mostrados) */
var listasPadrao = [
  { id: "favoritos", nome: "Favoritos", icone: "favoritos", qtd: 12, capas: ["dandara", "171", "fobia", "enigma-do-medo"], adicionados: [], padrao: true },
  { id: "quero-jogar", nome: "Quero jogar", icone: "quero-jogar", qtd: 18, capas: ["enigma-do-medo", "fobia", "dandara", "171"], adicionados: [], padrao: true },
  { id: "zerados", nome: "Zerados", icone: "zerados", qtd: 7, capas: ["171", "dandara", "fobia", "enigma-do-medo"], adicionados: [], padrao: true }
];

var atividadesRecentes = [
  { jogo: "dandara", texto: "Jogou por 3h 24min", quando: "Ha 2 horas" },
  { jogo: "fobia", texto: "Conquistou: Sobrevivente", quando: "Ha 5 horas" },
  { jogo: "171", texto: "Adicionou a lista: Favoritos", quando: "Ha 1 dia" },
  { jogo: "enigma-do-medo", texto: "Jogou por 2h 10min", quando: "Ha 1 dia" }
];

var reviewsPadrao = [
  { jogo: "fobia", nota: 5, comentario: "Historia sinistra, nao consegui parar de jogar!" }
];

var conquistas = [
  { nome: "Sobrevivente", jogo: "fobia", descricao: "Terminou um jogo de terror." },
  { nome: "Explorador", jogo: "dandara", descricao: "Jogou 10 jogos diferentes." },
  { nome: "Critico", jogo: "171", descricao: "Escreveu 10 reviews." }
];

/* ultimos 30 dias ate a data "fim" (os 14 ultimos dias sao os do grafico da Fase 1) */
var tempoDeJogo = {
  fim: "2026-09-14",
  horas: [2.1, 3.4, 1.5, 0, 4.2, 5.1, 2.8, 1.2, 0, 3.6, 4.4, 2.0, 1.1, 3.9, 2.6, 3.0,
          0.7, 4.0, 2.7, 5.5, 7.0, 4.0, 2.2, 3.2, 4.5, 2.7, 2.0, 3.5, 6.7, 4.2],
  jogos: [1, 2, 1, 0, 2, 3, 2, 1, 0, 2, 2, 1, 1, 2, 1, 2,
          1, 3, 2, 3, 4, 3, 2, 2, 3, 2, 2, 2, 4, 3]
};
