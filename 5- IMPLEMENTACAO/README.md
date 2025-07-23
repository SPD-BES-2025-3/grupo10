# Projeto com Next.js (Frontend) e Express.js (Backend)

Este projeto possui dois serviços:

* Frontend (Next.js) na porta 3000
* Backend (Express.js) na porta 8000

## Requisitos

* Node.js instalado (versão 18 ou superior)

## Como rodar

### Backend

1. Acesse a pasta do backend:

   ```bash
   cd backend
   ```
2. Instale as dependências:

   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do backend com o seguinte conteúdo:

   ```env
   DATABASE_URL=mongodb+srv://teste:teste@cluster0.iia5ekw.mongodb.net/people?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Inicie o servidor:

   ```bash
   npm start
   ```

   O backend estará disponível em `http://localhost:8000`

### Frontend

1. Acesse a pasta do projeto 'my-app' no frontend (./frontend/my-app):

   ```bash
   cd frontend/my-app
   ```
2. Instale as dependências:

   ```bash
   npm install
   ```
3. Faça o build do projeto:

   ```bash
   npm run build
   ```
4. Inicie o servidor:

   ```bash
   npm run dev
   ```

   O frontend estará disponível em `http://localhost:3000`

## Observações

* Rode primeiro o backend, depois o frontend.
* Verifique se o frontend está configurado para chamar o backend em `http://localhost:8000`.
