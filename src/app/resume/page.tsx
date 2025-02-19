'use client'

import { useEffect, useState } from 'react';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { CreateServerSelectComponentProjects } from '@/components/componentesRomaneios/createServerSelectComponentProjects';
import { CreateServerSelectComponentRemessa } from '@/components/componentesRomaneios/createServerSelectComponentRemessa';
import { getFilterGrades } from '@/hooks_api/api';
import { GradesRomaneio } from '../../../core';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import GradesFilter from '@/components/componentesRomaneios/GradesFiltter';

const fetcherGradesPStatus = async (projectId: number, remessa: number, status: string): Promise<GradesRomaneio[] | null> => {
  try {
    const resp = await getFilterGrades(String(projectId), String(remessa), status);
    return resp;
  } catch (error) {
    console.error("Erro ao buscar grades:", error);
    return null;
  }
};

export default function ConsultaStatusGrades() {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [remessa, setRemessa] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("EXPEDIDA");
  const [data, setData] = useState<GradesRomaneio[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [serverSelect, setServerSelect] = useState<JSX.Element | null>(null);
  const [serverSelectRemessa, setServerSelectRemessa] = useState<JSX.Element | null>(null);

  // Função para buscar as grades com os filtros
  const loaderFilter = async () => {
    if (!projectId || !remessa || !status) return;
    
    setIsLoading(true);
    const res = await fetcherGradesPStatus(projectId, remessa, status);
    setData(res);
    setIsLoading(false);
  };

  // Atualiza as grades automaticamente quando os filtros mudam
  useEffect(() => {
    loaderFilter();
  }, [projectId, remessa, status]);

  // Carrega o seletor de projetos
  useEffect(() => {
    async function fetchServerSelect() {
      const selectComponent = await CreateServerSelectComponentProjects({
        onSelectChange: setProjectId,
      });
      setServerSelect(selectComponent);
    }
    fetchServerSelect();
  }, []);

  // Carrega o seletor de remessas quando o projeto muda
  useEffect(() => {
    if (!projectId) {
      setServerSelectRemessa(null);
      return;
    }

  async function fetchServerSelectRemessas() {
      const selectComponent = await CreateServerSelectComponentRemessa({
        onSelectChange: setRemessa,
        projectId,
      });
      setServerSelectRemessa(selectComponent);
    }
    fetchServerSelectRemessas();
  }, [projectId]);

  return (
    <div className="flex flex-col w-full items-start justify-center bg-[#181818]">
      <TitleComponentFixed stringOne="RELATÓRIOS DE SAÍDA" />
      <div className="flex flex-col items-center justify-start min-h-[95vh] pt-7 gap-y-5 w-full">
        <div className="flex w-full p-[1.1rem] pt-8 fixed bg-[#1F1F1F] gap-x-5">
          {/* Seletor de Status */}
          <select
            id="select-status"
            title="Selecione um status"
            className="flex w-[310px] bg-[#181818] py-2 px-3 text-[14px] text-zinc-400 no-arrow outline-none cursor-pointer h-[35px] border border-zinc-800"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="EXPEDIDA">EXPEDIDAS</option>
            <option value="DESPACHADA">DESPACHADAS</option>
            <option value="PRONTA">PRONTAS</option>
            <option value="IMPRESSA">IMPRESSAS</option>
            <option value="TODAS">TODAS</option>
          </select>

          {/* Seletor de Projeto */}
          {serverSelect ?? (
            <div className="flex flex-col justify-center items-start">
              <p className="flex w-[310px] bg-[#181818] py-2 px-2 pl-3 text-[14px] text-zinc-400 border border-zinc-800 outline-none cursor-pointer h-[35px]">
                SELECIONE O PROJETO
              </p>
            </div>
          )}

          {/* Seletor de Remessa */}
          {serverSelectRemessa ?? (projectId && (
            <div className="flex flex-col justify-center items-start">
              <p className="flex w-[310px] bg-[#181818] py-2 px-2 text-[14px] text-zinc-400 border border-zinc-800 outline-none cursor-pointer h-[35px]">
                AGUARDE...
              </p>
            </div>
          ))}

          {/* Botão de Busca */}
          <button onClick={loaderFilter} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            BUSCAR
          </button>
        </div>

        {/* Exibição dos Resultados */}
        <div className="flex w-full flex-col items-center justify-start pt-24">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-[82vh]">
              <IsLoading />
            </div>
          ) : data?.length ? (
            <GradesFilter expedicaoData={data}/>
          ) : (
            <div className="flex items-center justify-center w-full h-[82vh]">
              <p className="text-lg text-blue-500">NÃO HÁ DADOS PARA OS PARÂMETROS PESQUISADOS.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
