import express from "express";
import MaquinarioController from "../../controllers/MaquinarioController";

export const maquinarioRoute = express.Router();

maquinarioRoute.get("/maquinario", (req, res, next) => MaquinarioController.index(req, res, next))
maquinarioRoute.get("/maquinario/:id", (req, res, next) => MaquinarioController.show(req, res, next))
maquinarioRoute.post("/maquinario", (req, res, next) => MaquinarioController.storage(req, res, next))
maquinarioRoute.put("/maquinario/:id", (req, res, next) => MaquinarioController.update(req, res, next))
maquinarioRoute.delete("/maquinario/:id", (req, res, next) => MaquinarioController.delete(req, res, next))