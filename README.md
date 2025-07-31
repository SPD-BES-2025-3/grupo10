# DOCUMENTO DE ESPECIFICAÇÃO DE REQUISITOS DE SOFTWARE

---

## VISÃO GERAL

O Sistema de Gerenciamento de Estoque e Manutenção de Maquinários é uma solução web para o controle de ativos. Ele permite aos usuários gerenciar o estoque de produtos, a frota de maquinários, o cadastro de responsáveis e o agendamento de manutenções de forma centralizada.

---

## OBJETIVOS DO PROJETO

- Gerenciar o estoque de itens e produtos.
- Gerenciar a frota de maquinários, incluindo seus status operacionais.
- Gerenciar o cadastro de colaboradores responsáveis pelas manutenções.
- Permitir o agendamento e controle de manutenções.
- Fornecer uma visão geral do sistema através de um dashboard.

---

## REQUISITOS FUNCIONAIS

### Módulo de Estoque
- **RF01** - O sistema deve permitir o cadastro de novos produtos no estoque.
- **RF02** - O sistema deve permitir a busca de produtos no estoque.
- **RF03** - O sistema deve permitir a atualização de informações dos produtos (ex: quantidade, estoque mínimo).
- **RF04** - O sistema deve permitir a exclusão de produtos do estoque.

### Módulo de Maquinários
- **RF05** - O sistema deve permitir o cadastro de maquinários na frota.
- **RF06** - O sistema deve permitir a busca de maquinários.
- **RF07** - O sistema deve permitir a atualização de informações dos maquinários.
- **RF08** - O sistema deve permitir a exclusão de maquinários.
- **RF09** - O sistema deve permitir a alteração do status de um maquinário (ex: OPERACIONAL, EM MANUTENÇÃO).

### Módulo de Responsáveis
- **RF10** - O sistema deve permitir o cadastro de responsáveis.
- **RF11** - O sistema deve permitir a edição e exclusão de responsáveis.

### Módulo de Manutenção
- **RF12** - O sistema deve permitir o agendamento de novas manutenções, associando um maquinário a um responsável.
- **RF13** - O sistema deve permitir a atualização e exclusão de manutenções.

### Interface e Visualização
- **RF14** - O sistema deve ter uma página de dashboard para apresentação de dados agregados.
- **RF15** - O sistema deve ter páginas dedicadas para o gerenciamento de Maquinários, Estoque, Responsáveis e Manutenções.

---

## REQUISITOS DE QUALIDADE

- **RQ1** - [SEGURANÇA] O Sistema deve guardar as informações dos colaboradores de maneira segura, respeitando a LGPD.
- **RQ2** - [DISPONIBILIDADE] O Sistema deve estar disponível 99,9% do tempo, com no máximo 5 minutos de inoperabilidade, salvo seja por manutenções programadas.
- **RQ3** - [PERFORMANCE] O sistema deve apresentar todas as informações em no máximo 0,3 segundos ao usuário, independente de qual informação ele esteja requisitando.

---

## REGRAS DE NEGÓCIO

- **RN1** - A quantidade de um item no estoque não pode ser negativa.
- **RN2** - Não deve haver duplicidade de maquinários (pelo `numeroSerie`) ou responsáveis (pelo `cpf` e `email`).
- **RN3** - A quantidade mínima de um item para notificação visual de "estoque baixo" é de 10 unidades.
- **RN4** - Para agendar uma manutenção, é obrigatório associar um maquinário e um responsável existentes.

---

## CRONOGRAMA DE DESENVOLVIMENTO

> *(O cronograma original foi mantido para registro histórico do planejamento.)*

### MODELAGEM

| ATIVIDADE                                 | PREVISÃO DE TÉRMINO | RESPONSÁVEL |
|------------------------------------------|---------------------|-------------|
| DEFINIÇÃO DOS REQUISITOS                 | 18/07               | CARLOS      |
| DIAGRAMA DE CASOS DE USO                 | 18/07               | CARLOS      |
| DOCUMENTAÇÃO DA ARQUITETURA DO SISTEMA   | 18/07               | CARLOS      |
| DIAGRAMA DE ARQUITETURA                  | 18/07               | CARLOS      |
| DIAGRAMA DE CLASSES REFINADO             | 18/07               | CARLOS      |
| DIAGRAMA DE SEQUENCIA                    | 18/07               | CARLOS      |
| DIAGRAMA ENTIDADE RELACIONAMENTO         | 19/07               | CARLOS      |
| DICIONÁRIO DE DADOS                      | 19/07               | CARLOS      |
| MAPEAMENTO ENTIDADE RELACIONAMENTO       | 19/07               | CARLOS      |
| PROTÓTIPO DAS TELAS                      | 19/07               | CARLOS      |

### IMPLEMENTAÇÃO DA SOLUÇÃO

| ATIVIDADE                             | PREVISÃO DE TÉRMINO | RESPONSÁVEL |
|--------------------------------------|---------------------|-------------|
| CRIAÇÃO DO PROJETO                   | 20/07               | CARLOS      |
| CRUD ITENS E MAQUINÁRIOS             | 21/07               | CARLOS      |
| CRIAÇÃO DO DASHBOARD                 | 22/07               | CARLOS      |
| CRIAÇÃO DAS TELAS DE MAQUINÁRIOS     | 24/07               | CARLOS      |
| CRIAÇÃO DAS TELAS DE ESTOQUE         | 24/07               | CARLOS      |
| INTEGRAÇÃO BACKEND COM FRONTEND      | 27/07               | CARLOS      |
| REFINAMENTO E TESTES                 | 27/07               | CARLOS      |
| APRESENTAÇÃO                         | 28/07               | CARLOS      |

---

## STACKS (TECNOLOGIAS UTILIZADAS)

- **Tipo de aplicação**: Aplicação Web (SPA)
- **Tecnologia frontend**: Next.js, React, TypeScript
- **Tecnologia backend**: Node.js, Express, TypeScript
- **Modelo de persistência**: NoSQL
- **Banco de dados**: MongoDB com Mongoose (ODM)
- **Mensageria / Cache**: Redis (para arquitetura Pub/Sub)
- **Gerenciamento de entregas**: Trello
