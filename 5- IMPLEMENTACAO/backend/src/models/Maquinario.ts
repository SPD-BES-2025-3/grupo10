// models/Maquinario.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMaquinario extends Document {
    tipo: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    anoFabricacao: number;
    status: string; // Adicionado: Campo 'status'
}

const maquinarioSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: [true, "O tipo do maquinário é obrigatório!"]
    },
    marca: {
        type: String,
        required: [true, "A marca do maquinário é obrigatória!"]
    },
    modelo: {
        type: String,
        required: [true, "O modelo do maquinário é obrigatório!"]
    },
    numeroSerie: {
        type: String,
        required: [true, "O numero de serie é obrigatório!"],
        unique: true
    },
    anoFabricacao: {
        type: Number,
        required: [true, "O ano de fabricação é obrigatório!"]
    },
    status: {
        type: String,
        required: [true, "O status do maquinário é obrigatório!"],
        enum: ['TRATOR', 'EMPILHADEIRA', 'RETROESCAVADEIRA', 'GUINDASTE', 'OUTRO']
    }
}, { timestamps: true });

const Maquinario = mongoose.model<IMaquinario>("Maquinario", maquinarioSchema);

export { Maquinario, maquinarioSchema };