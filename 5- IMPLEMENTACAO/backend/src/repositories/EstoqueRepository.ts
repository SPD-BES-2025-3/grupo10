import mongoose from "mongoose";
import { Estoque, IEstoqueGeralProps, IEstoqueProps } from "../models/Estoque";
import { Produto, IProdutoProps } from "../models/Produto";
import RedisPublisher from '../events/redisPublisher';

class EstoqueRepository {
    async findEstoqueGeral(nomeInventario: string = "Estoque Geral"): Promise<IEstoqueGeralProps | null> {
        try {
            return await Estoque.findOne({ nomeInventario }).populate('itens.produto');
        } catch (error) {
            console.error("Erro ao buscar estoque geral:", error);
            throw new Error("Não foi possível buscar o estoque geral.");
        }
    }

    async createEstoqueGeral(nomeInventario: string = "Estoque Geral"): Promise<IEstoqueGeralProps> {
        try {
            const novoEstoque = new Estoque({ nomeInventario, itens: [] });
            const savedEstoque = await novoEstoque.save();

            await RedisPublisher.publishOperation({
                entity: 'Estoque',
                operation: 'CREATE',
                data: savedEstoque.toObject()
            });

            return savedEstoque;
        } catch (error) {
            console.error("Erro ao criar estoque geral:", error);
            throw new Error("Não foi possível criar o estoque geral.");
        }
    }

    async deleteEstoqueGeral(_id: string): Promise<IEstoqueGeralProps | null> {
        try {
            const deletedEstoque = await Estoque.findByIdAndDelete(_id);

            if (deletedEstoque) {
                await RedisPublisher.publishOperation({
                    entity: 'Estoque',
                    operation: 'DELETE',
                    data: deletedEstoque.toObject()
                });
            }

            return deletedEstoque;
        } catch (error) {
            console.error("Erro ao deletar estoque geral:", error);
            throw new Error("Não foi possível deletar o estoque geral.");
        }
    }

    async findProdutoNoEstoqueGeral(produtoId: string, nomeInventario: string = "Estoque Geral"): Promise<IEstoqueProps | null> {
        try {
            const objectIdProduto = new mongoose.Types.ObjectId(produtoId);
            const estoqueGeral = await Estoque.findOne(
                {
                    nomeInventario,
                    "itens.produto": objectIdProduto
                },
                { "itens.$": 1 }
            ).populate('itens.produto');

            if (!estoqueGeral || estoqueGeral.itens.length === 0) {
                return null;
            }
            return estoqueGeral.itens[0] || null;
        } catch (error) {
            console.error("Erro ao buscar produto no estoque geral:", error);
            throw new Error("Não foi possível buscar o produto no estoque.");
        }
    }

    async sumTotalValueEstoque(): Promise<number> {
        const sum = await Estoque.aggregate([
            { $match: { nomeInventario: "Estoque Geral" } },
            { $unwind: "$itens" },
            { $lookup: { from: "produtos", localField: "itens.produto", foreignField: "_id", as: "produtoInfo" } },
            { $unwind: "$produtoInfo" },
            { $group: { _id: "$_id", valorTotal: { $sum: { $multiply: ["$itens.quantidade", "$produtoInfo.precoUnitario"] } } } }
        ]);
        return sum.length > 0 ? sum[0].valorTotal : 0;
    }

    async addOrUpdateProdutoEstoque(
    produtoData: {
        produtoId?: string;
        codigoItem?: string;
        nome?: string;
        precoUnitario?: number;
        categoria?: string; // Adicionado categoria
    },
    quantidade: number,
    estoqueMinimo: number
): Promise<IEstoqueGeralProps> {
    try {
        let produtoExistente;

        if (produtoData.produtoId) {
            produtoExistente = await Produto.findById(produtoData.produtoId);
        } else if (produtoData.codigoItem) {
            produtoExistente = await Produto.findOne({ codigoItem: produtoData.codigoItem });
        }

        // Se não existir, tenta criar
        // Validando a presença de nome, codigoItem, precoUnitario e categoria
        if (
            !produtoExistente &&
            produtoData.nome &&
            produtoData.codigoItem &&
            (produtoData.precoUnitario !== undefined && produtoData.precoUnitario !== null) && // Verifica se precoUnitario é definido e não nulo
            produtoData.categoria // Verifica se categoria é definida
        ) {
            produtoExistente = await Produto.create({
                nome: produtoData.nome,
                codigoItem: produtoData.codigoItem,
                precoUnitario: produtoData.precoUnitario,
                categoria: produtoData.categoria, // Passa categoria para criação
            });
        }

        if (!produtoExistente) {
            // Mensagem de erro mais específica
            throw new Error("Produto não encontrado e dados insuficientes para criação (Nome, CodigoItem, Preço Unitário e Categoria são obrigatórios para um novo produto).");
        }

        // Busca o estoque geral
        const estoqueGeral = await Estoque.findOne({ nomeInventario: "Estoque Geral" });

        if (!estoqueGeral) {
            throw new Error("Estoque Geral não encontrado.");
        }

        // Verifica se o produto já está no estoque
        const indexItem = estoqueGeral.itens.findIndex(item =>
            item.produto.toString() === produtoExistente._id.toString()
        );

        if (indexItem !== -1) {
            // Atualiza item existente
            estoqueGeral.itens[indexItem].quantidade = quantidade;
            estoqueGeral.itens[indexItem].estoqueMinimo = estoqueMinimo;
        } else {
            // Adiciona novo item
            estoqueGeral.itens.push({
                produto: produtoExistente._id,
                quantidade,
                estoqueMinimo
            });
        }

        const estoqueAtualizado = await estoqueGeral.save();

        await RedisPublisher.publishOperation({
            entity: 'Estoque',
            operation: 'UPDATE',
            data: estoqueAtualizado.toObject()
        });

        return estoqueAtualizado;
    } catch (error) {
        console.error("Erro ao adicionar/atualizar produto no estoque:", error);
        // Lança o erro original ou uma mensagem mais genérica se não for uma validação
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Não foi possível adicionar/atualizar o produto no estoque.");
    }
}

    async removeProdutoDoEstoque(produtoId: string, nomeInventario: string = "Estoque Geral"): Promise<IEstoqueGeralProps | null> {
        try {
            const objectIdProduto = new mongoose.Types.ObjectId(produtoId);

            const updatedEstoque = await Estoque.findOneAndUpdate(
                { nomeInventario },
                { "$pull": { itens: { produto: objectIdProduto } } },
                { new: true }
            );

            if (updatedEstoque) {
                await RedisPublisher.publishOperation({
                    entity: 'Estoque',
                    operation: 'UPDATE',
                    data: updatedEstoque.toObject()
                });
            }

            return updatedEstoque;
        } catch (error) {
            console.error("Erro ao remover produto do estoque:", error);
            throw new Error("Não foi possível remover o produto do estoque.");
        }
    }
}

export default new EstoqueRepository();
