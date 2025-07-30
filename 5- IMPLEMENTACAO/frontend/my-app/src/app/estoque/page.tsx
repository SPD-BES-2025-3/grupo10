'use client'

import { ActionButton } from '@/components/ActionButton'
import React, { useEffect, useState } from 'react'
import { IEstoqueGeralProps, IEstoqueProps } from './../../../../../backend/src/models/Estoque';
import { IProdutoProps } from './../../../../../backend/src/models/Produto';

export interface IEstoqueFormDataProps {
    produtoId: string;
    codigoItem: string;
    nomeProduto?: string;
    precoUnitario?: number;
    quantidade: number;
    estoqueMinimo: number;
}

const formData: IEstoqueFormDataProps = {
    produtoId: '',
    codigoItem: '',
    nomeProduto: '',
    precoUnitario: 0,
    quantidade: 0,
    estoqueMinimo: 0,
};

export default function EstoquePage() {
    const [estoqueGeral, setEstoqueGeral] = useState<IEstoqueGeralProps | null>(null);
    const [editingProdutoId, setEditingProdutoId] = useState<string>('');
    const [dadosFormulario, setDadosFormulario] = useState<IEstoqueFormDataProps>(formData);
    const [showForm, setShowForm] = useState(false);

    const fetchEstoqueGeral = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/estoque');
            if (!response.ok) {
                if (response.status === 404) {
                    setEstoqueGeral(null);
                    return;
                }
                throw new Error("Falha ao carregar o estoque geral.");
            }
            const data: IEstoqueGeralProps = await response.json();
            setEstoqueGeral(data);
        } catch (error) {
            console.error("Erro ao carregar o estoque geral:", error);
        }
    }

    useEffect(() => {
        fetchEstoqueGeral();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDadosFormulario(prev => ({
            ...prev,
            [name]: name === 'quantidade' || name === 'estoqueMinimo' || name === 'precoUnitario' ? Number(value) : value
        }));
    }

    const handleEditProduto = (item: IEstoqueProps) => {
        const produtoData = item.produto as unknown as IProdutoProps;

        setEditingProdutoId(produtoData._id.toString());
        setDadosFormulario({
            produtoId: produtoData._id,
            codigoItem: produtoData.codigoItem || '',
            nomeProduto: produtoData.nome || '',
            precoUnitario: produtoData.precoUnitario || 0, // Popula o preço unitário
            quantidade: item.quantidade,
            estoqueMinimo: item.estoqueMinimo,
        });
        !showForm ? setShowForm(true) : null;
        window.scroll(0, 0);
    }

    const handleApagarProduto = async (item: IEstoqueProps) => {
        const produtoData = item.produto as unknown as IProdutoProps;
        if (!confirm(`Tem certeza que deseja remover o produto ${produtoData.codigoItem || produtoData._id} do estoque?`)) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:8000/api/estoque/${produtoData._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (!res.ok) {
                throw new Error("Erro ao remover o produto do estoque.");
            }

            setEditingProdutoId('');
            setDadosFormulario(formData);
            await fetchEstoqueGeral();
        } catch (error) {
            console.error("Erro ao apagar produto:", error);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const metodo: string = editingProdutoId ? "PUT" : "POST";
        const url: string = editingProdutoId ? `http://localhost:8000/api/estoque/${editingProdutoId}` : 'http://localhost:8000/api/estoque';

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    produtoId: dadosFormulario.produtoId,
                    codigoItem: dadosFormulario.codigoItem,
                    // --- ADICIONE ESTES CAMPOS AQUI ---
                    nome: dadosFormulario.nomeProduto, // O backend espera 'nome'
                    precoUnitario: dadosFormulario.precoUnitario, // O backend espera 'precoUnitario'
                    // ----------------------------------
                    quantidade: dadosFormulario.quantidade,
                    estoqueMinimo: dadosFormulario.estoqueMinimo
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Erro ao salvar o item no estoque.");
            }

            setDadosFormulario(formData);
            setEditingProdutoId('');
            setShowForm(false);
            await fetchEstoqueGeral();

        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert(error.message);
        }
    };


    return (
        <main className='min-h-screen bg-slate-900 text-white flex justify-center p-4 md:p-8 font-sans'>
            <div className="flex flex-col w-full max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-4">
                    Gerenciamento de Estoque
                </h1>

                <div className='bg-slate-800 p-6 mb-8 rounded-lg shadow-lg'>
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-semibold'>
                            {editingProdutoId ? 'Editar Item do Estoque' : 'Adicionar Item ao Estoque'}
                        </h2>
                        <button
                            type="button"
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            {showForm ? 'Fechar Formulário' : 'Abrir Formulário'}
                        </button>
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showForm ? 'max-h-[700px] opacity-100 mt-6 overflow-visible' : 'max-h-0 opacity-0'}`}>
                        <form onSubmit={handleSubmit} className='border-t border-slate-700 pt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Código do Produto (SKU)</span>
                                    <input
                                        type="text"
                                        name="codigoItem"
                                        value={dadosFormulario.codigoItem}
                                        onChange={handleInputChange}
                                        placeholder='Ex: SDK561154'
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        required
                                        disabled={!!editingProdutoId}
                                    />
                                </label>
                                {/* NOVOS CAMPOS PARA NOME E PREÇO DO PRODUTO */}


                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Nome do Produto</span>
                                    <input
                                        type="text"
                                        name="nomeProduto"
                                        value={dadosFormulario.nomeProduto}
                                        onChange={handleInputChange}
                                        placeholder='Nome do produto'
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        required={!editingProdutoId} // Obrigatório apenas na criação
                                    />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Preço Unitário</span>
                                    <input
                                        type="number"
                                        name="precoUnitario"
                                        onChange={handleInputChange}
                                        value={dadosFormulario.precoUnitario}
                                        placeholder='0.00'
                                        step="0.01" // Permite decimais
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        required={!editingProdutoId} // Obrigatório apenas na criação
                                    />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Quantidade</span>
                                    <input
                                        type="number"
                                        name="quantidade"
                                        onChange={handleInputChange}
                                        value={dadosFormulario.quantidade}
                                        placeholder='0'
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        required
                                    />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Estoque Mínimo</span>
                                    <input
                                        type="number"
                                        name="estoqueMinimo"
                                        onChange={handleInputChange}
                                        value={dadosFormulario.estoqueMinimo}
                                        placeholder='0'
                                        className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        required
                                    />
                                </label>
                            </div>
                            <div className="mt-6">
                                <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors">
                                    {editingProdutoId ? 'Atualizar Item' : 'Adicionar Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
                    <h2 className='text-2xl font-semibold mb-4'>Itens no Estoque</h2>
                    {estoqueGeral && estoqueGeral.itens.length > 0 ? (
                        <ul className='flex flex-col gap-4'>
                            {estoqueGeral.itens.map(item => (
                                <li key={item.produto ? (item.produto as unknown as IProdutoProps)._id?.toString() || `placeholder-${Math.random()}` : `placeholder-${Math.random()}`} className='flex flex-col bg-slate-700 p-4 rounded-lg gap-2'>
                                    <div className='flex flex-col gap-1'>
                                        <p className="font-bold text-white">
                                            Produto: {
                                                item.produto && typeof item.produto === 'object' && 'codigoItem' in item.produto
                                                    ? (item.produto as IProdutoProps).nome
                                                    : (item.produto && typeof item.produto === 'object' && '_id' in item.produto ? (item.produto as IProdutoProps)._id?.toString() : 'ID Desconhecido')
                                            }
                                        </p>
                                        {/* Exibir Nome do Produto e Preço se disponíveis */}
                                        {item.produto && typeof item.produto === 'object' && 'nome' in item.produto && (
                                            <p className="text-slate-300 text-sm">Código: {(item.produto as IProdutoProps).codigoItem}</p>
                                        )}
                                        {item.produto && typeof item.produto === 'object' && 'precoUnitario' in item.produto && (
                                            <p className="text-slate-300 text-sm">Preço: R$ {(item.produto as IProdutoProps).precoUnitario?.toFixed(2)}</p>
                                        )}
                                        <p className="text-slate-300 text-sm">Quantidade: {item.quantidade}</p>
                                        <p className="text-slate-400 text-sm">
                                            Estoque Mínimo: {item.estoqueMinimo}
                                        </p>
                                        {item.quantidade <= item.estoqueMinimo ? <span className='text-amber-400'>⚠ O estoque do produto está baixo!</span> : null}
                                    </div>
                                    <div className='flex items-center gap-2 self-end md:self-auto'>
                                        {item.produto && (
                                            <>
                                                <ActionButton<IEstoqueProps> item={item} onAction={handleEditProduto} buttonText='Editar' colorButton='blue' />
                                                <ActionButton<IEstoqueProps> item={item} onAction={handleApagarProduto} buttonText='Apagar' colorButton='red' />
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-400">Nenhum item no estoque ainda. Use o formulário acima para adicionar!</p>
                    )}
                </div>
            </div>
        </main>
    )
}