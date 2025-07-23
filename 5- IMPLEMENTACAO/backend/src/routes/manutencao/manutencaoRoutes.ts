import express from 'express';
import ManutencaoController from '../../controllers/ManutencaoController';

export const manutencaoRoute = express.Router();

manutencaoRoute.get("/manutencao", ManutencaoController.index);
manutencaoRoute.get("/manutencao/:id", ManutencaoController.show);
manutencaoRoute.post("/manutencao/", ManutencaoController.storage);
manutencaoRoute.put("/manutencao/:id", ManutencaoController.update);
manutencaoRoute.delete("/manutencao/:id", ManutencaoController.delete);