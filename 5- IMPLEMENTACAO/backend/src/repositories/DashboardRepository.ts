import { Manutencao } from '../models/Manutencao';
import { Maquinario } from '../models/Maquinario';
import { Responsavel } from '../models/Responsavel';

class DashboardRepository {
    async getDashboardStats() {
        // Promise.all executa todas as buscas em paralelo para mais eficiência
        const [
            totalMaquinarios,
            totalResponsaveis,
            totalManutencoes,
            manutencoesPorStatus,
            maquinariosPorStatus
        ] = await Promise.all([
            Maquinario.countDocuments(),
            Responsavel.countDocuments(),
            Manutencao.countDocuments(),
            // Agregação para contar manutenções por status
            Manutencao.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $project: { status: '$_id', count: 1, _id: 0 } }
            ]),
            // Agregação para contar maquinários por status
            Maquinario.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $project: { status: '$_id', count: 1, _id: 0 } }
            ])
        ]);

        return {
            totalMaquinarios,
            totalResponsaveis,
            totalManutencoes,
            manutencoesPorStatus,
            maquinariosPorStatus
        };
    }
}

export default new DashboardRepository();
