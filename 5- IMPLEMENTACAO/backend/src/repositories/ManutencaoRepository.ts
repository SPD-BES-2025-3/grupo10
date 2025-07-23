// repositories/ManutencaoRepository.ts
import { Manutencao, IManutencao } from "../models/Manutencao";
import { Maquinario } from "../models/Maquinario";
import { Responsavel } from "../models/Responsavel";
import mongoose from "mongoose";

class ManutencaoRepository {
    async index(): Promise<IManutencao[]> {
        try {
            const manutenções = await Manutencao.find({})
                .populate('maquinarioManutencao', 'tipo marca modelo numeroSerie')
                .populate('responsavelManutencao', 'nome email telefone')
                .exec();
            return manutenções;
        } catch (error: any) {
            console.error("Erro no ManutencaoRepository.index:", error);
            throw new Error(`Erro ao listar manutenções: ${error.message}`);
        }
    }

    async show(id: string): Promise<IManutencao | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("ID de Manutenção inválido.");
            }
            const manutencao = await Manutencao.findById(id)
                .populate('maquinarioManutencao', 'tipo marca modelo numeroSerie')
                .populate('responsavelManutencao', 'nome email telefone')
                .exec();
            return manutencao;
        } catch (error: any) {
            console.error("Erro no ManutencaoRepository.show:", error);
            throw new Error(`Erro ao buscar manutenção: ${error.message}`);
        }
    }

    async create(data: Partial<IManutencao>): Promise<IManutencao> {
        try {
            if (!data) {
                throw new Error("Dados para criação da manutenção são obrigatórios.");
            }

            if (data.maquinarioManutencao) {
                const existingMaquinario = await Maquinario.findById(data.maquinarioManutencao);
                if (!existingMaquinario) {
                    throw new Error("Maquinário não encontrado para a manutenção.");
                }
            } else {
                throw new Error("ID do maquinário é obrigatório para a manutenção.");
            }

            if (data.responsavelManutencao) {
                const existingResponsavel = await Responsavel.findById(data.responsavelManutencao);
                if (!existingResponsavel) {
                    throw new Error("Responsável não encontrado para a manutenção.");
                }
            } else {
                throw new Error("ID do responsável é obrigatório para a manutenção.");
            }
            
            return await Manutencao.create(data);
        } catch (error: any) {
            console.error("Erro no ManutencaoRepository.create:", error);
            throw new Error(`Erro ao criar manutenção: ${error.message}`);
        }
    }

    async update(id: string, data: Partial<IManutencao>): Promise<IManutencao | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("ID de Manutenção inválido para atualização.");
            }
            if (!data) {
                throw new Error("Dados para atualização da manutenção são obrigatórios.");
            }

            if (data.maquinarioManutencao) {
                const existingMaquinario = await Maquinario.findById(data.maquinarioManutencao);
                if (!existingMaquinario) {
                    throw new Error("Maquinário não encontrado para atualização da manutenção.");
                }
            }
            if (data.responsavelManutencao) {
                const existingResponsavel = await Responsavel.findById(data.responsavelManutencao);
                if (!existingResponsavel) {
                    throw new Error("Responsável não encontrado para atualização da manutenção.");
                }
            }

            const updatedManutencao = await Manutencao.findByIdAndUpdate(id, data, { new: true }).exec();

            if (!updatedManutencao) {
                throw new Error("Manutenção não encontrada para atualização.");
            }
            return updatedManutencao;
        } catch (error: any) {
            console.error("Erro no ManutencaoRepository.update:", error);
            throw new Error(`Erro ao atualizar manutenção: ${error.message}`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("ID de Manutenção inválido para exclusão.");
            }
            const result = await Manutencao.findByIdAndDelete(id).exec();
            if (!result) {
                throw new Error("Manutenção não encontrada para exclusão.");
            }
        } catch (error: any) {
            console.error("Erro no ManutencaoRepository.delete:", error);
            throw new Error(`Erro ao deletar manutenção: ${error.message}`);
        }
    }
}

export default new ManutencaoRepository();