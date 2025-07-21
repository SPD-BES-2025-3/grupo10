# PLANO DE TESTE FUNCIONAL - MAQUINARIOS

| CASO DE TESTE | REQUISITO | ENTRADA | RESULTADO ESPERADO | RESULTADO OBTIDO | STATUS |
| ------------- | --------- | ------- | ------------------ | ------------ | ------ |
| CT-1             | [CRIAR] Cadastrar um maquinário com todos os dados válidos | Dados válidos para Maquinario, tipo e Fornecedor existente | Mensagem de sucesso, maquinário aparece na lista de visualização | | |
| CT-2             | 	[CRIAR] Cadastrar um maquinário com campos obrigatórios nulos | Marca = Null ou Numero de Serie = Null | Mensagem de erro de campo obrigatório para cada campo | | |
| CT-3             | [VALIDAÇÃO] Validar tamanho mínimo do número de série | Numero de Serie = "1234567" (7 caracteres) | Mensagem de erro informando tamanho mínimo (ex: "Mínimo de 8 caracteres") | | |
| CT-4             | [VALIDAÇÃO] Validar tipo de dado para Ano de Fabricação | Ano de Fabricacao = -2 ou menor | Mensagem de erro informando data inválida | | |
| CT-5             | [LISTAR] Exibir a lista de maquinários | Acesso à página de listagem de maquinários | Todos os maquinários cadastrados são exibidos corretamente | | |
| CT-6             | [EDITAR] Editar os dados de um maquinário existente | Alteração em um ou mais campos, como status ou responsavel | Mensagem de sucesso, dados do maquinário são atualizados na lista | | |
| CT-7             | [EDITAR] Editar um maquinário com dados inválidos | Alteração de Numero de Serie para um valor nulo | Mensagem de erro de campo obrigatório | | |
| CT-8             | [EXCLUIR] Excluir um maquinário com sucesso | Click no botão de apagar um maquinário | Mensagem de sucesso e o maquinário não aparece mais na lista | | |
| CT-9             | [RELAÇÃO] Validar o vínculo com o fornecedor | Seleção de um Fornecedor existente | O maquinário ou produto é cadastrado com o fornecedor correto | | |
| CT-10            | [RELAÇÃO] Validar o vínculo com o manutenção | Criar uma manutenção e associar a um maquinário| A manutenção é associada aomaquinário correto | | |