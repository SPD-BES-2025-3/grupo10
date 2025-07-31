'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Interfaces para os dados do dashboard
interface StatusCount {
    status: string;
    count: number;
}

interface DashboardData {
    totalMaquinarios: number;
    totalResponsaveis: number;
    totalManutencoes: number;
    manutencoesPorStatus: StatusCount[];
    maquinariosPorStatus: StatusCount[];
}

// Componente para os cartões de estatísticas
const StatCard = ({ title, value, icon }: { title: string, value: number, icon: string }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="text-3xl text-cyan-400">{icon}</div>
        <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/dashboard');
                if (!response.ok) {
                    throw new Error('Falha ao buscar dados do dashboard.');
                }
                const dashboardData = await response.json();
                setData(dashboardData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white">Carregando...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen bg-slate-900 text-red-500">Erro: {error}</div>;
    }

    return (
        <main className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-8">Dashboard de Manutenções</h1>

                {/* Seção de Cartões de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total de Maquinários" value={data?.totalMaquinarios || 0} icon="🚜" />
                    <StatCard title="Manutenções Registradas" value={data?.totalManutencoes || 0} icon="🔧" />
                    <StatCard title="Responsáveis Cadastrados" value={data?.totalResponsaveis || 0} icon="👥" />
                </div>

                {/* Seção de Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-white">Manutenções por Status</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data?.manutencoesPorStatus} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="status" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                                    labelStyle={{ color: '#d1d5db' }}
                                />
                                <Legend wrapperStyle={{ color: '#d1d5db' }} />
                                <Bar dataKey="count" name="Quantidade" fill="#22d3ee" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-white">Maquinários por Status</h2>
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data?.maquinariosPorStatus} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="status" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                                    labelStyle={{ color: '#d1d5db' }}
                                />
                                <Legend />
                                <Bar dataKey="count" name="Quantidade" fill="#818cf8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </main>
    );
}
