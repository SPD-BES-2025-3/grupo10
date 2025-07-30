import { Responsavel, IResponsavel } from "../models/Responsavel";
import RedisPublisher from '../events/redisPublisher';

class ResponsavelRepository {
    async findAll(): Promise<IResponsavel[]> {
        return Responsavel.find({});
    }

    async findbyId(id: string): Promise<IResponsavel | null> {
        return Responsavel.findById(id);
    }

    async create(data: Partial<IResponsavel>): Promise<IResponsavel> {
        const newResponsavel = await Responsavel.create(data);

        await RedisPublisher.publishOperation({
            entity: 'Responsavel',
            operation: 'CREATE',
            data: newResponsavel.toObject()
        });

        return newResponsavel;
    }

    async update(id: string, data: Partial<IResponsavel>): Promise<IResponsavel | null> {
        const updatedResponsavel = await Responsavel.findByIdAndUpdate(id, data, { new: true });

        if (updatedResponsavel) {
            await RedisPublisher.publishOperation({
                entity: 'Responsavel',
                operation: 'UPDATE',
                data: updatedResponsavel.toObject()
            });
        }
        return updatedResponsavel;
    }

    async delete(id: string): Promise<void> {
        const deletedResponsavel = await Responsavel.findByIdAndDelete(id);

        if (deletedResponsavel) {
            await RedisPublisher.publishOperation({
                entity: 'Responsavel',
                operation: 'DELETE',
                data: deletedResponsavel.toObject()
            });
        }
    }
}

export default new ResponsavelRepository();
