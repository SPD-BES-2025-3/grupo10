import mongoose, { Document } from "mongoose";
import { IProdutoProps } from "./Produto";

export interface IEstoqueProps extends Document {
    produto: IProdutoProps['_id'];
    quantidade: number;
    estoqueMinimo: number;
}

export interface IEstoqueGeralProps extends Document {
    _id: string;
    nomeInventario?: string;
    itens: IEstoqueProps[];
}

const estoqueSchema = new mongoose.Schema<IEstoqueProps>({
    produto: {
        type: mongoose.Schema.Types.ObjectId as any,
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
    },

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