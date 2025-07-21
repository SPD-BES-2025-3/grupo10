// src/app/teste/page.tsx

// Adicionamos 'use client' para poder usar hooks de interatividade como useState e useEffect.
'use client';

import Error from 'next/error';
// Importamos os hooks necessários do React.
import React, { useState, useEffect } from 'react';

// --- (Opcional, mas recomendado) Definindo a "forma" do nosso objeto de usuário ---
// Isso ajuda a evitar erros, pois o TypeScript saberá o que esperar dos dados da API.

interface AddressSchema {
    _id: string,
    country: string,
    state: string,
    city: string,
    street: string
}


export default function AddressPage() {
  // --- SEÇÃO DE LÓGICA E ESTADO ---

  // Estado para guardar a lista de usuários que virão da API.
  const [address, setAddress] = useState<AddressSchema[]>([]);
  // Estado para controlar se os dados ainda estão sendo carregados.
  const [loading, setLoading] = useState(true);
  // Estado para guardar qualquer erro que possa ocorrer durante a busca.
  const [error, setError] = useState<string | null>(null);

  // --- SEÇÃO DE BUSCA DE DADOS (DATA FETCHING) ---

  // O hook useEffect executa o código dentro dele assim que o componente é montado na tela.
  // O array vazio `[]` no final garante que ele só execute UMA VEZ.
  useEffect(() => {
    // Criamos uma função `async` para poder usar `await` na chamada da API.
    const fetchAddress = async () => {
      try {
        // Faz a requisição para a sua API de backend.
        // Certifique-se que seu backend está rodando na porta 8000!
        const response = await fetch('http://localhost:8000/address');

        // Se a resposta não for OK (ex: erro 404 ou 500), nós lançamos um erro.
        if (!response.ok) {
          throw new Error("error");
        }

        // Convertemos a resposta para o formato JSON.
        const data: AddressSchema[] = await response.json();
        
        // Atualizamos nosso estado com os usuários recebidos.
        setAddress(data);
      } catch (err: Error | any) {
        // Se qualquer erro ocorrer no bloco `try`, ele será capturado aqui.
        setError(err.message);
      } finally {
        // Independentemente de sucesso ou erro, paramos de mostrar o "Carregando...".
        setLoading(false);
      }
    };

    fetchAddress(); // Chamamos a função para iniciar a busca.
  }, []); // O array vazio `[]` significa: "execute este efeito apenas uma vez".


  // --- SEÇÃO DE RENDERIZAÇÃO (JSX) ---

  return (
    <main className="bg-slate-900 min-h-screen p-8 text-white flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-4">
          Página de Teste com Dados da API
        </h1>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Lista de Endereços do Backend</h2>

          {/* Renderização Condicional */}
          {loading && <p className="text-yellow-400">Carregando endereços...</p>}

          {error && <p className="text-red-500 font-bold">Erro: {error}</p>}

          {/* Se não estiver carregando e não houver erro, mostramos a lista */}
          {!loading && !error && (
            <ul className="space-y-4">
              {address.map(address => (
                <li key={address._id} className="bg-slate-700 p-4 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg text-white">{address.country}</p>
                    <p className="text-slate-400">{address.state}</p>
                    <p className="text-slate-400">{address.city}</p>
                    <p className="text-slate-400">{address.street}</p>
                  </div>
                  <span className="text-xs font-mono bg-cyan-900 text-cyan-300 px-2 py-1 rounded">
                    ID: {address._id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}