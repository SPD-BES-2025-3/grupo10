# 3. Design do Sistema

Esta pasta contém os artefatos de design de baixo nível que detalham a estrutura interna das classes e as interações entre os componentes do **Sistema de Gerenciamento de Estoque e Frota (SGEMF)**.

## 1. Diagrama de Classes

O Diagrama de Classes a seguir detalha as principais entidades do domínio, seus atributos, e os relacionamentos entre elas. Ele serve como o projeto fundamental para a criação dos nossos *Models* na camada de persistência e das interfaces no código.

![Diagrama de Classes do Sistema](./Diagrama%20de%20Classes.png)

### Principais Entidades:

* **Maquinario:** Representa o cadastro principal de cada máquina na frota.
* **Produto:** Representa cada item ou peça no estoque.
* **Manutencao:** Modela os registros de manutenção associados a um maquinário e a um responsável.
* **Responsavel:** Define os funcionários que podem ser atribuídos a manutenções.
* **Fornecedor:** Entidade que fornece tanto maquinários quanto produtos.
* **MaquinarioProduto:** Tabela associativa que resolve a relação N:M entre `Maquinario` e `Produto`, indicando quais produtos são usados em quais máquinas.

---

## 2. Diagramas de Sequência

Os diagramas de sequência ilustram como os diferentes componentes do sistema colaboram para executar um caso de uso específico. Eles mostram a troca de mensagens entre objetos ao longo do tempo.

### 2.1. Fluxo de CRUD - Maquinário

Este diagrama detalha o fluxo de interação para as operações de Criar, Ler, Atualizar e Deletar um maquinário, começando pela ação do usuário na interface até a operação no banco de dados.

![Diagrama de Sequência para Maquinário](./Fluxo%20de%20Cadastro%20de%20Maquinário.png)

### 2.2. Fluxo de CRUD - Produto

Similar ao fluxo de maquinário, este diagrama foca nas interações necessárias para gerenciar os itens do estoque (Produtos).

![Diagrama de Sequência para Produto](./Fluxo%20de%20Cadastro%20de%20Item%20de%20Estoque.png)

### 2.3. Fluxo de CRUD - Manutenção

Este diagrama ilustra o caso de uso específico de agendar ou registrar uma manutenção. Ele demonstra a interação entre as entidades `Maquinario`, `Responsavel` e `Manutencao`.

![Diagrama de Sequência para Manutenção](./Fluxo%20de%20Cadastro%20de%20Manutenção.png)

### 2.4. Fluxo de CRUD - Responsavel

Este diagrama ilustra o caso de interação para gerenciar responsáveis.

![Diagrama de Sequência para Responsavel](./Fluxo%20de%20Cadastro%20de%20Responsável.png)
