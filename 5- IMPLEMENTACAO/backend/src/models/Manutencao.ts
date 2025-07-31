// models/Manutencao.ts
import mongoose, { Document } from 'mongoose';

export interface IManutencao extends Document {
    titulo: string;
    observacao: string;
    dataAgendada: Date;
    dataRealizada?: Date;
    status: string;
    custoEstimado: number;
    maquinarioManutencao: mongoose.Schema.Types.ObjectId | string | undefined;
    responsavelManutencao: mongoose.Schema.Types.ObjectId | string | undefined; // Adicionado: Campo para o Responsável
}

const manutencaoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, "O titulo da manutenção é obrigatório!"]
    },
    observacao: {
        type: String,
        required: [true, "A descrição da manutenção é obrigatória!"] // Sugerido: Tornar obrigatório
    },
    dataAgendada: {
        type: Date,
        required: [true, "A data agendada é obrigatória!"]
    },
    dataRealizada: {
        type: Date,
        required: false // Pode ser nulo se a manutenção ainda não foi realizada
    },
    status: {
        type: String,
        required: [true, "O status da manutenção é obrigatório!"],
        enum: ['MANUTENCAO_AGENDADA', 'EM_MANUTENCAO', 'CONCLUIDA', 'CANCELADA']
    },
    custoEstimado: {
        type: Number,
        required: [true, "O custo estimado é obrigatório!"] // Sugerido: Tornar obrigatório
    },
    maquinarioManutencao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Maquinario', // 'Maquinario' é o nome do Model para Maquinario
        required: [true, "O maquinário é obrigatório!"]
    },
    responsavelManutencao: { // Adicionado: Campo de referência para o Responsável
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Responsavel', // 'Responsavel' é o nome do Model para Responsavel
        required: [true, "O responsável é obrigatório!"]
    }
}, { timestamps: true }); // Adicionado para controle de criação/atualização

export const Manutencao = mongoose.model<IManutencao>("Manutencao", manutencaoSchema);