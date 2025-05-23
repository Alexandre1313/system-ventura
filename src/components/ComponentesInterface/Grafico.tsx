'use client'

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getGrafico } from '@/hooks_api/api';
import { Grafo } from '../../../core';

// Registrando as escalas e elementos do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Grafico() {
    const [labels, setLabels] = useState<string[]>([]);
    const [quantidadeTotal, setQuantidadeTotal] = useState<number[]>([]);
    const [quantidadeExpedida, setQuantidadeExpedida] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);  // Estado de carregamento

    // UseEffect para buscar os dados da API assim que o componente for montado
    useEffect(() => {
        const fetchData = async () => {
            try {
                const projetos = await getGrafico();

                // Preparar os dados da resposta da API
                const labelsData = projetos.map((projeto: Grafo) => projeto.nomeProjeto);
                const quantidadeTotalData = projetos.map((projeto: Grafo) => projeto.quantidadeTotal);
                const quantidadeExpedidaData = projetos.map((projeto: Grafo) => projeto.quantidadeExpedida);

                // Atualizando o estado com os dados recebidos
                setLabels(labelsData);
                setQuantidadeTotal(quantidadeTotalData);
                setQuantidadeExpedida(quantidadeExpedidaData);

                setLoading(false);  // Finaliza o carregamento
            } catch (error) {
                console.error('Erro ao buscar os dados dos projetos:', error);
                setLoading(false);  // Finaliza o carregamento em caso de erro
            }
        };

        fetchData();  // Chama a função para buscar os dados
    }, []);  // Executa apenas uma vez, quando o componente for montado

    // Verificar se os dados estão carregando ou não
    if (loading) {
        return (
            <div className='flex w-full items-center justify-center'>
                <p>Carregando dados...</p>
            </div>
        )
    }

    // Dados do gráfico
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Quantidade Total',
                data: quantidadeTotal,
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                barThickness: 40,
            },
            {
                label: 'Quantidade Expedida',
                data: quantidadeExpedida,
                backgroundColor: 'rgba(153,102,255,0.6)',
                borderColor: 'rgba(153,102,255,1)',
                borderWidth: 2,
                barThickness: 40,
            },
        ],
    };

    // Renderiza o gráfico com os dados preparados
    return (
        <div className='flex w-full items-center justify-center'>
            <Bar className='flex w-full items-center justify-center'
                data={data}
                options={{
                    responsive: true,
                    plugins: {
                        tooltip: {
                            enabled: true,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Cor do fundo do tooltip
                            titleColor: 'white',  // Cor do título do tooltip
                            bodyColor: 'white',  // Cor do corpo do tooltip
                            titleFont: {
                                size: 16,  // Tamanho da fonte do título
                                weight: 'bold',  // Peso da fonte do título
                            },
                            bodyFont: {
                                size: 14,  // Tamanho da fonte do corpo
                                weight: 'normal',  // Peso da fonte do corpo
                            },
                            padding: 10,  // Padding do tooltip                           
                        },
                    },
                    scales: {
                        x: {
                            stacked: false,
                            ticks: {
                                color: '#f8f8ff',
                                font: {
                                    size: 14,
                                },
                            },
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#f8f8ff',
                                font: {
                                    size: 14,
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    );
}
