import mongoose, { Schema, Document } from 'mongoose';

export interface IResponsavel extends Document {
  nome: string;
  email: string;
  telefone?: string; // Telefone pode ser opcional
}

const ResponsavelSchema: Schema = new Schema({
  nome: { type: String, required: [true, "O nome do responsável é obrigatório!"] },
  email: { type: String, required: [true, "O e-mail do responsável é obrigatório!"], unique: true },
  telefone: { type: String, required: false },
}, { timestamps: true });

export const Responsavel = mongoose.model<IResponsavel>('Responsavel', ResponsavelSchema);