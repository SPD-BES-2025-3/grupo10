# PLANO DE TESTE FUNCIONAL - PRODUTOS

| CASO DE TESTE | REQUISITO | ENTRADA | RESULTADO ESPERADO | RESULTADO OBTIDO | STATUS |
| ------------- | --------- | ------- | ------------------ | ------------ | ------ |
| CT-1             | [CRIAR] Cadastrar um produto com todos os dados válidos e obrigatórios | Dados válidos para o produto | Mensagem de sucesso, produto aparece na lista de visualização | | |
| CT-2             | 	[CRIAR] Cadastrar um produto com campos obrigatórios nulos | Nome = Null ou codigoItem = Null | Mensagem de erro de campo obrigatório para cada campo | | |
| CT-4             | [VALIDAÇÃO] Validar tipo de dado para quantidade, precoCusto e estoqueminimo | quantidade = "1a" ou precoCusto = "1.58ABC" ou estoqueMinimo = "50DEFGH" | Mensagem de erro informando dados inválidos | | |
| CT-5             | [LISTAR] Exibir a lista de produtos do estoque | Acesso à página de estoque | Todos os produtos do estoque são exibidos corretamente | | |
| CT-6             | [EDITAR] Editar os dados de um produto existente | Alteração em um ou mais campos, como nome ou quantidade| Mensagem de sucesso, dados do produto são atualizados na lista | | |
| CT-7             | [EDITAR] Editar um produto com dados inválidos | Alteração de quantidade para um valor nulo ou negativo | Mensagem de erro de campo obrigatório ou dado inválido | | |
| CT-8             | [EXCLUIR] Excluir um produto com sucesso | Click no botão de apagar um produto | Mensagem de sucesso e o produto não aparece mais na lista | | |
| CT-9             | [RELAÇÃO] Validar o vínculo com o fornecedor | Seleção de um Fornecedor existente | O maquinário ou produto é cadastrado com o fornecedor correto | | |