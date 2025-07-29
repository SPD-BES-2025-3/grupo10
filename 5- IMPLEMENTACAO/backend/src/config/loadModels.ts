
import { Estoque } from "../models/Estoque";
import { Produto } from "../models/Produto";

import { Maquinario } from "../models/Maquinario";
import { Manutencao } from "../models/Manutencao";
import { Responsavel } from "../models/Responsavel";

export function loadAllMongooseModels() {
    console.log("Carregando modelos")
    Estoque;
    Produto;
    Maquinario;
    Manutencao;
    Responsavel;
    console.log("Modelos Carregados");
}