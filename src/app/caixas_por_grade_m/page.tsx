'use client';

import EtiquetasNew from '@/components/componentesDePrint/EtiquetasNew';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import ListaCaixas from '@/components/ComponentesInterface/ListaCaixas';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { getCaixasPorGrade } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Search } from 'react-feather';
import { Caixa } from '../../../core';

const fachBox = async (id: string): Promise<Caixa[]> => {
    return await getCaixasPorGrade(id);
};

export default function PaginaCaixasManual() {
    const botaoBuscarRef = useRef<HTMLButtonElement | null>(null);
    const botaoCancelarRef = useRef<HTMLButtonElement | null>(null);
    const botaoNovaPesquisaRef = useRef<HTMLButtonElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [tema, setTema] = useState<boolean>(false);
    const [caixas, setCaixas] = useState<Caixa[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalStatus, setModalStatus] = useState<boolean>(false);
    const [idparapesquisa, setIdparapesquisa] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [hasMounted, setHasMounted] = useState(false);
    const [totalGradeC, setTotalGradeC] = useState<number>(0);
    const [totalGradeI, setTotalGradeI] = useState<number>(0);

    useEffect(() => {
        setHasMounted(true); // ← indica que o client montou

        const timer = setTimeout(() => {
            setModalStatus(true);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {

        inputRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (modalStatus) {
                if (event.key === 'Enter') {
                    botaoBuscarRef.current?.click();
                } else if (event.key === 'ArrowRight') {
                    botaoCancelarRef.current?.click();
                }
            }

            if (event.key === 'ArrowLeft' && botaoNovaPesquisaRef.current) {
                botaoNovaPesquisaRef.current.click();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [modalStatus]);

    if (!hasMounted) return null;

    const buscarCaixas = async () => {
        if (!idparapesquisa) {
            setMessage('');
            return;
        }

        setLoading(true);
        try {
            const box = await fachBox(idparapesquisa);
            setCaixas(box);
            if (box.length > 0 && box[0].escolaCaixa) {
                document.title = `${box[0].escolaCaixa} - CAIXAS POR GRADE MANUAL`;
            }
            setModalStatus(false); // Fechar modal após sucesso
        } catch (error) {
            setMessage('');
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const resetPesquisa = () => {
        setCaixas([]);
        setIdparapesquisa('');
        setModalStatus(true);
    };

    const theme = () => {
        setTema(prev => !prev);
    };

    const printEti = (etiquetas: Caixa[], classnew: string) => {
        return (<EtiquetasNew etiquetas={etiquetas} classNew={classnew} />)
    }

    const setTotal = (num: number, num1: number) => {
        setTotalGradeC(num);
        setTotalGradeI(num1);
    }

    const colorButons = tema ? 'bg-zinc-300 text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-700 text-white hover:bg-zinc-600';

    return (
        <div className={`flex w-full ${tema ? 'bg-[#FFFFFF]' : 'bg-[#181818]'} flex-col min-h-[101vh] pt-[80px]`}>

            <TitleComponentFixed stringOne="LISTAGEM DE CAIXAS DA GRADE DE ID " stringTwo={`${idparapesquisa}`} />

            <div className={`flex w-full z-20 items-center justify-between gap-x-4 bg-[#202020] fixed top-[2.8rem] left-0 px-4 p-3 pt-4`}>
                <div className={`flex flex-row gap-x-5`}>
                    <button onClick={theme} className={`px-6 py-1 min-w-[50px] h-[34px] rounded-md ${colorButons}`}>
                        {tema ? "E" : "C"}
                    </button>

                    {/* Botão para nova pesquisa */}
                    <button
                        ref={botaoNovaPesquisaRef}
                        onClick={resetPesquisa}
                        className={`px-6 py-1 rounded-md ${colorButons}`}
                    >
                        NOVA PESQUISA
                    </button>
                    {caixas.length > 0 && (
                        <span

                            className={`px-6 py-1 rounded-md ${colorButons}`}
                        >
                            {printEti(caixas, '')}
                        </span>
                    )}
                </div>
                <div className={`flex flex-row items-center justify-center p-1 px-3 uppercase bg-black rounded-lg`}>
                    <span className={`flex text-[20px] text-slate-300 items-center justify-end`}>Total da grade por caixa:</span>
                    <span className={`pl-5 flex text-[25px] min-w-[110px] items-center justify-start text-yellow-500`}>{totalGradeC}</span>
                    <span className={`flex text-[20px] text-slate-300 items-center justify-end`}>Total da grade por itens:</span>
                    <span className={`pl-5 flex text-[25px] min-w-[110px] items-center justify-start text-emerald-500`}>{totalGradeI}</span>
                </div>
            </div>

            <div className="flex flex-col w-full justify-start items-center gap-y-1 pb-4">
                <div className="flex justify-center items-center w-full px-5 min-h-[90vh] pt-14">
                    {loading ? (
                        <IsLoading color={tema} />
                    ) : caixas.length === 0 && !modalStatus ? (
                        <p className={`text-center text-lg py-10 ${tema ? 'text-zinc-600' : 'text-zinc-400'}`}>
                            Nenhuma caixa encontrada para a grade de id {idparapesquisa}.
                        </p>
                    ) : (
                        <ListaCaixas caixas={caixas} tema={tema} setTotalGrade={setTotal} />
                    )}
                </div>
            </div>

            {/* MODAL */}
            {modalStatus && (
                <div className={`fixed inset-0 z-50 bg-[#181818] bg-opacity-80 flex flex-col justify-center items-center p-4`}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg- border border-gray-700 p-8 rounded-lg shadow-md min-w-[27%] flex flex-col items-center justify-center max-w-[800px]"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Search size={50} color="rgba(250, 250, 250, 0.5)" />
                        </motion.div>
                        <h2 className="text-[30px] font-bold text-slate-300 mb-8">{message}</h2>
                        <input
                            ref={inputRef}
                            type="text"
                            value={idparapesquisa}
                            onChange={(e) => setIdparapesquisa(e.target.value)}
                            placeholder="Digite o ID da grade"
                            className="border border-gray-400 rounded px-4 py-2 w-full mb-4 text-[25px] text-black"
                        />
                        <div className={`flex flex-row w-full items-center justify-center gap-x-8 mt-4`}>
                            <button
                                ref={botaoBuscarRef}
                                onClick={buscarCaixas}
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 w-[150px]"
                            >
                                Buscar
                            </button>
                            <button
                                ref={botaoCancelarRef}
                                onClick={() => setModalStatus(false)}
                                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 w-[150px]"
                            >
                                Cancelar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
