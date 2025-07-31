// controllers/EstoqueController.ts
import { NextFunction, Request, Response, RequestHandler } from "express";
import EstoqueRepository from "../repositories/EstoqueRepository";

class EstoqueController {
    index: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await EstoqueRepository.findEstoqueGeral();
            return res.status(200).json(result) as unknown as void;
        } catch (error) {
            next(error);
        }
    }

    show: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.params.id;
            const product = await EstoqueRepository.findProdutoNoEstoqueGeral(productId);

            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado no estoque." }) as unknown as void;
            }

            return res.status(200).json(product) as unknown as void;
        } catch (error) {
            next(error);
        }
    }

    storage: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                produtoId,
                codigoItem,
                nome,
                precoUnitario,
                categoria, // Incluído categoria
                quantidade,
                estoqueMinimo,
            } = req.body;

            const response = await EstoqueRepository.addOrUpdateProdutoEstoque(
                { produtoId, codigoItem, nome, precoUnitario, categoria }, // Passa categoria
                quantidade,
                estoqueMinimo
            );

            return res.status(201).json(response) as unknown as void;
        } catch (error) {
            console.error("Erro ao armazenar produto no estoque:", error); // Log mais específico
            next(error); // Passa o erro para o próximo middleware de erro
        }
    }

    update: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const produtoId = req.params.id; // O ID na URL é o _id real do produto
            const {
                codigoItem,
                nome,
                precoUnitario,
                categoria, // Incluído categoria
                quantidade,
                estoqueMinimo,
            } = req.body;

            const response = await EstoqueRepository.addOrUpdateProdutoEstoque(
                { produtoId, codigoItem, nome, precoUnitario, categoria }, // Passa categoria
                quantidade,
                estoqueMinimo
            );

            if (!response) {
                return res.status(400).json({ message: "Não foi possível atualizar o produto no estoque." }) as unknown as void;
            }

            return res.status(200).json(response) as unknown as void;
        } catch (error) {
            console.error("Erro ao atualizar produto no estoque:", error); // Log mais específico
            next(error); // Passa o erro para o próximo middleware de erro
        }
    }

    delete: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const produtoId = req.params.id;
            const nomeInventario = "Estoque Geral";

            const response = await EstoqueRepository.removeProdutoDoEstoque(produtoId, nomeInventario);

            if (!response) {
                return res.status(404).json({ message: "Produto não encontrado no estoque ou estoque geral inexistente." }) as unknown as void;
            }

            return res.status(200).json({ message: "Produto removido do estoque com sucesso.", estoqueAtualizado: response }) as unknown as void;
        } catch (error) {
            next(error);
        }
    }
}

export default new EstoqueController();
