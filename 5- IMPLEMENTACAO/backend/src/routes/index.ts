// src/routes/index.ts

import express, { Request, Response, Router } from "express"; // Importe 'Router' também
import { maquinarioRoute } from "./maquinario/maquinarioRoutes";
import { manutencaoRoute } from "./manutencao/manutencaoRoutes";
import { responsavelRoute } from "./responsavel/responsavelRoutes";
import { estoqueRoute } from "./estoque/estoqueRoutes";
import { dashboardRoute } from "./dashboard/dashboardRoute";

const routes = (app: express.Application) => {
    app.route("/api").get((req: Request, res: Response) => {
        const message = "";
        res.send(message || "Route not found");
    });

    app.use(
        "/api",
        maquinarioRoute as Router,
        manutencaoRoute as Router,
        responsavelRoute as Router,
        estoqueRoute as Router,
        dashboardRoute as Router
    );
}

export default routes;