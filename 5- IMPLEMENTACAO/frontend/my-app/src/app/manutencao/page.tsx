'use client';

import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { IResponsavelProps as ResponsavelOption } from '../responsavel/page';

// --- SEÇÃO DE INTERFACES E ESTADO INICIAL ---

interface MaquinarioOption {
    _id: string;
    tipo: string;
    marca: string;
    modelo: string;
}

export interface Manutencao {
    _id: string;
    titulo: string;
    observacao: string;
    dataAgendada: string;
    dataRealizada?: string;
    status: 'MANUTENCAO_AGENDADA' | 'EM_MANUTENCAO' | 'CONCLUIDA' | 'CANCELADA';
    custoEstimado: number;
    maquinarioManutencao: MaquinarioOption;
    responsavelManutencao: ResponsavelOption;
}

interface ManutencaoFormData {
    titulo: string;
    observacao: string;
    dataAgendada: string;
    dataRealizada?: string;
    status: Manutencao['status'];
    custoEstimado: number;
    maquinarioManutencao: string; 
    responsavelManutencao: string;
}

const initialState: ManutencaoFormData = {
    titulo: '',
    observacao: '',
    dataAgendada: '',
    dataRealizada: '',
    status: 'MANUTENCAO_AGENDADA',
    custoEstimado: 0,
    maquinarioManutencao: '',
    responsavelManutencao: '', 
};

// CORREÇÃO: A constante 'statusOptions' estava faltando. Ela é definida aqui.
const statusOptions: Array<Manutencao['status']> = ['MANUTENCAO_AGENDADA', 'EM_MANUTENCAO', 'CONCLUIDA', 'CANCELADA'];


// --- COMPONENTES DE MODAL (Reutilizáveis) ---

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="relative bg-slate-700 p-6 rounded-lg shadow-xl z-20 text-white max-w-sm w-full">
            <p className="mb-4 text-lg">{message}</p>
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors">Cancelar</button>
                <button onClick={onConfirm} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors">Confirmar</button>
            </div>
        </div>
    </div>
);

interface MessageModalProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className={`${bgColor} p-6 rounded-lg shadow-xl max-w-sm w-full`}>
                <p className="mb-4 text-lg">{message}</p>
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-2 px-4 rounded transition-colors">Ok</button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---

