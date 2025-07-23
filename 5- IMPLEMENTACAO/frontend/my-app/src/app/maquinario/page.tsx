'use client';

import React, { useState, useEffect, FormEvent, useCallback } from 'react';

type StatusMaquinario = 'OPERACIONAL' | 'EM_MANUTENCAO' | 'INATIVO';

interface Maquinario {
    _id: string;
    tipo: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    anoFabricacao: number;
    status: StatusMaquinario;
}

const initialState: Omit<Maquinario, '_id'> = {
    tipo: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    anoFabricacao: new Date().getFullYear(),
    status: 'OPERACIONAL',
};

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-slate-700 p-6 rounded-lg shadow-xl text-white max-w-sm w-full">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${bgColor} p-6 rounded-lg shadow-xl text-white max-w-sm w-full`}>
                <p className="mb-4 text-lg">{message}</p>
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-2 px-4 rounded transition-colors">Ok</button>
                </div>
            </div>
        </div>
    );
};


export default function MaquinarioPage() {
    const [maquinarioList, setMaquinarioList] = useState<Maquinario[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(initialState);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmActionId, setConfirmActionId] = useState<string | null>(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState({ message: '', type: 'info' as 'success' | 'error' | 'info' });

    const fetchMaquinario = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/maquinario');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Erro de comunicação com o servidor." }));
                throw new Error(errorData.message || "Falha ao carregar os dados do maquinário.");
            }
            const data: Maquinario[] = await response.json();
            setMaquinarioList(data);
        } catch (err: any) {
            setMessageModalContent({ message: err.message, type: 'error' });
            setShowMessageModal(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMaquinario();
    }, [fetchMaquinario]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'anoFabricacao' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleEditClick = (maquina: Maquinario) => {
        setEditingId(maquina._id);
        setFormData({
            tipo: maquina.tipo,
            marca: maquina.marca,
            modelo: maquina.modelo,
            numeroSerie: maquina.numeroSerie,
            anoFabricacao: maquina.anoFabricacao,
            status: maquina.status,
        });
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialState);
    };

    const confirmDelete = (id: string) => {
        setConfirmActionId(id);
        setShowConfirmModal(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!confirmActionId) return;
        setShowConfirmModal(false);
        try {
            const response = await fetch(`http://localhost:8000/maquinario/${confirmActionId}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Erro ao deletar." }));
                throw new Error(errorData.message || "Falha ao deletar o maquinário.");
            }
            setMaquinarioList(prevList => prevList.filter(item => item._id !== confirmActionId));
            setMessageModalContent({ message: "Maquinário deletado com sucesso!", type: 'success' });
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
        const url = editingId ? `http://localhost:8000/maquinario/${editingId}` : 'http://localhost:8000/maquinario';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Erro ao salvar." }));
                throw new Error(errorData.message || `Falha ao ${editingId ? 'atualizar' : 'criar'} maquinário.`);
            }
            setMessageModalContent({ message: `Maquinário ${editingId ? 'atualizado' : 'criado'} com sucesso!`, type: 'success' });
            setShowMessageModal(true);
            handleCancelEdit();
            await fetchMaquinario();
        } catch (err: any) {
            setMessageModalContent({ message: err.message, type: 'error' });
            setShowMessageModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-slate-900 min-h-screen p-4 md:p-8 text-white flex flex-col items-center font-sans">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-4">
                    Gerenciamento de Maquinários
                </h1>

                <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{editingId ? 'Editar Maquinário' : 'Adicionar Novo Maquinário'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="tipo" value={formData.tipo} onChange={handleInputChange} placeholder="Tipo (Ex: Trator)" required className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} placeholder="Marca" required className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} placeholder="Modelo" required className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            <input type="text" name="numeroSerie" value={formData.numeroSerie} onChange={handleInputChange} placeholder="Número de Série" required className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            <input type="number" name="anoFabricacao" value={formData.anoFabricacao} onChange={handleInputChange} placeholder="Ano de Fabricação" required className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            <select name="status" value={formData.status} onChange={handleInputChange} required className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                <option value="OPERACIONAL">Operacional</option>
                                <option value="EM_MANUTENCAO">Em Manutenção</option>
                                <option value="INATIVO">Inativo</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar Maquinário' : 'Criar Maquinário')}
                            </button>
                            {editingId && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors">Cancelar Edição</button>}
                        </div>
                    </form>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Maquinário Cadastrado</h2>
                    {loading && <p className="text-yellow-400">Carregando...</p>}
                    {!loading && maquinarioList.length === 0 && <p className="text-slate-400">Nenhum maquinário cadastrado.</p>}
                    {!loading && maquinarioList.length > 0 && (
                        <ul className="space-y-4">
                            {maquinarioList.map(maquina => (
                                <li key={maquina._id} className="bg-slate-700 p-4 rounded-md flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <p className="font-bold text-lg text-white">{maquina.tipo} - {maquina.marca}</p>
                                        <p className="text-slate-300">Modelo: {maquina.modelo} | Ano: {maquina.anoFabricacao}</p>
                                        <p className="text-slate-400 text-sm">Série: {maquina.numeroSerie} | Status: <span className={`font-semibold ${maquina.status === 'OPERACIONAL' ? 'text-green-400' : maquina.status === 'EM_MANUTENCAO' ? 'text-yellow-400' : 'text-red-400'}`}>{maquina.status ? maquina.status.replace('_', ' ') : null}</span></p>
                                    </div>
                                    <div className="flex gap-2 self-end md:self-center">
                                        <button onClick={() => handleEditClick(maquina)} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1 px-3 rounded text-sm transition-colors">Editar</button>
                                        <button onClick={() => confirmDelete(maquina._id)} className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors">Deletar</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {showConfirmModal && <ConfirmModal message="Tem certeza que deseja deletar este maquinário?" onConfirm={handleDeleteConfirmed} onCancel={() => setShowConfirmModal(false)} />}
            {showMessageModal && <MessageModal message={messageModalContent.message} type={messageModalContent.type} onClose={() => setShowMessageModal(false)} />}
        </main>
    );
}
