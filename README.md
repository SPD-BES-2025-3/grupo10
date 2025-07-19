# DOCUMENTO DE ESPECIFICAÇÃO DE REQUISITOS DE SOFTWARE

# VISÃO GERAL

O Sistema de Gerenciamento de Estoque e Manutenção de Maquinários é uma solução completa para o controle de ativos. Ele permite aos usuários gerenciar o estoque de produtos, a frota de maquinários e o registro de colaboradores.

## OBJETIVOS DO PROJETO

1. Gerenciar o estoque de itens
2. Gerenciar a frota de maquinários
3. Gerenciar o acesso de colaboradores ao sistema
4. Fornecer relatórios
5. Ter uma página dedicada para dashboards

## REQUISITOS FUNCIONAIS

RF1 - O sistema deve permitir o cadastro de itens do estoque<br/>
RF2 - O sistema deve permitir a busca de itens do estoque<br/>
RF3 - O sistema deve permitir a atualização de informações de itens do estoque<br/>
RF4 - O sistema deve permitir exclusão de itens do estoque<br/>
RF5 - O sistema deve permitir o cadastro de maquinários do estoque<br/>
RF6 - O sistema deve permitir a busca de maquinários do estoque<br/>
RF7 - O sistema deve permitir a atualização de informações de maquinários do estoque<br/>
RF8 - O sistema deve permitir exclusão de maquinários do estoque<br/>
RF9 - O sistema deve disponibilizar ao usuário uma forma de ativar ou desativar um maquibário da frota, alterando seu status.<br/>
~~RF10 - O sistema deve permitir o cadastro ou remoção de colaboradores, desde que o mesmo seja feito pelos usuários com as devidas permissões.~~<br/>
~~RF11 - O sistema deve fornecer relatórios sobre informações relevantes sobre o sistema.~~<br/>
RF12 - O sistema deve ter uma página de dashboards dedicada a apresentação de informações.<br/>
RF13 - O sistema deve ter uma página de maquinário dedicada a apresentação de informações.<br/>
RF14 - O sistema deve ter uma página de estoque dedicada a apresentação de informações.<br/>

## REQUISITOS DE QUALIDADE

RQ1 - <SEGURANÇA> O Sistema deve guardar as informações dos colaboradores de maneira segura, respeitando a LGPD.<br/>
RQ2 - <DISPONIBILIDADE> O Sistema deve estar disponível 99,9% do tempo, com no máximo 5 minutos de inoperabilidade, salvo seja por manutenções programadas.<br/>
RQ3 - <PERFORMANCE> O sistema deve apresentar todas as informações em no máximo 0,3 segudnos ao usuário, independente de qual infromação ele esteja requisitando.<br/>

## REGRAS DE NEGOCIO

RN1 - Um item do estoque não pode ser negativo<br/>
RN2 - Não deve haver duplicidade de itens ou maquinários<br/>
RN3 - Um maquinário deve, obrigatóriamente, ter um registro de manutenção a cada 250 horas<br/>
RN4 - Somente colaboradores do tipo "Master" ou "Adiministrador" podem criar ou desativar cadastros<br/>
RN5 - A quantidade mínima de um item para notificação é de 10 unidades<br/>

## CRONOGRAMA DE DESENVOLVIMENTO

### MODELAGEM
|ATIVIDADE|PREVISAO DE TERMINO|
|---|---|
|DEFINIO DOS REQUISITOS | 18/07 |
|DIAGRAMA DE CASOS DE USO | 18/07 |
|DOCUMENTAÇÃO DA ARQUITETURA DO SISTEMA| 18/07|
|DIAGRAMA DE ARQUITETURA | 18/07 |
|DIAGRAMA DE CLASSES REFINADO| 18/07 |
|DIAGRAMA DE SEQUENCIA | 18/07 |
|DIAGRAMA ENTIDADE RELACIONAMENTO | 19/07 |
|DICIONARIO DE DADOS | 19/07|
|MAPEAMENTO ENTIDADE RELACIONAMENTO | 19/07|
|PROTOTIPO DAS TELAS | 19/07|

### IMPLEMENTAÇÃO DA SOLUÇÃO
|ATIVIDADE|PREVISAO DE TERMINO|
|---|---|
|CRIAÇÃO DO PROJETO| 20/07 |
|CRUD ITENS E MAQUINARIOS| 21/07 |
|CRIAÇÃO DO DASHBOARD | 22/07 |
|CRIAÇÃO DAS CRIAÇÃO DAS TELAS DE MAQUINÁRIOS | 24/07 |
|CRIAÇÃO DAS CRIAÇÃO DAS TELAS DE ESTOQUE | 24/07 |
|INTEGRAÇÃO BACKEND COM FRONTEND | 27/07 |
|REFINAMENTO E TESTES | 27/07 |
| APRESENTAÇÃO | 28/07 |

## STACKS

Tipo de aplicação: WEB local
Tecnologia frontend: NextJS
Tecnologia backend: Java ou Typescript
Modelo de persistência: Hibrido (SQL e NoSQL)
Banco de dados: PostgreSQL e MongoDB
Gerenciamento de entregas: Trello