# DOCUMENTO DE ARQUITETURA DE SOFTWARE

Este documento armazena as decisões relacionadas à arquitetura do sistema de software, cobrindo os requisitos de qualidade, a visão arquitetural e a estrutura do projeto. O desenvolvimento é realizado por uma única pessoa, com o auxílio deste guia.

## VISÃO GERAL DA ARQUITETURA

O **Sistema de Gerenciamento de Estoque e Manutenção de Maquinários** é uma aplicação web construída em três grandes partes que se comunicam: o **frontend** (o que o usuário vê e interage), o **backend (API)** (onde a lógica principal acontece) e a **persistência de dados** (onde as informações são guardadas).

O frontend será feito com Next.js, e o backend, com TypeScript, funcionando como uma API RESTful. Para guardar os dados, utiliza-se um banco de dados relacional (PostgreSQL ou MySQL) gerenciado pelo Prisma ORM, e também um banco de dados NoSQL (MongoDB) para dados flexíveis.

Essa arquitetura visa proporcionar **flexibilidade**, **facilidade de manutenção** e a capacidade de **crescer no futuro**, mesmo começando com um Produto Mínimo Viável (MVP) agora.

---

## ESTILO ARQUITETURAL ADOTADO

O estilo arquitetural principal adotado para este projeto é **Cliente-Servidor (Client-Server)**.

* **Cliente:** A **Aplicação Frontend** (desenvolvida com Next.js) atua como o cliente. Ela reside no navegador do usuário e é responsável por apresentar a interface gráfica e coletar as interações.
* **Servidor:** A **API Backend** (desenvolvida com Next.js API Routes em TypeScript) atua como o servidor. Ela processa as requisições enviadas pelo cliente, contém a lógica de negócio e se comunica com o banco de dados.

Essa comunicação ocorre através de uma rede (local para o MVP) via requisições HTTP, seguindo o padrão RESTful.

---

## REQUISITOS DE QUALIDADE

Aqui se define o que se espera do sistema em termos de qualidade e como ele deve se comportar.

### SEGURANÇA (RQ1)
A segurança das informações será garantida por meio de:
* **Validação de Entrada:** Todos os dados recebidos pelo backend serão validados para prevenir falhas.
* **Privacidade:** As informações pessoais dos responsáveis por manutenções (nome, contato) serão armazenadas de forma segura.
* **Acesso Controlado:** Para o MVP local, o acesso será direto, sem um sistema de login complexo, o que já reduz riscos para esta fase.

### DISPONIBILIDADE (RQ2)
Para a aplicação local, a disponibilidade significa que o sistema será **altamente estável e confiável**:
* **Sem Interrupções Inesperadas:** O backend terá tratamento de erros robusto para que falhas não derrubem o sistema.
* **Funcionalidade Contínua:** Ferramentas adequadas serão utilizadas para garantir que o sistema inicie e opere sem problemas.

### DESEMPENHO (RQ3)
O sistema será **rápido e responsivo** para o usuário:
* **Respostas Rápidas:** O objetivo é que a maioria das ações e informações apareça em menos de **0,3 segundos**.
* **Consultas Otimizadas:** Prisma será utilizado para criar buscas eficientes no banco de dados.
* **Carregamento Veloz:** Com o Next.js, as páginas devem carregar rapidamente para o usuário através de sua capacidade de pré-renderização e navegação otimizada, funcionando como um SPA após o carregamento inicial.

### USABILIDADE
A interface do usuário será **intuitiva e fácil de usar**:
* **Navegação Simples:** A navegação entre as telas de Maquinários, Estoque, Fornecedores, Manutenções e Dashboards será lógica e direta.
* **Adaptável:** A interface se ajustará bem a diferentes tamanhos de tela (computador, tablet).
* **Feedback Claro:** O sistema fornecerá mensagens visuais sobre o que está acontecendo (sucesso, erro, carregamento).

### ESCALABILIDADE
Mesmo como um projeto inicial, o futuro crescimento é considerado:
* **Partes Independentes:** Como o sistema é dividido (frontend, backend, banco de dados), cada parte pode crescer ou ser modificada sem impactar as outras.
* **Tecnologias Robustas:** Next.js, TypeScript e PostgreSQL são tecnologias comprovadamente escaláveis, capazes de suportar o crescimento futuro do sistema.

