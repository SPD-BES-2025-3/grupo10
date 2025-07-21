// src/app/teste/page.tsx

// Adicionamos 'use client' para poder usar hooks de interatividade como useState e useEffect.
'use client';

// Importamos os hooks necessários do React.
import React, { useState, useEffect, FormEvent } from 'react';



// --- (Opcional, mas recomendado) Definindo a "forma" do nosso objeto de maquinário ---
interface Maquinario {
    _id: string;
    tipo: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    anoFabricacao: number;
}

// Definimos um estado inicial para o formulário, para facilitar o reset.
const initialState: Omit<Maquinario, '_id'> = {
    tipo: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    anoFabricacao: new Date().getFullYear(),
};

export default function MaquinarioPage() {
    // --- SEÇÃO DE ESTADO ---
    const [maquinarioList, setMaquinarioList] = useState<Maquinario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estado para os dados do formulário
    const [formData, setFormData] = useState(initialState);
    // Estado para saber se estamos editando (armazena o ID do item em edição)
    const [editingId, setEditingId] = useState<string | null>(null);
    // Estado para o feedback do envio
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- SEÇÃO DE BUSCA DE DADOS (DATA FETCHING) ---
    const fetchMaquinario = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/maquinario');
            if (!response.ok) {
                throw new Error("Falha ao carregar os dados do maquinário.");
            }
            const data: Maquinario[] = await response.json();
            setMaquinarioList(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaquinario();
    }, []); // O array vazio `[]` significa: "execute este efeito apenas uma vez".

    // --- SEÇÃO DE MANIPULADORES DE EVENTOS (EVENT HANDLERS) ---

    // Atualiza o estado do formulário conforme o usuário digita
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'anoFabricacao' ? parseInt(value, 10) || 0 : value,
        }));
    };

    // Prepara o formulário para edição
    const handleEditClick = (maquina: Maquinario) => {
        setEditingId(maquina._id);
        setFormData({
            tipo: maquina.tipo,
            marca: maquina.marca,
            modelo: maquina.modelo,
            numeroSerie: maquina.numeroSerie,
            anoFabricacao: maquina.anoFabricacao,
        });
        window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
    };

    // Limpa o formulário e sai do modo de edição
    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialState);
    };

    // Deleta um item
    const handleDeleteClick = async (id: string) => {
        if (window.confirm("Tem certeza que deseja deletar este item?")) {
            try {
                const response = await fetch(`http://localhost:8000/maquinario/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error("Falha ao deletar o maquinário.");
                }
                // Atualiza a lista no frontend removendo o item deletado
                setMaquinarioList(prevList => prevList.filter(item => item._id !== id));
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    // Lida com o envio do formulário (Criação ou Atualização)
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        setIsSubmitting(true);
        setError(null);

        const url = editingId
            ? `http://localhost:8000/maquinario/${editingId}` // URL para PUT (atualizar)
            : 'http://localhost:8000/maquinario';           // URL para POST (criar)

        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Falha ao ${editingId ? 'atualizar' : 'criar'} maquinário.`);
            }
            
            alert(`Maquinário ${editingId ? 'atualizado' : 'criado'} com sucesso!`);
            handleCancelEdit(); // Limpa o formulário
            await fetchMaquinario(); // Recarrega a lista para mostrar as mudanças

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- SEÇÃO DE RENDERIZAÇÃO (JSX) ---
    return (
        <main className="bg-slate-900 min-h-screen p-4 md:p-8 text-white flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-4">
                    Página de Teste com Dados da API
                </h1>

                {/* Formulário de Criação/Edição */}
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        {editingId ? 'Editar Maquinário' : 'Adicionar Novo Maquinário'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="tipo" value={formData.tipo} onChange={handleInputChange} placeholder="Tipo (Ex: Trator)" required className="bg-slate-700 p-2 rounded w-full" />
                            <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} placeholder="Marca" required className="bg-slate-700 p-2 rounded w-full" />
                            <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} placeholder="Modelo" required className="bg-slate-700 p-2 rounded w-full" />
                            <input type="text" name="numeroSerie" value={formData.numeroSerie} onChange={handleInputChange} placeholder="Número de Série" required className="bg-slate-700 p-2 rounded w-full" />
                            <input type="number" name="anoFabricacao" value={formData.anoFabricacao} onChange={handleInputChange} placeholder="Ano de Fabricação" required className="bg-slate-700 p-2 rounded w-full" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-slate-500">
                                {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar Maquinário' : 'Criar Maquinário')}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors">
                                    Cancelar Edição
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Lista de Maquinário */}
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Maquinário Cadastrado</h2>
                    {loading && <p className="text-yellow-400">Carregando maquinário...</p>}
                    {error && <p className="text-red-500 font-bold">Erro: {error}</p>}
                    {!loading && !error && (
                        <ul className="space-y-4">
                            {maquinarioList.map(maquina => (
                                <li key={maquina._id} className="bg-slate-700 p-4 rounded-md flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <p className="font-bold text-lg text-white">{maquina.tipo} - {maquina.marca}</p>
                                        <p className="text-slate-300">Modelo: {maquina.modelo} | Ano: {maquina.anoFabricacao}</p>
                                        <p className="text-slate-400 text-sm">Série: {maquina.numeroSerie}</p>
                                    </div>
                                    <div className="flex gap-2 self-end md:self-center">
                                        <button onClick={() => handleEditClick(maquina)} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1 px-3 rounded text-sm transition-colors">
                                            Editar
                                        </button>
                                        <button onClick={() => handleDeleteClick(maquina._id)} className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors">
                                            Deletar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}
