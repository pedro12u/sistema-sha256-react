# Projeto de Proteção de Dados com SHA-256

Este projeto é uma aplicação web para registro e autenticação de usuários, utilizando criptografia SHA-256 para proteger as senhas e AES para a proteção adicional dos dados. Foi desenvolvido com React no frontend e Node.js no backend, aplicando conceitos de Programação Orientada a Objetos e seguindo boas práticas de segurança.

## Tecnologias Utilizadas

- **Frontend**: React, HTML, CSS, Axios
- **Backend**: Node.js, Express.js, MySQL
- **Banco de Dados**: MySQL
- **Criptografia**: SHA-256 e AES

## Estrutura do Projeto

```
sistema-sha256/
├── server/
│   ├── controllers/
│   │   └── userController.js      # Controladores de usuários (refatorado com POO)
│   ├── config/
│   │   └── db.js                  # Configuração do banco de dados MySQL
│   ├── routes/
│   │   └── usersRoutes.js         # Definição das rotas de usuários
│   ├── server.js                  # Ponto de entrada do servidor
│   └── package.json               # Dependências do projeto
├── client/
│   ├── src/
│   │   ├── App.js                 # Componente principal do React
│   │   ├── App.css                # Estilos globais
│   │   └── index.js               # Ponto de entrada do React
│   └── public/
│       └── index.html             # Arquivo HTML principal
└── README.md                      # Documentação do projeto
```

## Como Executar o Projeto

### Pré-requisitos

- Node.js instalado
- MySQL instalado e rodando

### Configuração do Banco de Dados

1. Crie um banco de dados MySQL:
   ```sql
   CREATE DATABASE sistema_sha256;
   USE sistema_sha256;
   ```
2. Crie as tabelas necessárias:

   ```sql
   CREATE TABLE Usuarios (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nome VARCHAR(50) NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL,
       senha_hash VARCHAR(64) NOT NULL,
       chave_aes VARCHAR(128)
   );

   CREATE TABLE LogAcessos (
       log_id INT AUTO_INCREMENT PRIMARY KEY,
       usuario_id INT,
       data_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       status_acesso VARCHAR(20),
       FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
   );
   ```

### Configuração do Backend

1. Navegue até a pasta `server` e instale as dependências:
   ```bash
   cd server
   npm install
   ```
2. Crie um arquivo `.env` na pasta `server` e configure as variáveis de ambiente:
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=seu_usuario
   MYSQL_PASSWORD=sua_senha
   MYSQL_DATABASE=sistema_sha256
   PORT=3000
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```

### Configuração do Frontend

1. Navegue até a pasta `client` e instale as dependências:
   ```bash
   cd client
   npm install
   ```
2. Inicie o frontend:
   ```bash
   npm start
   ```

### Acessando a Aplicação

- Abra o navegador e acesse `http://localhost:3000` para visualizar a interface.

## Funcionalidades

- **Registro de Usuário**: Permite criar uma nova conta com nome, email e senha.
- **Login**: Autentica o usuário com base no email e senha.
- **Hash de Senha e Chave AES**: Exibe o hash da senha e a chave AES do usuário autenticado.

## Melhorias Futuras

- **Validação Mais Robusta**: Adicionar validações adicionais, como força da senha.
- **Logs de Acesso**: Melhorar a visualização dos logs de acesso do usuário.
- **Autenticação JWT**: Implementar autenticação baseada em tokens para maior segurança.

## Contribuindo

Sinta-se à vontade para abrir problemas e enviar pull requests. Qualquer ajuda é bem-vinda para tornar o sistema ainda mais seguro e eficiente.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
