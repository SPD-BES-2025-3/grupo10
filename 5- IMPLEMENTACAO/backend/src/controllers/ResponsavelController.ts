import ResponsavelRepository from "../repositories/ResponsavelRepository";
import { NextFunction, Request, Response } from "express";

class ResponsavelController {
    async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const getAllResponsavel = await ResponsavelRepository.findAll();

            if (getAllResponsavel) {
                res.status(200).json(getAllResponsavel);
            } else {
                res.status(400).json({ message: "Não foi possível localizar os responsáveis!" })
            }
        } catch (error) {
            next(error);
        }
    }

    async show(req: Request, res: Response, next: NextFunction) {
        const responsavelId = req.params.id;

        try {
            const getResponsavel = await ResponsavelRepository.findbyId(responsavelId);

            if (getResponsavel) {
                res.status(200).json({ message: "responsavel encontrado!", data: getResponsavel });
            } else {
                res.status(400).send({ message: "responsavel não encontrado!" })
            }

        } catch (error) {
            next(error);
        }
    }

    async storage(req: Request, res: Response, next: NextFunction): Promise<void> {
        
        try {
            const newResponsavel = req.body;
            const data = await ResponsavelRepository.create(newResponsavel);
            
            res.status(201).json({ message: "Usuario criado com sucesso!", data: data });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const ResponsavelId = req.params.id;
        const data = req.body;
        
        try {
            const updatedResponsavel = await ResponsavelRepository.update(ResponsavelId, data);
            
            if(updatedResponsavel){
                res.status(200).json({message: "Usuario atualizado com sucesso!", data: updatedResponsavel})
            }else{
                res.status(400).send({message: "Não foi possível atualizar o responsavel!"})
            }

        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await ResponsavelRepository.delete(req.params.id);
            res.status(200).json({ message: "Usuario deletado com sucesso!" });
        } catch (error) {
            next(error);
        }
    }

}

export default new ResponsavelController();