'use client'

import { ActionButton } from '@/components/ActionButton'
import React, { useEffect, useState, FormEvent, useCallback } from 'react'

// --- SEÇÃO DE INTERFACES E ESTADO INICIAL ---

export interface IProduto {
    _id: string;
    nome: string;
    codigoItem?: string;
    precoUnitario: number;
    categoria: string; // Adicionado categoria à interface IProduto
}

export interface IEstoqueItem {
    produto: IProduto;
    quantidade: number;
    estoqueMinimo: number;
}

export interface IEstoqueGeral {
    _id: string;
    nomeInventario?: string;
    itens: IEstoqueItem[];
}

export interface IEstoqueFormData {
    produtoId: string;
    codigoItem: string;
    nomeProduto: string;
    precoUnitario: number;
    categoria: string; // Adicionado categoria à interface do formulário
    quantidade: number;
    estoqueMinimo: number;
}

const initialState: IEstoqueFormData = {
    produtoId: '',
    codigoItem: '',
    nomeProduto: '',
    precoUnitario: 0,
    categoria: 'Matéria-prima', // Valor padrão para evitar "uncontrolled to controlled"
    quantidade: 0,
    estoqueMinimo: 10, // Valor padrão
};

const categoriasProduto: Array<string> = [
    "Matéria-prima",
    "Insumos/Consumíveis",
    "Equipamentos e ferramentas",
    "Material de manutenção",
    "Material de limpeza e higiene"
];

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

