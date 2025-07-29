'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ResponsavelIdPage() {
    const { id } = useParams()
    const [responsavel, setResponsavel] = useState<any>()

    useEffect(() => {
        const fetchResponsavel = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/responsavel/${id}`);
                const json = await res.json();
                setResponsavel(json.data); // ← Aqui está o dado certo
            } catch (error) {
                console.error('Erro ao buscar responsável:', error);
            }
        };


        if (id) fetchResponsavel()
    }, [id])

    if (!responsavel) {
        return <p className="text-slate-400 p-4">Carregando dados do responsável...</p>
    }

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>Detalhes do Responsável</h1>
            <p><strong>Nome:</strong> {responsavel.nome}</p>
            <p><strong>Email:</strong> {responsavel.email}</p>
            <p><strong>Telefone:</strong> {responsavel.telefone}</p>
        </div>
    )
}
