'use client'

import { ActionButton } from '@/components/ActionButton'
import React, { useEffect, useState } from 'react'

export interface IResponsavelProps {
    _id: string,
    nome: string,
    cpf: string,
    email: string,
    telefone: string,
    cargo: string
}

// Define o estado inicial do formulário, garantindo que 'cargo' comece vazio.
const formData: Omit<IResponsavelProps, "_id"> = {
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    cargo: '' // Começa como string vazia
}

const cargos: Array<string> = ["AUXILIAR DE MANUTENÇÃO", "ASSISTENTE DE MANUTENÇÃO", "TÉCNICO EM MANUTENÇÃO"];

export default function ResponsavelPage() {
    const [responsaveis, setResponsaveis] = useState<IResponsavelProps[]>([]);
    const [idResponsavel, setIdResponsavel] = useState<string>('');
    const [dadosFormulario, setDadosFormulario] = useState(formData);
    const [showForm, setShowForm] = useState(false);

    const fetchResponsaveis = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/responsavel');
            if (!response.ok) {
                throw new Error("Falha ao carregar os responsáveis.");
            }
            const data: IResponsavelProps[] = await response.json();
            setResponsaveis(data);
        } catch (error) {
            console.error("Erro ao carregar os responsáveis:", error);
        }
    }

    useEffect(() => {
        fetchResponsaveis();
    }, []);

    // Handler de mudança unificado para inputs e selects
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDadosFormulario(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleEditResponsavel = (responsavel: IResponsavelProps) => {
        setIdResponsavel(responsavel._id);
        setDadosFormulario({
            nome: responsavel.nome,
            email: responsavel.email,
            cpf: responsavel.cpf,
            telefone: responsavel.telefone,
            cargo: responsavel.cargo
        })
        !showForm ? setShowForm(true) : null
        window.scroll(0, 0)
    }

    const handleApagarResponsavel = async (responsavel: IResponsavelProps) => {
        if (!confirm(`Tem certeza que deseja apagar o responsável ${responsavel.nome}?`)) {
            return;
        }
        try {
            await fetch(`http://localhost:8000/api/responsavel/${responsavel._id}`, {
                method: "DELETE"
            });
            await fetchResponsaveis();
        } catch (error) {
            console.error("Erro ao apagar responsável:", error);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const metodo: string = idResponsavel ? "PUT" : "POST";
        const url: string = idResponsavel ? `http://localhost:8000/api/responsavel/${idResponsavel}` : 'http://localhost:8000/api/responsavel';

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFormulario)
            });

            if (!res.ok) {
                // Tenta extrair uma mensagem de erro mais útil do backend
                const errorData = await res.json();
                throw new Error(errorData.message || "Ocorreu um erro ao salvar.");
            }
            
            setIdResponsavel('');
            setDadosFormulario(formData);
            await fetchResponsaveis();
            setShowForm(false);

        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert(`Erro ao salvar: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <main className='min-h-screen bg-slate-900 text-white flex justify-center p-4 md:p-8 font-sans'>
            <div className="flex flex-col w-full max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-4">
                    Gerenciamento de Responsáveis
                </h1>

                <div className='bg-slate-800 p-6 mb-8 rounded-lg shadow-lg'>
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-semibold'>
                            {idResponsavel ? 'Editar Responsável' : 'Adicionar Novo Responsável'}
                        </h2>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(!showForm);
                                if (showForm) { 
                                    setIdResponsavel('');
                                    setDadosFormulario(formData);
                                }
                            }}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            {showForm ? 'Fechar' : 'Adicionar Novo'}
                        </button>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                        <form onSubmit={handleSubmit} className='border-t border-slate-700 pt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {/* ... outros inputs ... */}
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Nome</span>
                                    <input type="text" name="nome" value={dadosFormulario.nome} onChange={handleInputChange} placeholder='Nome completo' className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Email</span>
                                    <input type="email" name="email" value={dadosFormulario.email} onChange={handleInputChange} placeholder='email@exemplo.com' className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">CPF</span>
                                    <input type="text" name="cpf" value={dadosFormulario.cpf} onChange={handleInputChange} placeholder='000.000.000-00' className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Telefone</span>
                                    <input type="tel" name="telefone" value={dadosFormulario.telefone} onChange={handleInputChange} placeholder='(00) 00000-0000' className="bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </label>
                                
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Cargo</span>
                                    <select 
                                        name="cargo"
                                        value={dadosFormulario.cargo}
                                        onChange={handleInputChange}
                                        className='bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                        required
                                    >
                                        <option value="" disabled>Selecione um cargo</option> {/* Placeholder */}
                                        {cargos.map(cargo => (
                                            <option key={cargo} value={cargo}>{cargo}</option> // 4. 'value' da option corrigido
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="mt-6">
                                <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors">
                                    Salvar Responsável
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
                    <h2 className='text-2xl font-semibold mb-4'>Responsáveis Cadastrados</h2>
                    <ul className='flex flex-col gap-4'>
                        {responsaveis.map(responsavel => (
                            <li key={responsavel._id} className='flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-700 p-4 rounded-lg gap-3'>
                                <div className='flex flex-col gap-1'>
                                    <p className="font-bold text-white">{responsavel.nome}</p>
                                    <p className="text-slate-400 text-sm">Cargo: {responsavel.cargo}</p>
                                    <p className="text-slate-400 text-sm">CPF: {responsavel.cpf}</p>
                                    <p className="text-slate-400 text-sm">Email: {responsavel.email}</p>
                                    {responsavel.telefone && <p className="text-slate-400 text-sm">Telefone: {responsavel.telefone}</p>}
                                </div>
                                <div className='flex items-center gap-2 self-end md:self-auto'>
                                    <ActionButton<IResponsavelProps> item={responsavel} onAction={handleEditResponsavel} buttonText='Editar' colorButton='blue' />
                                    <ActionButton<IResponsavelProps> item={responsavel} onAction={() => handleApagarResponsavel(responsavel)} buttonText='Apagar' colorButton='red' />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    )
}
