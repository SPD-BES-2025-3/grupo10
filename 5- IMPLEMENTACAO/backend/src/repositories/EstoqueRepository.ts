import mongoose from "mongoose";
import { Estoque, IEstoqueGeralProps, IEstoqueProps } from "../models/Estoque";
import { Produto, IProdutoProps } from "../models/Produto";

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
            return await novoEstoque.save();
        } catch (error) {
            console.error("Erro ao criar estoque geral:", error);
            throw new Error("Não foi possível criar o estoque geral.");
        }
    }

    async deleteEstoqueGeral(_id: string): Promise<IEstoqueGeralProps | null> {
        try {
            return await Estoque.findByIdAndDelete(_id);
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

    async addOrUpdateProdutoEstoque(
        produtoData: { produtoId?: string; codigoItem?: string; nome?: string; precoUnitario?: number; },
        quantidade: number,
        estoqueMinimo: number,
        nomeInventario: string = "Estoque Geral"
    ): Promise<IEstoqueGeralProps> {
        try {
            let actualProductId: mongoose.Types.ObjectId;

            if (produtoData.produtoId) {
                actualProductId = new mongoose.Types.ObjectId(produtoData.produtoId);
            } else if (produtoData.codigoItem) {
                let produtoExistente = await Produto.findOne({ codigoItem: produtoData.codigoItem });

                if (!produtoExistente) {
                    if (!produtoData.nome || !produtoData.precoUnitario) {
                        throw new Error("Nome e Preço Unitário são obrigatórios para criar um novo produto com CodigoItem.");
                    }
                    produtoExistente = await Produto.create({
                        nome: produtoData.nome,
                        codigoItem: produtoData.codigoItem,
                        precoUnitario: produtoData.precoUnitario
                    });
                }
                actualProductId = produtoExistente._id;
            } else {
                throw new Error("É necessário fornecer um produtoId ou um codigoItem.");
            }

            const updatedEstoque = await Estoque.findOneAndUpdate(
                {
                    nomeInventario,
                    "itens.produto": actualProductId
                }, {
                    "$set": {
                        "itens.$.quantidade": quantidade,
                        "itens.$.estoqueMinimo": estoqueMinimo
                    }
                }, { new: true }
            );

            if (updatedEstoque) {
                return updatedEstoque;
            }

            const newEstoque = await Estoque.findOneAndUpdate(
                { nomeInventario },
                {
                    "$push": {
                        itens: {
                            produto: actualProductId,
                            quantidade,
                            estoqueMinimo
                        }
                    }
                },
                { new: true, upsert: true }
            );

            if (!newEstoque) {
                throw new Error("Não foi possível adicionar o produto ao estoque. Documento de estoque não encontrado ou criado.");
            }

            return newEstoque;

        } catch (error) {
            console.error("Erro ao adicionar/atualizar produto no estoque:", error);
            throw new Error("Não foi possível adicionar/atualizar o produto no estoque.");
        }
    }

    async removeProdutoDoEstoque(produtoId: string, nomeInventario: string = "Estoque Geral"): Promise<IEstoqueGeralProps | null> {
        try {
            const objectIdProduto = new mongoose.Types.ObjectId(produtoId);

            const updatedEstoque = await Estoque.findOneAndUpdate(
                { nomeInventario },
                {
                    "$pull": {
                        itens: {
                            produto: objectIdProduto
                        }
                    }
                },
                { new: true }
            );
            return updatedEstoque;
        } catch (error) {
            console.error("Erro ao remover produto do estoque:", error);
            throw new Error("Não foi possível remover o produto do estoque.");
        }
    }
}

export default new EstoqueRepository();