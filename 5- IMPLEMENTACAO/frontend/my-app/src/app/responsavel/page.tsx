'use client'

import React, { useEffect, useState } from 'react'

interface IResponsaveis {
    _id: string,
    nome: string,
    email: string,
    telefone: string
}

export default function ResponsavelPage() {

    const [responsaveis, setResponsaveis] = useState<IResponsaveis[]>([])

    useEffect(() => {
        const fetchResponsaveis = async () => {
            const data = await fetch('http://localhost:8000/responsavel');

            if (!data) {
                console.error("Erro ao carregar os responsáveis");
                window.alert("Erro ao carregar os responsáveis");
            }

            const responsaveis: IResponsaveis[] = await data.json()
            setResponsaveis(responsaveis);
        }
        fetchResponsaveis();
    }, []);

    return (
        <main className='default-page-layout'>
            <h1 className='text-cyan-400 text-2xl font-semibold mb-4'>Pagina de teste da API</h1>

            <ul>
                {responsaveis.map(responsavel => (
                    <li key={responsavel._id}>
                        <div>
                           <p>{responsavel.email}</p> 
                           <p>{responsavel.nome}</p> 
                           <p>{responsavel.telefone}</p> 
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    )
}