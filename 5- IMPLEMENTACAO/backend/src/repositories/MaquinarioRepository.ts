import { Maquinario, IMaquinario } from '../models/Maquinario';
import RedisPublisher from '../events/redisPublisher'; // 1. Importe o publisher

type MaquinarioData = Partial<Omit<IMaquinario, '_id'>>;

class MaquinarioRepository {
    async findAll(): Promise<IMaquinario[]> {
        return Maquinario.find({});
    }

    async findById(id: string): Promise<IMaquinario | null> {
        return Maquinario.findById(id);
    }

    async create(data: MaquinarioData): Promise<IMaquinario> {
        const newMaquinario = await Maquinario.create(data);

        await RedisPublisher.publishOperation({
            entity: 'Maquinario',
            operation: 'CREATE',
            data: newMaquinario.toObject()
        });

        return newMaquinario;
    }

    async update(id: string, data: MaquinarioData): Promise<IMaquinario | null> {
        const updatedMaquinario = await Maquinario.findByIdAndUpdate(id, data, { new: true });

        if (updatedMaquinario) {
            await RedisPublisher.publishOperation({
                entity: 'Maquinario',
                operation: 'UPDATE',
                data: updatedMaquinario.toObject()
            });
        }

        return updatedMaquinario;
    }

    async delete(id: string): Promise<void> {
        const deletedMaquinario = await Maquinario.findByIdAndDelete(id);

        if (deletedMaquinario) {
            await RedisPublisher.publishOperation({
                entity: 'Maquinario',
                operation: 'DELETE',
                data: deletedMaquinario.toObject()
            });
        }
    }
}

export default new MaquinarioRepository();
