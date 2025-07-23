import { Responsavel } from "../models/Responsavel";

class ResponsavelRepository {
    async findAll(): Promise<object | void> {
        try {
            return await Responsavel.find({});
        } catch (error) {
            console.error("Erro ao buscar os responsaveis!")
            throw error;
        }
    }

    async findbyId(id: string): Promise<object | void | null> {
        try {
            if (!id) {
                return;
            }

            return await Responsavel.findById(id);
        } catch (error) {
            console.error("Erro ao tentar encontrar o responsavel!")
            throw error;
        }
    }

    async findByCountry(country: string): Promise<object | void> {
        try {
            if (!country) {
                return;
            }

            return await Responsavel.find({ "address.country": country });
        } catch (error) {
            console.error("Não foi possível encontrar os responsaveis!")
            throw error;
        }
    }

    async create(data: JSON): Promise<object | void> {
        try {
            if (!data) {
                return;
            }

            return await Responsavel.create(data);
        } catch (error) {
            console.error("Não foi possível criar um novo responsavel!")
            throw error;
        }
    }

    async update(id: string, data: JSON): Promise<object | void | null> {
        try {
            if (!id || !data) {
                return;
            }

            return await Responsavel.findByIdAndUpdate(id, data);
        } catch (error) {
            console.error("Erro ao atualizar o responsavel!")
            throw error;
        }
    }

    async delete(id: string): Promise<object | void> {
        try {
            if (!id) {
                return;
            }

            await Responsavel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Erro ao apagar o responsavel!")
            throw error;
        }
    }
}

export default new ResponsavelRepository();