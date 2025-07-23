import { Maquinario, IMaquinario } from '../models/Maquinario';

type MaquinarioData = Partial<Omit<IMaquinario, '_id'>>;

class MaquinarioRepository {
    async findAll(): Promise<IMaquinario[]> {
        return Maquinario.find({});
    }

    async findById(id: string): Promise<IMaquinario | null> {
        return Maquinario.findById(id);
    }

    async create(data: MaquinarioData): Promise<IMaquinario> {
        return Maquinario.create(data);
    }

    async update(id: string, data: MaquinarioData): Promise<IMaquinario | null> {
        return Maquinario.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<void> {
        await Maquinario.findByIdAndDelete(id);
    }
}

export default new MaquinarioRepository();