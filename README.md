# app-animeQuiz
Trabalho da disciplina SSC0961 Desenvolvimento Web e Mobile

<h1 align="center"> :file_cabinet: Aplicação de um jogo que consiste em descobrir animes </h1>

## :memo: Descrição
O projeto tem como objetivo implementar uma aplicação multiplataforma (web, desktop e mobile) que faça requisições a uma API e liste, de alguma forma, elementos dessa API, além de utilizar um banco de dados próprio para armazenar dados e modificá-los, de forma sincronizada (no caso de várias pessoas estarem executando a aplicação).

Utilizamos como API externa o <a href="https://docs.api.jikan.moe/"> Jikan </a>, que é uma API de animes, com uma lista extensa destes e diversas informações a respeito de cada um.

Nossa aplicação gira em torno de um jogo, o "Anime Quiz", que consiste em tentar descobrir um anime secreto se baseando em dicas de comparação entre esse anime secreto e animes que o jogador chuta (por exemplo, se o anime secreto é mais recente que o chutado, qual tem mais episódios, quais gêneros eles compartilham, etc...), bem inspirado em LETRECO. Para acompanhar o jogo em si, construímos toda a interface da aplicação, com logins e senhas, páginas de usuário, páginas com informações dos animes, possibilidade de curtir os animes e deixar comentários em suas páginas, e uma leaderboard, que mostra os jogadores mais bem "rankeados" no modo competitivo. Além disso, há também a possibilidade de buscar usuários pelos nomes, para ver suas páginas de perfil, com todos os seus animes curtidos e seus stats no jogo, e pesquisar por animes, para descobrir informações a respeito dele, ou curtir/deixar um comentário em sua página.

## :wrench: Tecnologias utilizadas
* Framework <b>Quasar</b>, com Vue 3 (JavaScript)
* <b>Pinia</b> state management
* <b>PouchDB</b> local database com <b>CouchDB</b> remote database sincronizados

## :rocket: Rodando o código
Para rodar o repositório é necessário clonar o mesmo e executar o seguinte comando para iniciar a aplicação na web:
```
quasar dev
```

## :handshake: Membros da equipe
* <a href=https://www.linkedin.com/in/gabrielbatistella/> Gabriel Takeshi Miyake Batistella </a> - 11232198
* <a href=https://www.linkedin.com/in/thalesmaurin/> Thales Gomes Maurin </a> - 11175712
* <a href=https://www.linkedin.com/in/vitor-rinaldini/> Vitor Fernando Rinaldini </a> - 11232305