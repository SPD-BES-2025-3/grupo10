// Seu arquivo de rotas (ex: estoqueRoutes.ts)
import express from 'express';
import EstoqueController from '../../controllers/EstoqueController'; // Importa a instância

export const estoqueRoute = express.Router();

// Vincula 'this' para cada método da instância do controlador
estoqueRoute.get('/estoque', EstoqueController.index);
estoqueRoute.get('/estoque/:id', EstoqueController.show);
estoqueRoute.post('/estoque', EstoqueController.storage);
estoqueRoute.put('/estoque/:id', EstoqueController.update);
estoqueRoute.delete('/estoque/:id', EstoqueController.delete);