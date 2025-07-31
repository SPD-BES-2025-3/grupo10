# Dicionário de Dados (MongoDB)

Este documento detalha as coleções e os campos utilizados no banco de dados MongoDB do sistema.

---

## Coleção: `responsaveis`

Armazena os dados dos colaboradores que podem ser responsáveis por manutenções.

| Campo       | Descrição                          | Tipo de Dado (Mongoose) | Observações                                  |
|-------------|-------------------------------------|--------------------------|-----------------------------------------------|
| _id         | Identificador único do documento    | ObjectId                | Chave primária, gerada automaticamente       |
| nome        | Nome completo do responsável        | String                  | Obrigatório                                   |
| cpf         | CPF do responsável                  | String                  | Obrigatório, Único                            |
| email       | E-mail de contato do responsável    | String                  | Obrigatório, Único                            |
| telefone    | Telefone de contato                 | String                  | Opcional                                      |
| cargo       | Cargo do responsável                | String                  | Obrigatório, Enum                             |
| createdAt   | Data de criação do registro         | Date                    | Gerado automaticamente                        |
| updatedAt   | Data da última atualização          | Date                    | Gerado automaticamente                        |

---

## Coleção: `maquinarios`

Armazena os dados de cada máquina da frota.

| Campo         | Descrição                           | Tipo de Dado (Mongoose) | Observações               |
|---------------|--------------------------------------|--------------------------|----------------------------|
| _id           | Identificador único do documento     | ObjectId                | Chave primária             |
| tipo          | Tipo do maquinário (ex: Trator)      | String                  | Obrigatório                |
| marca         | Fabricante do maquinário             | String                  | Obrigatório                |
| modelo        | Modelo específico do maquinário      | String                  | Obrigatório                |
| numeroSerie   | Número de série único                 | String                  | Obrigatório, Único         |
| anoFabricacao | Ano de fabricação                    | Number                  | Obrigatório                |
| status        | Status operacional da máquina         | String                  | Obrigatório, Enum          |

---

## Coleção: `manutencoes`

Armazena os registros de manutenção.

| Campo          | Descrição                             | Tipo de Dado (Mongoose) | Observações                   |
|----------------|----------------------------------------|--------------------------|--------------------------------|
| _id            | Identificador único do documento       | ObjectId                | Chave primária                 |
| titulo         | Título breve da manutenção             | String                  | Obrigatório                    |
| observacao     | Descrição detalhada do serviço         | String                  | Obrigatório                    |
| dataAgendada   | Data em que a manutenção foi agendada | Date                    | Obrigatório                    |
| dataRealizada  | Data em que a manutenção foi concluída | Date                    | Opcional                       |
| status         | Status atual da manutenção             | String                  | Obrigatório, Enum              |
| custoEstimado  | Custo previsto para a manutenção       | Number                  | Obrigatório                    |
| maquinario     | Referência ao maquinário               | ObjectId                | `ref: 'Maquinario'`            |
| responsavel    | Referência ao responsável              | ObjectId                | `ref: 'Responsavel'`           |

---

## Coleção: `estoques` (Documento Único)

Contém o inventário geral. Geralmente, haverá apenas um documento nesta coleção.

| Campo     | Descrição                    | Tipo de Dado (Mongoose) | Observações               |
|-----------|-------------------------------|--------------------------|----------------------------|
| _id       | Identificador único do documento | ObjectId                | Chave primária             |
| nome      | Nome do inventário           | String                  | Padrão: "Estoque Geral"    |
| itens     | Array de itens no estoque    | Array\<Object\>         | Subdocumentos              |

### Subdocumento: `itens`

| Campo         | Descrição                         | Tipo de Dado (Mongoose) | Observações               |
|---------------|------------------------------------|--------------------------|----------------------------|
| produto       | Referência ao produto              | ObjectId                | `ref: 'Produto'`           |
| quantidade    | Quantidade atual em estoque        | Number                  | Obrigatório                |
| estoqueMinimo | Nível mínimo de alerta             | Number                  | Obrigatório                |

---

## Coleção: `produtos`

Catálogo de todos os produtos que podem existir no estoque.

| Campo         | Descrição                             | Tipo de Dado (Mongoose) | Observações               |
|---------------|----------------------------------------|--------------------------|----------------------------|
| _id           | Identificador único do documento       | ObjectId                | Chave primária             |
| nome          | Nome do produto/peça                   | String                  | Obrigatório                |
| descricao     | Descrição do produto                   | String                  | Opcional                   |
| codigoItem    | Código único do produto (SKU)          | String                  | Único, Opcional            |
| precoUnitario | Preço de custo do produto              | Number                  | Obrigatório                |
| categoria     | Categoria do produto                   | String                  | Obrigatório, Enum          |
