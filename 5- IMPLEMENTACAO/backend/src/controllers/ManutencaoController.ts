
import { NextFunction, Request, Response } from "express";
import ManutencaoRepository from "../repositories/ManutencaoRepository";

class ManutencaoController {

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const manutenções = await ManutencaoRepository.index();
            res.status(200).json(manutenções);
        } catch (error) {
            // Encaminha o erro para o middleware de tratamento de erros do Express
            next(error);
        }
    }


    async show(req: Request, res: Response, next: NextFunction) {
        try {
            const manutencaoId = req.params.id; // req.params.id já é string

            const manutencao = await ManutencaoRepository.show(manutencaoId);

            if (!manutencao) {
                res.status(404).json({ message: "Manutenção não encontrada." });
            }

            res.status(200).json(manutencao);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrada") || error.message.includes("inválido")) {
                    res.status(404).json({ message: error.message });
                }
            }
            next(error);
        }
    }

    async storage(req: Request, res: Response, next: NextFunction) {
        try {

            const novaManutencao = await ManutencaoRepository.create(req.body);
            res.status(201).json({ message: "Manutenção criada com sucesso!", data: novaManutencao });
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'ValidationError' || error.message.includes("obrigatório") || error.message.includes("não encontrado")) {
                    res.status(400).json({ message: error.message });
                }
            }
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const manutencaoId = req.params.id; // req.params.id já é string
            const data = req.body; // Dados para atualização

            const manutencaoAtualizada = await ManutencaoRepository.update(manutencaoId, data);

            if (!manutencaoAtualizada) {
                res.status(404).json({ message: "Manutenção não encontrada para atualização." });
            }

            res.status(200).json({ message: "Manutenção atualizada!", data: manutencaoAtualizada });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrada") || error.message.includes("inválido")) {
                    res.status(404).json({ message: error.message });
                }
                if (error.name === 'ValidationError' || error.message.includes("obrigatório")) {
                    res.status(400).json({ message: error.message });
                }
            }
            next(error);
        }
    }


    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await ManutencaoRepository.delete(req.params.id);
            res.status(200).json({ message: "Manutenção deletada com sucesso!" });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrada") || error.message.includes("inválido")) {
                    res.status(404).json({ message: error.message });
                }
            }
            next(error);
        }
    }
}


export default new ManutencaoController();