import MaquinarioRepository from "../repositories/MaquinarioRepository";
import { NextFunction, Request, Response } from "express";

class MaquinarioController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const maquinarios = await MaquinarioRepository.findAll();
            res.status(200).json(maquinarios);
        } catch (error) {
            next(error);
        }
    }

    async show(req: Request, res: Response, next: NextFunction) {
        try {
            const maquinarioId = req.params.id;
            const maquinario = await MaquinarioRepository.findById(maquinarioId);
            if (!maquinario) {
                res.status(404).json({ message: "Maquinário não encontrado." });
            }
            res.status(200).json(maquinario);
        } catch (error) {
            next(error);
        }
    }

    async storage(req: Request, res: Response, next: NextFunction) {
        try {
            const novoMaquinario = await MaquinarioRepository.create(req.body);
            res.status(201).json({ message: "Maquinário criado com sucesso!", data: novoMaquinario });
        } catch (error: any) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.numeroSerie) {
                res.status(409).json({ message: "Erro: O número de série informado já está cadastrado." });
            }
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const maquinarioId = req.params.id;
            const data = req.body;
            const maquinarioAtualizado = await MaquinarioRepository.update(maquinarioId, data);
            if (!maquinarioAtualizado) {
                res.status(404).json({ message: "Maquinário não encontrado para atualizar." });
            }
            res.status(200).json({ message: "Maquinário atualizado com sucesso!", data: maquinarioAtualizado });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const maquinarioId = req.params.id;
            const maquinario = await MaquinarioRepository.findById(maquinarioId);
             if (!maquinario) {
                res.status(404).json({ message: "Maquinário não encontrado para deletar." });
            }
            await MaquinarioRepository.delete(maquinarioId);
            res.status(200).json({ message: "Maquinário deletado com sucesso!" });
        } catch (error) {
            next(error);
        }
    }
}

export default new MaquinarioController();
