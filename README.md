# PlayLog (Happy Game) - Fase 3

Site em HTML, CSS, JavaScript e Bootstrap 5.2.3 (arquivos locais, sem CDN).

## Estrutura de pastas

Antes (Fase 2), tudo na raiz:

```
index.html ... mapa.html
style.css
script.js        (um arquivo unico, ~750 linhas)
dados.js
bootstrap.min.css
bootstrap.bundle.min.js
assets/
```

Depois (Fase 3):

```
index.html, jogos.html, listas.html, atividade.html, perfil.html,
cadastro.html, sobre.html, sucesso.html, mapa.html
css/
  style.css
js/
  dados.js        lista de jogos, generos, listas, reviews, conquistas
  utils.js        constantes, armazenamento (localStorage), toast
  usuario.js      usuario, saudacao, estatisticas, helpers de listas
  validacao.js    mensagens de erro, estados is-valid/is-invalid, array de erros
  cards.js        cards e ficha tecnica gerados com for, modais, registrar jogo
  catalogo.js     pagina Jogos: busca, filtro por genero, ordenacao
  atividade.js    pagina Atividade: grafico
  listas.js       paginas Listas e Perfil
  cadastro.js     cadastro, login (modal) e pagina de sucesso
  main.js         inicializacao (DOMContentLoaded)
vendor/
  bootstrap/
    bootstrap.min.css
    bootstrap.bundle.min.js
assets/           imagens (capas, logos, avatar)
```

- `css/` e `js/` guardam o que o grupo escreve; `vendor/` guarda codigo de terceiros (nao se edita); `assets/` guarda imagens.
- Cada pagina carrega os scripts na mesma ordem: Bootstrap, depois `dados.js`, `utils.js`, `usuario.js`, `validacao.js`, `cards.js`, `catalogo.js`, `atividade.js`, `listas.js`, `cadastro.js` e `main.js`. Os arquivos compartilham as funcoes globais, entao a ordem importa.

## Por que o JavaScript foi dividido

- Cada arquivo tem uma responsabilidade; fica mais facil achar e corrigir (erro no cadastro -> `cadastro.js`).
- A validacao (`validacao.js`) e reaproveitada pelo cadastro, pelo login, pelo formulario de lista e pelo registro de jogo.
- Menos conflito no Git: pessoas diferentes editam arquivos diferentes.
- `main.js` fica pequeno e so liga cada pagina ao seu codigo.

## Cards com for

Em `js/cards.js`, `gerarCatalogo()` percorre o array `jogos` com `for` e monta os cards da pagina Jogos e as linhas da ficha tecnica. `jogos.html` nao tem mais cards escritos a mao: para incluir um jogo basta acrescentar um objeto em `js/dados.js` e colocar a capa em `assets/`.

## Uso do Bootstrap

- Versao e classes continuam as mesmas da Fase 2 (grid, offcanvas, navbar, modais, toasts, cards, dropdowns, tabs, form-control/invalid-feedback, input-group, progress).
- O que mudou: os arquivos foram movidos para `vendor/bootstrap/` e os `<link>`/`<script>` das paginas apontam para o novo caminho.
- Navegacao: menu lateral unico (offcanvas no celular), com apenas as paginas existentes.

## Cadastro (JavaScript)

- Eventos: `input`, `blur`, `change`, `click`, `submit`.
- `listarErros(form)` percorre os campos com `for` e devolve um array `[{ campo, mensagem }]`; o aviso mostra quantos campos estao errados.
- No envio, `preventDefault()` bloqueia o envio padrao; se tudo estiver valido, salva o usuario no `localStorage` e redireciona para `sucesso.html` sem dados na URL.
- A caixa de termos comeca desmarcada e e obrigatoria.

## Como rodar

Abra `index.html` no navegador ou use a extensao Live Server do VS Code.
