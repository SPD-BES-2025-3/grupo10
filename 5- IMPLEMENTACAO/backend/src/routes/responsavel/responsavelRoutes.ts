import express from 'express';
import ResponsavelController from '../../controllers/ResponsavelController';


export const responsavelRoute = express.Router();

responsavelRoute.get("/responsavel", (req, res, next) => ResponsavelController.index(req, res, next));
responsavelRoute.get("/responsavel/:id", (req, res, next) => ResponsavelController.show(req, res, next));
responsavelRoute.post("/responsavel", (req, res, next) => ResponsavelController.storage(req, res, next));
responsavelRoute.put("/responsavel/:id", (req, res, next) => ResponsavelController.update(req, res, next));
responsavelRoute.delete("/responsavel/:id", (req, res, next) => ResponsavelController.delete(req, res, next));