---

## VISÃO ARQUITETURAL

A visão arquitetural descreve o sistema em diferentes níveis de abstração, seguindo os princípios do Modelo C4, para detalhar como as partes do sistema se relacionam e funcionam:

### Nível 1: Diagrama de Contexto (Sistema no Ambiente)
O **Sistema de Estoque e Frota de Maquinário** é utilizado por um **Colaborador** (usuário utilizador do sistema). O Colaborador acessa o sistema através de um navegador web. Atualmente, o sistema não se integra com outros sistemas externos.

### Nível 2: Diagrama de Containers (Grandes Blocos de Implementação)
O sistema é composto pelos seguintes containers, que representam as principais unidades de software implementáveis e executáveis:

* **Aplicação Frontend:** Um aplicativo Next.js (com React e TypeScript) executado no navegador do usuário. Ele é responsável pela interface e pela interação.
* **API Backend:** Uma API RESTful construída com Next.js API Routes (usando Node.js e TypeScript). Ela processa a lógica de negócio e se comunica com o banco de dados.
* **PostgreSQL / Supabase (Banco relacional):** Um container de banco de dados relacional que armazena dados estruturados do sistema, como Maquinários, Produtos, Fornecedores, Manutenções e Responsáveis.
* **MongoDB / Atlas (Banco NoSQL):** Um container de banco de dados NoSQL que armazena dados flexíveis. *(Nota: Embora o diagrama mostre o MongoDB, para o MVP, conforme as decisões anteriores, este banco seria para uso futuro, como telemetria, não estando totalmente integrado no escopo inicial de dados estruturados.)*

### Nível 3: Diagrama de Componentes (Módulos dentro da API Backend)

Este nível detalha os componentes principais dentro da **API do Sistema (Express + TypeScript)**, mostrando como a lógica é organizada:

* **FornecedorController:** Componente responsável por gerenciar as operações de CRUD (Criar, Ler, Atualizar, Excluir) de Fornecedores. Ele lê/escreve dados diretamente no PostgreSQL.
* **EstoqueController:** Componente responsável por gerenciar as operações de CRUD de Itens (Produtos). Ele lê/escreve dados diretamente no PostgreSQL.
* **ManutencaoController:** Componente responsável por gerenciar o CRUD de Manutenção. Ele lê/escreve dados de manutenção ocorridos em um maquinário.
* **MaquinarioController:** Componente responsável por gerenciar o CRUD de Maquinários. Ele lê/escreve dados de maquinários e de manutenção (o que, conforme o diagrama, inclui o MongoDB para dados flexíveis, embora o relacionamento primário de manutenção seja com o maquinário no PostgreSQL).

---

## ESTRUTURA ARQUITETURAL DO PROJETO

Para manter tudo organizado e fácil de encontrar (e editar no futuro! 🛠️), o projeto é dividido em algumas pastas principais:

* **`back/`**: Aqui está todo o código do **Backend**. É o "cérebro" do sistema, onde a lógica acontece e a API é construída.
    * Dentro de `back/`:
        * `node_modules/`: As dependências específicas do backend (como o Express, se estivesse separado do Next.js API Routes).
        * `src/`: Onde está o código fonte principal do Backend.
            * **`controllers/`**: Pense nestes como os "porteiros" da API. Eles recebem os pedidos (requisições HTTP) do frontend e decidem para onde enviar a solicitação.
            * **`models/`**: Se houver classes que representam o "mundo real" do negócio (além das que o Prisma já gera automaticamente), elas vêm aqui.
            * **`repositories/`**: É o local onde se "conversa" diretamente com o banco de dados. Funciona como uma ponte segura 🌉, isolando a lógica de negócio dos detalhes do banco de dados.
        * Outros arquivos (`.env`, `package.json`, `tsconfig.json`, `server.ts` se for Express puro): São as configurações e a "identidade" do backend.