export default function EstoquePage() {
    const [estoqueGeral, setEstoqueGeral] = useState<IEstoqueGeral | null>(null);
    const [loading, setLoading] = useState(true);
    const [dadosFormulario, setDadosFormulario] = useState<IEstoqueFormData>(initialState);
    const [editingProdutoId, setEditingProdutoId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmActionId, setConfirmActionId] = useState<string | null>(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState({ message: '', type: 'info' as 'success' | 'error' | 'info' });

    const fetchEstoqueGeral = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/estoque');
            if (!response.ok) {
                if (response.status === 404) {
                    setEstoqueGeral(null);
                    return;
                }
                throw new Error("Falha ao carregar o estoque.");
            }
            const data: IEstoqueGeral = await response.json();
            setEstoqueGeral(data);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
            setMessageModalContent({ message: errorMessage, type: 'error' });
            setShowMessageModal(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEstoqueGeral();
    }, [fetchEstoqueGeral]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDadosFormulario(prev => ({
            ...prev,
            [name]: ['quantidade', 'estoqueMinimo', 'precoUnitario'].includes(name) ? parseFloat(value) || 0 : value
        }));
    };

    const handleEditClick = (item: IEstoqueItem) => {
        const produto = item.produto;
        setEditingProdutoId(produto._id);
        setDadosFormulario({
            produtoId: produto._id,
            codigoItem: produto.codigoItem || '',
            nomeProduto: produto.nome,
            precoUnitario: produto.precoUnitario,
            categoria: produto.categoria, // Popula a categoria
            quantidade: item.quantidade,
            estoqueMinimo: item.estoqueMinimo,
        });
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        setEditingProdutoId(null);
        setDadosFormulario(initialState);
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
            const response = await fetch(`http://localhost:8000/api/estoque/${confirmActionId}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao remover item do estoque.");
            }
            await fetchEstoqueGeral();
            setMessageModalContent({ message: "Item removido do estoque com sucesso!", type: 'success' });
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
        const url = editingProdutoId ? `http://localhost:8000/api/estoque/${editingProdutoId}` : 'http://localhost:8000/api/estoque';
        const method = editingProdutoId ? 'PUT' : 'POST';

        const body = {
            produtoId: dadosFormulario.produtoId,
            codigoItem: dadosFormulario.codigoItem,
            nome: dadosFormulario.nomeProduto,
            precoUnitario: dadosFormulario.precoUnitario,
            categoria: dadosFormulario.categoria, // Incluído categoria no body
            quantidade: dadosFormulario.quantidade,
            estoqueMinimo: dadosFormulario.estoqueMinimo,
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao salvar o item.");
            }
            setMessageModalContent({ message: `Item ${editingProdutoId ? 'atualizado' : 'adicionado'} com sucesso!`, type: 'success' });
            setShowMessageModal(true);
            handleCancel();
            await fetchEstoqueGeral();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setMessageModalContent({ message: errorMessage, type: 'error' });
            setShowMessageModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-slate-900 min-h-screen p-4 md:p-8 text-white flex flex-col items-center font-sans">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-4">
                    Gerenciamento de Estoque
                </h1>

                <div className='bg-slate-800 p-6 mb-8 rounded-lg shadow-lg'>
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-semibold'>{editingProdutoId ? 'Editar Item' : 'Adicionar Item'}</h2>
                        <button type="button" onClick={() => { showForm ? handleCancel() : setShowForm(true) }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors">
                            {showForm ? 'Fechar' : 'Adicionar Novo'}
                        </button>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[700px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                        <form onSubmit={handleSubmit} className="border-t border-slate-700 pt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Código do Produto (SKU)</span>
                                    <input type="text" name="codigoItem" value={dadosFormulario.codigoItem} onChange={handleInputChange} placeholder="Código do Produto (SKU)" required disabled={!!editingProdutoId} className="bg-slate-700 p-2 rounded w-full disabled:opacity-50" />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Nome do Produto</span>
                                    <input type="text" name="nomeProduto" value={dadosFormulario.nomeProduto} onChange={handleInputChange} placeholder="Nome do Produto" required={!editingProdutoId} className="bg-slate-700 p-2 rounded w-full" />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Preço Unitário</span>
                                    <input type="number" name="precoUnitario" value={dadosFormulario.precoUnitario} onChange={handleInputChange} placeholder="Preço Unitário" required={!editingProdutoId} step="0.01" className="bg-slate-700 p-2 rounded w-full" />
                                </label>

                                {/* CAMPO DE CATEGORIA ADICIONADO */}
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Categoria</span>
                                    <select name="categoria" value={dadosFormulario.categoria} onChange={handleInputChange} required={!editingProdutoId} className="bg-slate-700 p-2 rounded w-full">
                                        {categoriasProduto.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </label>

                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Quantidade</span>
                                    <input type="number" name="quantidade" value={dadosFormulario.quantidade} onChange={handleInputChange} placeholder="Quantidade" required className="bg-slate-700 p-2 rounded w-full" />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Estoque Mínimo</span>
                                    <input type="number" name="estoqueMinimo" value={dadosFormulario.estoqueMinimo} onChange={handleInputChange} placeholder="Estoque Mínimo" required className="bg-slate-700 p-2 rounded w-full" />
                                </label>
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-slate-500">
                                    {isSubmitting ? 'Salvando...' : 'Salvar Item'}
                                </button>
                                {editingProdutoId && <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">Cancelar</button>}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Itens no Estoque</h2>
                    {loading && <p className="text-yellow-400">Carregando...</p>}
                    {!loading && (!estoqueGeral || estoqueGeral.itens.length === 0) && <p className="text-slate-400">Nenhum item no estoque.</p>}
                    {!loading && estoqueGeral && estoqueGeral.itens.length > 0 && (
                        <ul className="space-y-4">
                            {estoqueGeral.itens.map(item => (
                                <li key={item.produto._id} className="bg-slate-700 p-4 rounded-md flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <p className="font-bold text-lg text-white">{item.produto.nome}</p>
                                        <p className="text-slate-300">Código: {item.produto.codigoItem}</p>
                                        <p className="text-slate-400 text-sm">Quantidade: {item.quantidade} | Mínimo: {item.estoqueMinimo}</p>
                                        {item.quantidade <= item.estoqueMinimo && <p className="text-amber-400 text-sm font-semibold">Estoque baixo!</p>}
                                    </div>
                                    <div className="flex gap-2 self-end md:self-center">
                                        <ActionButton<IEstoqueItem> item={item} onAction={() => handleEditClick(item)} buttonText='Editar' colorButton='blue' />
                                        <ActionButton<string> item={item.produto._id} onAction={confirmDelete} buttonText='Deletar' colorButton='red' />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {showConfirmModal && <ConfirmModal message="Tem certeza que deseja remover este item do estoque?" onConfirm={handleDeleteConfirmed} onCancel={() => setShowConfirmModal(false)} />}
            {showMessageModal && <MessageModal message={messageModalContent.message} type={messageModalContent.type} onClose={() => setShowMessageModal(false)} />}
        </main>
    )
}
