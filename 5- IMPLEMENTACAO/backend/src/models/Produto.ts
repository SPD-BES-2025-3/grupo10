import mongoose from "mongoose";

export interface IProdutoProps extends Document {
    _id: string;
    nome: string;
    descricao: string;
    codigoItem?: string;
    precoUnitario: number;
}

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome do produto é obrigatório!"]
  },
  descricao: {
    type: String,
    default: null
  },
  codigoItem: {
    type: String,
    unique: true,
    sparse: true,
    default: null
  },
  precoUnitario: {
    type: Number,
    required: [true, "O valor unitário do item é obrigatório!"]
  },
  categoria: {
    type: String,
    required: [true, "A categoria do produto é obrigatória!"],
    enum: [
      "Matéria-prima",
      "Insumos/Consumíveis",
      "Equipamentos e ferramentas",
      "Material de manutenção",
      "Material de limpeza e higiene"
    ]
  }
});


export const Produto = mongoose.model("Produto", produtoSchema)