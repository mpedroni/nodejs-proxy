# nodejs-proxy

Proxy server simples a fim de estudar os conceitos de proxy e aprofundar os conhecimentos de Redes de Computadores.

## Requisitos

Node.js v14.x ou superior

## Instalação

Depois de clonar o projeto, instale as dependências

```sh
$ yarn install
# or
$ npm install
```

## Executando o proxy localmente

Para iniciar a aplicação, execute o comando

```sh
$ yarn dev
# or
$ npm run dev
```

Com a aplicação rodando (por padrão em `localhost:3000`. Pode ser alterado trocando os valores das constantes em `src/main.ts`), configure o Proxy do seu navegador e aponte para a URL da aplicação. Pronto! 🎉🎉

Também é possível bloquear as requisições de determinados hosts (por padrão, qualquer host que contenha `google` ou `facebook` em seu nome). Para ativar essa feature, execute o proxy passando o parâmetro `--block-blacklist` pelo terminal.
