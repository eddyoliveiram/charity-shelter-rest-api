
# Charity Shelter App

Este é o repositório da aplicação **Charity Shelter**, uma plataforma que conecta indivíduos oferecendo abrigo temporário para vítimas de desastres com aqueles que necessitam.

## Requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 16.x ou superior)
- [NPM](https://www.npmjs.com/) (ou [Yarn](https://yarnpkg.com/), se preferir)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/charity-shelter-app.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd charity-shelter-app
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

## Variáveis de Ambiente

Certifique-se de configurar um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
DATABASE_URL=postgres://user:password@localhost:5432/charity_shelter
JWT_SECRET=your_jwt_secret_key
API_URL=http://localhost:3000/api
```

> Lembre-se de ajustar as variáveis conforme necessário para seu ambiente de desenvolvimento.

## Rodando a Aplicação

Para rodar a aplicação em ambiente de desenvolvimento, utilize o seguinte comando:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Scripts Disponíveis

- `npm run dev`: Inicia a aplicação em modo de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm start`: Inicia a aplicação em modo de produção.

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **PostgreSQL**
- **JWT (JSON Web Token) para autenticação**
- **Docker** (opcional, para rodar o banco de dados)

## API Endpoints

Aqui estão alguns dos endpoints disponíveis na API:

- `POST /api/login`: Autentica um usuário e retorna um token JWT.
- `POST /api/register`: Cria uma nova conta de usuário.
- `GET /api/shelters`: Retorna uma lista de abrigos disponíveis.
- `POST /api/shelters/request`: Envia uma solicitação para um abrigo.
