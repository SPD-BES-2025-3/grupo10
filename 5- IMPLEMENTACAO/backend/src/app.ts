/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import routes from "./routes/index";
import { errorMiddleware } from "./middleware/error";
import { page404middleware } from "./middleware/notFound";
import cors from 'cors';

export const app = express();
app.use(express.json())

app.use(cors());

// Rotas do aplicativo
routes(app);

// Middleware para a pagina 404
app.use(page404middleware);

// Middleware de erros
app.use(errorMiddleware);