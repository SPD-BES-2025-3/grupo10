# USUARIO

| DADO   | DESCRIÇÃO                  | TIPO              |
| ------ | -------------------------- | ----------------- |
| id     | Id do usuário | varchar(32)      |
| nome   | Nome do usuário do sistema | varchar(256)      |
| email  | E-mail do usuário          | varchar(256)      |
| perfil | Tipo de perfil do usuário  | TipoPerfil (enum) |

# Maquinario

|DADO|DESCRIÇÃO|TIPO|
|-------|-------|-------|
|id|Id do maquinário| varchar(32)|
|tipo|Tipo do maquinario (ex: escavadeira)| varchar(32)|
|marca|Marca do maquinario|varchar(32)|
|modelo|Modelo do maquinario|varchar(64)|
|anoFabricacao|Ano de fabriação do maquinário, sem formatação|int|
|numeroSerie|Numero de serie do maquinario (opcional)|varchar(64), NULL permitido|

# Produto

| DADO           | DESCRIÇÃO                                   | TIPO         |
| -------------- | ------------------------------------------- | ------------ |
| id             | Id do produto | varchar(32) |
| nome           | Nome do produto                             | varchar(256) |
| descricao      | Descrição do produto (máx 100 caracteres)   | varchar(256) |
| codigoItem     | Código identificador do item (máx 15 chars) | varchar(16)  |
| quantidadeItem | Quantidade disponível no estoque (não nulo) | int          |
| unidadeMedida  | Unidade de medida (máx 8 caracteres)        | varchar(8)   |
| precoCusto     | Preço do item (não nulo)                    | decimal      |
