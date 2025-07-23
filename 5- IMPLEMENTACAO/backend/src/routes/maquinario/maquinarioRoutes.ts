import express from "express";
import MaquinarioController from "../../controllers/MaquinarioController";

export const maquinarioRoute = express.Router();

maquinarioRoute.get("/maquinario", MaquinarioController.index)
maquinarioRoute.get("/maquinario/:id", MaquinarioController.show)
maquinarioRoute.post("/maquinario", MaquinarioController.storage)
maquinarioRoute.put("/maquinario/:id", MaquinarioController.update)
maquinarioRoute.delete("/maquinario/:id", MaquinarioController.delete)