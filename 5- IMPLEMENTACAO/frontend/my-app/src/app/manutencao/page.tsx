'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { ActionButton } from '@/components/ActionButton'; // Importando o ActionButton genérico

// --- Interfaces para os objetos ---
interface MaquinarioOption {
    _id: string;
    tipo: string;
    marca: string;
    modelo: string;
    status: string;
}

interface ResponsavelOption {
    _id: string;
    nome: string;
    email: string;
}

export interface Manutencao { // Exportando a interface para possível reutilização
    _id: string;
    titulo: string;
    observacao: string;
    dataAgendada: string; // Usar string para o input type="date"
    dataRealizada?: string; // Usar string para o input type="date", pode ser opcional
    status: 'MANUTENCAO_AGENDADA' | 'EM_MANUTENCAO' | 'CONCLUIDA' | 'CANCELADA'; // Enum de status
    custoEstimado: number;
    maquinarioManutencao: MaquinarioOption; // Populated object
    responsavelManutencao: ResponsavelOption; // Populated object
}

// --- Estado inicial para o formulário ---
// Garante que os IDs sejam string vazia para inputs controlados
const initialState: Omit<Manutencao, '_id' | 'maquinarioManutencao' | 'responsavelManutencao'> & {
    maquinarioManutencao: string; // Para armazenar apenas o ID no formData
    responsavelManutencao: string; // Para armazenar apenas o ID no formData
} = {
    titulo: '',
    observacao: '',
    dataAgendada: '',
    dataRealizada: '',
    status: 'MANUTENCAO_AGENDADA',
    custoEstimado: 0,
    maquinarioManutencao: '', // ID do maquinário
    responsavelManutencao: '', // ID do responsável
};

// --- Componente de Modal de Confirmação ---
interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="relative bg-slate-700 p-6 rounded-lg shadow-xl z-20 text-white max-w-sm w-full">
                <p className="mb-4 text-lg">{message}</p>
                <div className="flex justify-end gap-3 ">
                    <button
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
            <div className='flex justify-center bg-black w-screen h-[100vh] opacity-50 z-10 absolute items-center'>
            </div>
        </div>
    );
};

