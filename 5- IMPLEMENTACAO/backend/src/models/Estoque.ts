import mongoose, { Document, Types } from "mongoose";

// Subdocumento de item de estoque
export interface IEstoqueProps {
    produto: Types.ObjectId;
    quantidade: number;
    estoqueMinimo: number;
}

// Documento principal do Estoque Geral
export interface IEstoqueGeralProps extends Document {
    nomeInventario?: string;
    itens: IEstoqueProps[];
}

const estoqueSchema = new mongoose.Schema<IEstoqueProps>({
    produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Produto",
        required: [true, "O produto é obrigatório"],
    },
    quantidade: {
        type: Number,
        required: [true, "A quantidade do item é obrigatória!"],
        default: 0
    },
    estoqueMinimo: {
        type: Number,
        required: [true, "A quantidade mínima do estoque é obrigatória!"],
        default: 0
    }
}, { _id: false });

const estoqueGeralSchema = new mongoose.Schema<IEstoqueGeralProps>({
    nomeInventario: {
        type: String,
        default: "Estoque Geral",
        unique: true
    },
    itens: [estoqueSchema]
}, { versionKey: false, timestamps: true });

export const Estoque = mongoose.model<IEstoqueGeralProps>("Estoque", estoqueGeralSchema);