export default function ManutencaoPage() {
    const [manutencaoList, setManutencaoList] = useState<Manutencao[]>([]);
    const [maquinarioOptions, setMaquinarioOptions] = useState<MaquinarioOption[]>([]);
    const [responsavelOptions, setResponsavelOptions] = useState<ResponsavelOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(initialState);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmActionId, setConfirmActionId] = useState<string | null>(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState({ message: '', type: 'info' as 'success' | 'error' | 'info' });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [manutencoesRes, maquinariosRes, responsaveisRes] = await Promise.all([
                fetch('http://localhost:8000/api/manutencao'),
                fetch('http://localhost:8000/api/maquinario'),
                fetch('http://localhost:8000/api/responsavel')
            ]);
            if (!manutencoesRes.ok || !maquinariosRes.ok || !responsaveisRes.ok) {
                throw new Error("Falha ao carregar dados essenciais do servidor.");
            }
            setManutencaoList(await manutencoesRes.json());
            setMaquinarioOptions(await maquinariosRes.json());
            setResponsavelOptions(await responsaveisRes.json());
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setMessageModalContent({ message: errorMessage, type: 'error' });
            setShowMessageModal(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleEditClick = (manutencao: Manutencao) => {
        setEditingId(manutencao._id);
        setFormData({
            titulo: manutencao.titulo,
            observacao: manutencao.observacao,
            dataAgendada: formatDateForInput(manutencao.dataAgendada),
            dataRealizada: formatDateForInput(manutencao.dataRealizada),
            custoEstimado: manutencao.custoEstimado,
            status: manutencao.status,
            maquinarioManutencao: manutencao.maquinarioManutencao?._id || '',
            responsavelManutencao: manutencao.responsavelManutencao?._id || '',
        });
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData(initialState);
        setShowForm(false);
    };

    const confirmDelete = (id: string) => {
        setConfirmActionId(id);
        setShowConfirmModal(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!confirmActionId) return;
        setShowConfirmModal(false);
        try {
            const response = await fetch(`http://localhost:8000/api/manutencao/${confirmActionId}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao deletar manutenção.");
            }
            await fetchData();
            setMessageModalContent({ message: "Manutenção deletada com sucesso!", type: 'success' });
            setShowMessageModal(true);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setMessageModalContent({ message: errorMessage, type: 'error' });
            setShowMessageModal(true);
        } finally {
            setConfirmActionId(null);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const url = editingId ? `http://localhost:8000/api/manutencao/${editingId}` : 'http://localhost:8000/api/manutencao';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao salvar manutenção.");
            }
            setMessageModalContent({ message: `Manutenção ${editingId ? 'atualizada' : 'criada'} com sucesso!`, type: 'success' });
            setShowMessageModal(true);
            handleCancel();
            await fetchData();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setMessageModalContent({ message: errorMessage, type: 'error' });
            setShowMessageModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDateForInput = (date?: string) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <main className="bg-slate-900 min-h-screen p-4 md:p-8 text-white flex flex-col items-center font-sans">
            <div className="w-full max-w-5xl">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-4">
                    Gerenciamento de Manutenções
                </h1>

                <div className='bg-slate-800 p-6 mb-8 rounded-lg shadow-lg'>
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-semibold'>{editingId ? 'Editar Manutenção' : 'Adicionar Manutenção'}</h2>
                        <button type="button" onClick={() => { showForm ? handleCancel() : setShowForm(true) }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors">
                            {showForm ? 'Fechar' : 'Adicionar Nova'}
                        </button>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                        <form onSubmit={handleSubmit} className="border-t border-slate-700 pt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título da Manutenção" required className="bg-slate-700 p-2 rounded w-full" />
                                <select name="maquinarioManutencao" value={formData.maquinarioManutencao} onChange={handleInputChange} required className="bg-slate-700 p-2 rounded w-full">
                                    <option value="">Selecione o Maquinário</option>
                                    {maquinarioOptions.map(m => <option key={m._id} value={m._id}>{m.tipo} - {m.modelo}</option>)}
                                </select>
                                <select name="responsavelManutencao" value={formData.responsavelManutencao} onChange={handleInputChange} required className="bg-slate-700 p-2 rounded w-full">
                                    <option value="">Selecione o Responsável</option>
                                    {responsavelOptions.map(r => <option key={r._id} value={r._id}>{r.nome}</option>)}
                                </select>
                                <select name="status" value={formData.status} onChange={handleInputChange} required className="bg-slate-700 p-2 rounded w-full">
                                    <option value="" disabled>Selecione o Status</option>
                                    {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                </select>
                                <input name="dataAgendada" type="date" value={formData.dataAgendada} onChange={handleInputChange} required className="bg-slate-700 p-2 rounded w-full" />
                                <input name="custoEstimado" type="number" value={formData.custoEstimado} onChange={handleInputChange} placeholder="Custo Estimado" required step="0.01" className="bg-slate-700 p-2 rounded w-full" />
                                <textarea name="observacao" value={formData.observacao} onChange={handleInputChange} placeholder="Observações" className="md:col-span-2 bg-slate-700 p-2 rounded w-full" />
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-slate-500">
                                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                                </button>
                                {editingId && <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">Cancelar</button>}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Manutenções Cadastradas</h2>
                    {loading && <p className="text-yellow-400">Carregando...</p>}
                    {!loading && (
                        <ul className="space-y-4">
                            {manutencaoList.map(manutencao => (
                                <li key={manutencao._id} className="bg-slate-700 p-4 rounded-md">
                                    <p className="font-bold text-lg text-white">{manutencao.titulo}</p>
                                    <p>Maquinário: {manutencao.maquinarioManutencao?.tipo || 'N/A'} - {manutencao.maquinarioManutencao?.modelo || ''}</p>
                                    <p>Responsável: {manutencao.responsavelManutencao?.nome || 'N/A'}</p>
                                    <p>Cargo: {manutencao.responsavelManutencao?.cargo || 'N/A'}</p>
                                    <p>Status: <span className="font-semibold">{manutencao.status.replace("_", " ")}</span></p>
                                    <p>Custo: {formatCurrency(manutencao.custoEstimado)}</p>
                                    <p>Observacao: {manutencao.observacao}</p>
                                    <div className="flex gap-2 mt-2">
                                        <ActionButton<Manutencao> item={manutencao} onAction={() => handleEditClick(manutencao)} buttonText='Editar' colorButton='blue' />
                                        <ActionButton<string> item={manutencao._id} onAction={confirmDelete} buttonText='Deletar' colorButton='red' />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {showConfirmModal && <ConfirmModal message="Tem certeza que deseja deletar esta manutenção?" onConfirm={handleDeleteConfirmed} onCancel={() => setShowConfirmModal(false)} />}
            {showMessageModal && <MessageModal message={messageModalContent.message} type={messageModalContent.type} onClose={() => setShowMessageModal(false)} />}
        </main>
    );
}
