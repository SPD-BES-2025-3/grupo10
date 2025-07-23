import express, {Request, Response} from "express";
import { userRoute } from "./users/usersRoutes";
import { addressRoute } from "./address/addressRoutes";
import { maquinarioRoute } from "./maquinario/maquinarioRoutes";
import { manutencaoRoute } from "./manutencao/manutencaoRoutes";
import { responsavelRoute } from "./responsavel/responsavelRoutes";


const routes = (app: express.Application) => {
    app.route("/").get((req: Request, res: Response) => {
        const message = "Curso de Node.JS";
        res.send(message || "Route not found");
    })

    app.use(
        userRoute, 
        addressRoute, 
        maquinarioRoute, 
        manutencaoRoute,
        responsavelRoute
    );
}

export default routes;