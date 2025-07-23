import { Maquinario } from '../models/Maquinario'

class MaquinarioRepository {
     async findAll(): Promise<object | void> {
            try {
                return await Maquinario.find({});
            } catch (error) {
                console.error("Erro ao buscar os usuários!")
                throw error;
            }
        }
    
    async findbyId(id: string): Promise<object | void | null> {
            try {
                if (!id) {
                    return;
                }
    
                return await Maquinario.findById(id);
            } catch (error) {
                console.error("Erro ao tentar encontrar o usuário!")
                throw error;
            }
        }
    
        async create(data: JSON): Promise<object | void> {
            try {
                if (!data) {
                    return;
                }
    
                return await Maquinario.create(data);
            } catch (error) {
                console.error("Não foi possível criar um novo usuário!")
                throw error;
            }
        }
    
        async update(id: string, data: JSON): Promise<object | void | null> {
            try {
                if (!id || !data) {
                    return;
                }
    
                return await Maquinario.findByIdAndUpdate(id, data);
            } catch (error) {
                console.error("Erro ao atualizad o usuário!")
                throw error;
            }
        }
    
        async delete(id: string): Promise<object | void> {
            try {
                if (!id) {
                    return;
                }
    
                await Maquinario.findByIdAndDelete(id);
            } catch (error) {
                console.error("Erro ao apagar o usuário!")
                throw error;
            }
        }
}

export default new MaquinarioRepository();