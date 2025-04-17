# Back-end (Teste SPS Group)

Este é o repositório do back-end da aplicação. Ele foi desenvolvido utilizando **Fastify** e utiliza um banco de dados em memória para persistência de dados. Esta API é responsável pela autenticação, manipulação e gerenciamento de usuários.

## Requisitos Funcionais

- [x] Não deve ser possível deletar o usuário admin inicial.
- [x] Deve ser possível ao usuário comum obter e alterar os dados do seu perfil (Campos: `name` e `password`).
- [x] Deve ser possível aos admins filtrar os usuários através de um parâmetro de busca.
- [x] Deve ser possível aos admins excluir um usuário.
- [x] Deve ser possível aos admins obter e alterar os dados de um usuário (`name`, `type` e `password`).
- [x] Deve ser possível aos admins obter a lista de perfil de todos os usuários.
- [x] Deve ser possível aos admins e ao usuário comum obter o seu próprio perfil.
- [x] Deve ser possível aos admins e ao usuário comum se autenticarem na aplicação.
- [x] Deve ser possível aos admins cadastrar um usuário (Campos: `name`, `email`, `type` [exclusivo para admins] e `password`).
- [x] Deve existir um usuário admin previamente cadastrado para utilizar autenticação.

## Regras de Negócio (RNs)

- [x] O usuário comum não deve ter acesso a modificação do campo `type` do próprio perfil.
- [x] O usuário comum só pode ser cadastrado por admins.
- [x] Não deve ser possível criar um novo usuário (seja comum ou admin) com um email que já é utilizado.

## Requisitos Não-Funcionais (RNFs)

- [x] As senhas precisam ter pelo menos 4 caracteres.
- [x] A lista de perfil de todos os usuários precisa estar paginada com 20 itens por página.
- [x] Tanto o admin quanto o usuário comum devem ser identificados por um JWT (JSON Web Token).
- [x] A senha do admin e do usuário comum não precisam estar criptografadas.
- [x] Os dados da aplicação precisam estar persistidos em memória.

## Como Rodar o Projeto

### Pré-requisitos

Certifique-se de que você tem o [Node.js](https://nodejs.org) e o npm instalados em sua máquina.

### Instalação

1. Clone este repositório:

```bash
git clone <url-do-repositorio>
```

2. Navegue até o diretório do projeto:

```bash
cd <nome-do-diretorio>
```

3. Instale as dependências:

```bash
npm i
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. A API estará disponível em `http://localhost:3333`.

## Estrutura do Projeto

- **src/http**: Contém os controladores responsáveis pelas regras de negócio.
- **src/repositories**: Contém os arquivos utilizados para montar a lógica do banco em memória.
- **src/usecases**: Contém os casos de uso responsáveis pelas regras de negócio.
- **src/utils**: Contém funções utilitárias.

