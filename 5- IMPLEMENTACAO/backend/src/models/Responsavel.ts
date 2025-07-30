import mongoose, { Schema, Document } from 'mongoose';

// A interface IResponsavel deve incluir todos os campos do schema
export interface IResponsavel extends Document {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  cargo: string;
}

const ResponsavelSchema: Schema = new Schema({
  nome: { type: String, required: [true, "O nome do responsável é obrigatório!"] },
  cpf: { type: String, unique: true, required: [true, "O CPF é obrigatório!"]},
  email: { type: String, required: [true, "O e-mail do responsável é obrigatório!"], unique: true },
  telefone: { type: String, required: false },
  // Campo 'cargo' atualizado com a validação de enum
  cargo: {
    type: String,
    required: [true, "O cargo é obrigatório!"],
    enum: {
        values: ["AUXILIAR DE MANUTENÇÃO", "ASSISTENTE DE MANUTENÇÃO", "TÉCNICO EM MANUTENÇÃO"],
        message: 'O cargo {VALUE} não é válido.' // Mensagem de erro para valores fora do enum
    }
  }
}, { timestamps: true });

export const Responsavel = mongoose.model<IResponsavel>('Responsavel', ResponsavelSchema);
