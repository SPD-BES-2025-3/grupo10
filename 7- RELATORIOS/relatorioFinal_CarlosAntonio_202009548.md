# Relatório Individual de Implementação do Projeto

**Autor:** Carlos  
**Projeto:** Sistema de Gerenciamento de Estoque e Manutenção de Maquinários  
**Período:** Julho de 2025

---

## Introdução

Este relatório descreve minha trajetória e aprendizados durante o desenvolvimento do *Sistema de Gerenciamento de Manutenção*. O objetivo principal do projeto era criar uma aplicação web completa, mas, para mim, o objetivo pessoal era entender na prática como as diferentes partes de um sistema de software se conectam e funcionam juntas.

---

## A Trajetória de Desenvolvimento

A jornada foi completa, cobrindo todo o ciclo de vida do desenvolvimento de software, o que foi uma experiência fantástica.

### Planejamento e Arquitetura

Começamos com a base de tudo: a documentação. Definir os requisitos, criar os diagramas de caso de uso, de arquitetura (C4) e de entidade e relacionamento (MER) foi fundamental para ter uma visão clara do que precisava ser construído.  
A decisão de usar **Node.js com Express** para o backend, **Next.js** para o frontend, **MongoDB** como banco de dados e, principalmente, **Redis** para eventos, moldou todo o projeto.

### Implementação do Backend

Esta foi a fase onde muitos conceitos teóricos se tornaram práticos.  
Criei os **models** com *Mongoose*, desenvolvi os **controllers** para cada rota da API e, o mais importante, a camada de **repositories**.  
Foi no repositório que a mágica aconteceu: após cada operação no banco de dados, eu disparei um evento para o Redis. Ver isso funcionando pela primeira vez foi um momento *"eureka"*.

### Desenvolvimento do Frontend

Construir a interface com **React** e **Next.js** foi desafiador e recompensador.  
Conectar cada formulário e botão aos endpoints do backend, lidar com o estado dos componentes e garantir que os dados fossem exibidos corretamente me deu uma visão clara de como a camada de apresentação realmente funciona.  
Depurar os erros, como campos que não eram enviados corretamente (*cpf*, *cargo*), foi um grande aprendizado.

### Testes e Validação

A criação dos testes unitários e de integração para o backend com **Jest** e **Supertest** foi a etapa que consolidou a qualidade do projeto.  
Ver todos os testes passando me deu a confiança de que a base do sistema estava sólida e pronta para evoluir.

---

## Principais Aprendizados

Esta foi, sem dúvida, uma das experiências mais valiosas que já tive.

### A Conexão Backend-Frontend

Antes, a integração entre o backend e o frontend era um conceito um pouco abstrato para mim.  
Agora, eu entendo na prática como uma **API RESTful** funciona, como os dados são solicitados pelo cliente, processados no servidor e devolvidos como JSON para serem renderizados na tela.  
Eu vi o fluxo completo, da ação do usuário até a consulta no banco de dados e o retorno para a interface.

### O Ciclo de Vida do Software

Passei por todas as etapas de um projeto real: levantei os requisitos, desenhei a arquitetura, implementei, testei e documentei.  
Ter essa visão 360° foi incrível e me deu uma compreensão muito mais profunda do que significa ser um desenvolvedor de software.

### Arquitetura Orientada a Eventos

A integração com o Redis não foi apenas um requisito técnico.  
Foi uma lição prática sobre como construir sistemas **desacoplados e escaláveis**.  
Entender o padrão **Pub/Sub** e implementá-lo me abriu os olhos para uma nova forma de pensar em arquitetura.

---

## Conclusão

Sou muito grato por esta experiência. Este projeto não foi apenas sobre entregar um software funcional; foi sobre **clarear dúvidas fundamentais** e construir uma base de conhecimento sólida.  
A jornada, com seus desafios e sucessos, foi extremamente enriquecedora e me sinto muito mais preparado e confiante como desenvolvedor.