* **`front/`**: Esta pasta guarda todo o código do **Frontend**, ou seja, a interface que o usuário vê e interage.
    * Dentro de `my-app/`: É o projeto Next.js em si.
        * `node_modules/`: As dependências específicas do frontend.
        * `pages/`: Aqui ficam as "telas" da aplicação (as `App Routes` do Next.js), que são a "visão" do padrão MVC. Cada arquivo aqui é uma página do site. 🌐
        * `components/`: Onde se guardam os blocos de montar a interface: botões, campos de formulário, tabelas. São peças reutilizáveis para construir as páginas. 🧱
        * `public/`: Para coisas que o navegador pode acessar diretamente, como imagens e ícones. 🖼️
        * `styles/`: Onde se guardam todas as regras de estilo para deixar o sistema bonito. ✨
        * `package.json`, `tsconfig.json` do frontend: São as configurações específicas do frontend.
* **`prisma/`**: Dentro dela, o `schema.prisma` é como um mapa 🗺️ do banco de dados relacional (PostgreSQL/MySQL), onde se definem todas as tabelas e suas relações.
* **`tests/`**: Esta é a pasta dedicada para todos os testes. É onde se garante que tudo funcione como esperado! ✅
    * Dividida em `backend/` e `frontend/` para organizar os testes de cada parte.

---

## DECISÕES

Aqui se explicam as principais escolhas feitas e suas justificativas, especialmente como o plano original foi adaptado para cumprir o prazo:

1.  **Foco no Básico (MVP):**
    * **Decisão:** Foco no Produto Mínimo Viável (MVP) para garantir a entrega em 12 dias.
    * **Justificativa:** Priorizou-se as funcionalidades essenciais de cadastro e gerenciamento de maquinários, produtos, fornecedores e manutenções. Funcionalidades mais complexas, como relatórios avançados, sistema de usuários com permissões específicas, telemetria em tempo real ou controle detalhado de movimentação de estoque, foram adiadas ou desconsideradas.

2.  **Gerenciamento de "Colaboradores" Simplificado para "Responsáveis":**
    * **Decisão:** Removeu-se a necessidade de uma classe `Usuario` complexa com login e permissões. Em vez disso, criou-se uma entidade `Responsavel` simples para registrar quem realizou uma `Manutencao`.
    * **Justificativa:** Isso simplifica enormemente o projeto, eliminando a complexidade de um sistema de autenticação e autorização para um MVP local.

3.  **Tecnologias Escolhidas:**
    * **Frontend:** Next.js (React e TypeScript) – Escolha para interfaces modernas e eficientes.
    * **Backend:** Next.js API Routes (Node.js e TypeScript), embora os diagramas utilizem a nomenclatura 'Express/Spring' para ilustrar controladores – Combina bem com o frontend e acelera o desenvolvimento das APIs.
    * **ORM:** Prisma – Facilita muito a conexão e a manipulação do banco de dados relacional.
    * **Bancos de Dados:** PostgreSQL (ou MySQL) para dados estruturados, e MongoDB para dados flexíveis (conforme diagramas).
        * **Justificativa:** PostgreSQL/MySQL é perfeito para dados estruturados. A inclusão do MongoDB, conforme os diagramas, permite flexibilidade para dados que não se encaixam no modelo relacional, como telemetria, embora para o MVP seu uso seja mais limitado ou futuro.

4.  **Padrões de Código:**
    * **Backend:** Utiliza-se o padrão **MVC** (Controllers para API Routes, Models definidos no Prisma e classes de domínio, e Views sendo o Frontend) complementado por uma camada de **Repositórios** para gerenciar a interação com o banco de dados.
    * **Frontend:** Adoção de uma arquitetura baseada em **componentes** (React) e uso das **App Routes** do Next.js para organizar as telas da aplicação.

5.  **Regras de Negócio no MVP:**
    * **Validação de Quantidade:** Garante-se que o estoque de um item nunca fique negativo.
    * **Sem Duplicidade:** Impede-se que itens ou maquinários sejam cadastrados com o mesmo código/número de série.
    * **Estoque Mínimo:** O sistema exibirá um alerta visual na tela quando a quantidade de um produto estiver abaixo de 10 unidades, sem um sistema de notificação automatizado por enquanto.
    * **O que ficou simplificado (para depois):** A regra de manutenção a cada 250 horas e as permissões de acesso específicas (Master/Administrador) não serão automatizadas ou impostas pelo sistema nesta versão inicial.