// --- Componente de Mensagem/Alerta ---
interface MessageModalProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    return (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className={`${bgColor} p-6 rounded-lg shadow-xl max-w-sm w-full`}>
                <p className="mb-4 text-lg">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-bold py-2 px-4 rounded transition-colors"
                    >
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ManutencaoPage() {
    // --- SEÇÃO DE ESTADO ---
    const [manutencaoList, setManutencaoList] = useState<Manutencao[]>([]);
    const [maquinarioOptions, setMaquinarioOptions] = useState<MaquinarioOption[]>([]);
    const [responsavelOptions, setResponsavelOptions] = useState<ResponsavelOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estado para os dados do formulário
    const [formData, setFormData] = useState(initialState);
    // Estado para saber se estamos editando (armazena o ID do item em edição)
    const [editingId, setEditingId] = useState<string | null>(null);
    // Estado para o feedback do envio
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Estado para controlar a visibilidade do formulário (novo)
    const [showForm, setShowForm] = useState(false);


    // Estados para os modais personalizados
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmActionId, setConfirmActionId] = useState<string | null>(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState({ message: '', type: 'info' as 'success' | 'error' | 'info' });

    // --- SEÇÃO DE BUSCA DE DADOS (DATA FETCHING) ---

    // Função para buscar manutenções
    const fetchManutencoes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/manutencao');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao carregar as manutenções.");
            }
            const data: Manutencao[] = await response.json();
            setManutencaoList(data);
        } catch (err: any) {
            setError(err.message);
            setMessageModalContent({ message: err.message, type: 'error' });
            setShowMessageModal(true);
        } finally {
            setLoading(false);
        }
    }, []);

    // A função findMaquinario não está sendo usada no componente, pode ser removida ou adaptada.
    // function findMaquinario(): Promise<MaquinarioOption | undefined> {
    //     const maquinarioId = useParams();
    //     const maquinario = await fetch(`http://localhost:8000/api/${maquinarioId}`)
    //     if (maquinario)
    //         return maquinario.json();
    // }

    // Função para buscar opções de maquinários
    const fetchMaquinarioOptions = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/api/maquinario');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao carregar opções de maquinários.");
            }
            const data: MaquinarioOption[] = await response.json();
            setMaquinarioOptions(data);
        } catch (err: any) {
            console.error("Erro ao carregar maquinários para o select:", err.message);
        }
    }, []);

    // Função para buscar opções de responsáveis
    const fetchResponsavelOptions = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/api/responsavel');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao carregar opções de responsáveis.");
            }
            const data: ResponsavelOption[] = await response.json();
            setResponsavelOptions(data);
        } catch (err: any) {
            console.error("Erro ao carregar responsáveis para o select:", err.message);
        }
    }, []);

    useEffect(() => {
        fetchManutencoes();
        fetchMaquinarioOptions();
        fetchResponsavelOptions();
    }, [fetchManutencoes, fetchMaquinarioOptions, fetchResponsavelOptions]);

    // --- SEÇÃO DE MANIPULADORES DE EVENTOS (EVENT HANDLERS) ---

    // Atualiza o estado do formulário conforme o usuário digita
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    // Prepara o formulário para edição
    const handleEditClick = (manutencao: Manutencao) => {
        setEditingId(manutencao._id);
        setFormData({
            titulo: manutencao.titulo,
            observacao: manutencao.observacao,
            dataAgendada: manutencao.dataAgendada,
            dataRealizada: manutencao.dataRealizada || '',
            custoEstimado: manutencao.custoEstimado,
            status: manutencao.status,
            maquinarioManutencao: manutencao.maquinarioManutencao?._id || '', // Garante string vazia se null/undefined
            responsavelManutencao: manutencao.responsavelManutencao?._id || '', // Garante string vazia se null/undefined
        });
        setShowForm(true); // Abre o formulário ao editar
        window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
    };

    // Limpa o formulário e sai do modo de edição
    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialState);
        setShowForm(false); // Fecha o formulário ao cancelar edição
    };

    // Abre o modal de confirmação para deletar
    const confirmDelete = (id: string) => {
        setConfirmActionId(id);
        setShowConfirmModal(true);
    };

    // Lógica para deletar um item após a confirmação
    const handleDeleteConfirmed = async () => {
        if (!confirmActionId) return;

        setShowConfirmModal(false);
        try {
            const response = await fetch(`http://localhost:8000/api/manutencao/${confirmActionId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao deletar a manutenção.");
            }
            setManutencaoList(prevList => prevList.filter(item => item._id !== confirmActionId));
            setMessageModalContent({ message: "Manutenção deletada com sucesso!", type: 'success' });
            setShowMessageModal(true);
        } catch (err: any) {
            setMessageModalContent({ message: err.message, type: 'error' });
            setShowMessageModal(true);
        } finally {
            setConfirmActionId(null);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Formata as datas para o formato ISO string antes de enviar
        const dataToSend = {
            ...formData,
            dataAgendada: formData.dataAgendada ? new Date(formData.dataAgendada).toISOString() : '',
            dataRealizada: formData.dataRealizada ? new Date(formData.dataRealizada).toISOString() : undefined,
        };

        const url = editingId
            ? `http://localhost:8000/api/manutencao/${editingId}`
            : 'http://localhost:8000/api/manutencao';

        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Falha ao ${editingId ? 'atualizar' : 'criar'} manutenção.`);
            }

            setMessageModalContent({ message: `Manutenção ${editingId ? 'atualizada' : 'criada'} com sucesso!`, type: 'success' });
            setShowMessageModal(true);
            handleCancelEdit(); // Limpa o formulário e fecha
            await fetchManutencoes(); // Recarrega a lista de manutenções
            await fetchMaquinarioOptions(); // Recarrega as opções de maquinário para refletir o status novo

        } catch (err: any) {
            setError(err.message);
            setMessageModalContent({ message: err.message, type: 'error' });
            setShowMessageModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Função para formatar a data para o input type="date" (YYYY-MM-DD)
    const formatDateForInput = (date: Date | string | undefined) => {
        if (!date) return '';
        // Cria um novo objeto Date para evitar problemas com fuso horário
        const d = new Date(date);
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Função para formatar o número como moeda (BRL)
    const formatCurrency = (value: number) => {
        if (typeof value !== 'number') {
            return '';
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // --- SEÇÃO DE RENDERIZAÇÃO (JSX) ---
    return (
        <main className="bg-slate-900 min-h-screen p-4 md:p-8 text-white flex flex-col items-center font-inter">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-4 rounded-md">
                    Gerenciamento de Manutenções
                </h1>

                {/* Formulário de Criação/Edição */}
                <div className='bg-slate-800 p-6 mb-8 rounded-lg shadow-lg'>
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-semibold'>
                            {editingId ? 'Editar Manutenção' : 'Adicionar Nova Manutenção'}
                        </h2>
                        <button
                            type="button"
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
                        >
                            {showForm ? <p className='flex items-center gap-1'><span className='text-xl'>+</span>Novo</p> : 'Abrir Formulário'}
                        </button>
                    </div>

                    {/* Conteúdo do Formulário */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showForm ? 'max-h-[700px] opacity-100 mt-6 overflow-visible' : 'max-h-0 opacity-0'}`}>
                        <form onSubmit={handleSubmit} className="border-t border-slate-700 pt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Título</span>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleInputChange}
                                        placeholder="Titulo da Manutenção"
                                        required
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Observação</span>
                                    <input
                                        type="text"
                                        name="observacao"
                                        value={formData.observacao}
                                        onChange={handleInputChange}
                                        placeholder="Observação"
                                        required
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Data Agendada</span>
                                    <input
                                        type="date"
                                        name="dataAgendada"
                                        value={formatDateForInput(formData.dataAgendada)}
                                        onChange={handleInputChange}
                                        required
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Data Realizada (Opcional)</span>
                                    <input
                                        type="date"
                                        name="dataRealizada"
                                        value={formatDateForInput(formData.dataRealizada)}
                                        onChange={handleInputChange}
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Status</span>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="">Selecione o Status</option>
                                        <option value="MANUTENCAO_AGENDADA">Manutenção agendada</option>
                                        <option value="EM_MANUTENCAO">Em Manutenção</option>
                                        <option value="CONCLUIDA">Concluída</option>
                                        <option value="CANCELADA">Cancelada</option>
                                    </select>
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Custo Estimado (R$)</span>
                                    <input
                                        type="number"
                                        name="custoEstimado"
                                        value={formData.custoEstimado}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        required
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        step="0.01"
                                    />
                                </label>

                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Maquinário</span>
                                    <select
                                        name="maquinarioManutencao"
                                        value={formData.maquinarioManutencao}
                                        onChange={handleInputChange}
                                        required
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="">Selecione o Maquinário</option>
                                        {maquinarioOptions.map(maquina => (
                                            <option key={maquina._id} value={maquina._id}>
                                                {maquina.tipo} - {maquina.marca} ({maquina.modelo})
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Responsável</span>
                                    <select
                                        name="responsavelManutencao"
                                        value={formData.responsavelManutencao}
                                        onChange={handleInputChange}
                                        required
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="">Selecione o Responsável</option>
                                        {responsavelOptions.map(responsavel => (
                                            <option key={responsavel._id} value={responsavel._id}>
                                                {responsavel.nome} ({responsavel.email})
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar Manutenção' : 'Adicionar Manutenção')}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                                    >
                                        Cancelar Edição
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Lista de Manutenção */}
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Manutenções Cadastradas</h2>
                    {loading && <p className="text-yellow-400">Carregando manutenções...</p>}
                    {error && <p className="text-red-500 font-bold">Erro: {error}</p>}
                    {!loading && !error && (
                        <ul className="space-y-4">
                            {manutencaoList.length === 0 ? (
                                <p className="text-slate-400">Nenhuma manutenção cadastrada ainda.</p>
                            ) : (
                                manutencaoList.map(manutencao => (
                                    <li key={manutencao._id} className="bg-slate-700 p-4 rounded-md flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div>
                                            <p className="font-bold text-lg text-white">{manutencao.titulo} </p>
                                            <p>Status: <span className={`font-semibold ${manutencao.status === 'CONCLUIDA' ? 'text-green-400' :
                                                manutencao.status === 'MANUTENCAO_AGENDADA' ? 'text-blue-400' :
                                                    manutencao.status === 'EM_MANUTENCAO' ? 'text-yellow-400' : // Corrigido para 'EM_MANUTENCAO'
                                                        'text-red-400' // Para CANCELADA
                                                }`}>
                                                {manutencao.status.replace("_", " ")}
                                            </span></p>
                                            <p className="text-slate-300 font-semibold">Custo: {formatCurrency(manutencao.custoEstimado)}</p>
                                            <p className="text-slate-300">
                                                Maquinário: {manutencao.maquinarioManutencao ? `${manutencao.maquinarioManutencao.tipo} - ${manutencao.maquinarioManutencao.marca} (${manutencao.maquinarioManutencao.modelo})` : 'N/A'}
                                            </p>
                                            <p className="text-slate-300">
                                                Responsável: {manutencao.responsavelManutencao ? manutencao.responsavelManutencao.nome : 'N/A'}
                                            </p>
                                            <p className="text-slate-300">Agendada para: {formatDateForInput(manutencao.dataAgendada)}</p>
                                            <p className="text-slate-300">Realizada em: {manutencao.dataRealizada ? formatDateForInput(manutencao.dataRealizada) : "Pendente"}</p>
                                            <p className="text-slate-300">Observação: {manutencao.observacao}</p>
                                        </div>
                                        <div className="flex gap-2 self-end md:self-center">
                                            {/* Usando o ActionButton genérico */}
                                            <ActionButton<Manutencao> item={manutencao} onAction={handleEditClick} buttonText='Editar' colorButton='blue' />
                                            <ActionButton<Manutencao> item={manutencao} onAction={confirmDelete} buttonText='Deletar' colorButton='red' />
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {/* Modais */}
            {showConfirmModal && (
                <ConfirmModal
                    message="Tem certeza que deseja deletar esta manutenção?"
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
            {showMessageModal && (
                <MessageModal
                    message={messageModalContent.message}
                    type={messageModalContent.type}
                    onClose={() => setShowMessageModal(false)}
                />
            )}
        </main>
    );
}
