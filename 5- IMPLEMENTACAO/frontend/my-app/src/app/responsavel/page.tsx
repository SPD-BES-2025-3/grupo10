'use client'

import { ActionButton } from '@/components/ActionButton'
import React, { useEffect, useState } from 'react'


export interface IResponsavelProps {
    _id: string,
    nome: string,
    email: string,
    telefone: string
}

const formData: Omit<IResponsavelProps, "_id"> = {
    nome: '',
    email: '',
    telefone: ''
}

const cargos: Array<string> = ["AUXILIAR DE MANUTENÇÃO", "ASSISTENTE DE MANUTENÇÃO", "TÉCNICO EM MANUTENÇÃO"]

export default function ResponsavelPage() {

    const [responsaveis, setResponsaveis] = useState<IResponsavelProps[]>([]);
    const [idResponsavel, setIdResponsavel] = useState<String>('');
    const [dadosFormulario, setDadosFormulario] = useState(formData)
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
            // Em um app real, você usaria um modal de erro aqui
        }
    }
    useEffect(() => {
        fetchResponsaveis();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            telefone: responsavel.telefone
        })

        !showForm ? setShowForm(true) : null

        window.scroll(0, 0)
    }

    const handleApagarResponsavel = async (responsavel: IResponsavelProps) => {
        setIdResponsavel(responsavel._id);

        try {
            await fetch(`http://localhost:8000/api/responsavel/${idResponsavel}`, {

                method: "DELETE",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(dadosFormulario)
            });

            setDadosFormulario(formData);

            await fetchResponsaveis();
        } catch (error) {
            console.error(error)
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
                throw new Error("Erro ao criar responsável");
            }

            setDadosFormulario(formData); // Reseta o formulário

            await fetchResponsaveis();

        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    };


    return (
        <main className='min-h-screen bg-slate-900 text-white flex justify-center p-4 md:p-8 font-sans'>
            <div className="flex flex-col w-full max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-4">
                    Gerenciamento de Responsáveis
                </h1>

                {/* Seção do Formulário que será animada */}
                <div className='bg-slate-800 p-6 mb-8 rounded-lg shadow-lg'>
                    <div className="flex justify-between items-center">
                        <h2 className='text-2xl font-semibold'>
                            {showForm ? 'Dados do Responsável' : 'Adicionar Novo Responsável'}
                        </h2>
                        <button
                            type="button"
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            {showForm ? 'Fechar Formulário' : 'Adicionar Novo'}
                        </button>
                    </div>

                    {/* Contêiner da Animação */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showForm ? 'max-h-[500px] opacity-100 mt-6 overflow-visible' : 'max-h-0 opacity-0'}`}>
                        <form className='border-t border-slate-700 pt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Nome</span>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={dadosFormulario.nome}
                                        onChange={handleInputChange}
                                        placeholder='Nome completo'
                                        className=""
                                    />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="">Email</span>
                                    <input
                                        type="email"
                                        name="email"
                                        onChange={handleInputChange}
                                        value={dadosFormulario.email}
                                        placeholder='email@exemplo.com'
                                        className=""
                                    />
                                </label>
                                <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Telefone</span>
                                    <input
                                        type="tel"
                                        name="telefone"
                                        onChange={handleInputChange}
                                        value={dadosFormulario.telefone}
                                        placeholder='(00) 00000-0000'
                                        className=""
                                    />
                                </label>
                                {/* <label className='flex flex-col gap-1'>
                                    <span className="text-sm font-medium text-slate-300">Cargo</span>
                                    <select className='bg-slate-700 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500'>
                                        <option disabled selected>Selecione um cargo</option>
                                        {cargos.map(cargo => (
                                            <option key={cargo} value={cargo}>{cargo}</option>
                                        ))}
                                    </select>
                                </label> */}
                            </div>
                            <div className="mt-6">
                                <button type="submit" onClick={handleSubmit} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors">
                                    Salvar Responsável
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Listagem de Responsáveis */}
                <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
                    <h2 className='text-2xl font-semibold mb-4'>Responsáveis Cadastrados</h2>
                    <ul className='flex flex-col gap-4'>
                        {responsaveis.map(responsavel => (
                            <li key={responsavel._id || responsavel.email} className='flex flex-col bg-slate-700 p-4 rounded-lg gap-2'>
                                <a href={`http://localhost:3000/responsavel/${responsavel._id}`} className='flex flex-col '>
                                    <div className='flex flex-col gap-1'>
                                        <p className="font-bold text-white">{responsavel.nome}</p>
                                        <p className="text-slate-300 text-sm">{responsavel.email}</p>
                                        <p className="text-slate-400 text-sm">{responsavel.telefone}</p>
                                    </div>
                                </a>
                                <div className='flex items-center gap-2 self-end md:self-auto'>
                                    <ActionButton<IResponsavelProps> item={responsavel} onAction={handleEditResponsavel} buttonText='Editar' colorButton='blue' />
                                    <ActionButton<IResponsavelProps> item={responsavel} onAction={handleApagarResponsavel} buttonText='Apagar' colorButton='red' />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    )
}
