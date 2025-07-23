import express from 'express';
import ResponsavelController from '../../controllers/ResponsavelController';


export const responsavelRoute = express.Router();

responsavelRoute.get("/responsavel", ResponsavelController.index);
responsavelRoute.get("/responsavel/:id", ResponsavelController.show);
responsavelRoute.post("/responsavel", ResponsavelController.storage);
responsavelRoute.put("/responsavel/:id", ResponsavelController.update);
responsavelRoute.delete("/responsavel/:id", ResponsavelController.delete);