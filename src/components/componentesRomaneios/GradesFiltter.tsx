import { alterarPDespachadas } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'react-feather';
import { GradesRomaneio } from '../../../core';
import PageExcelRelatorio from '../componentesDePrint/PageExcelRelatorio';
import RomaneiosAll from '../componentesDePrint/RomaneiosAll';
import PageExcelNew from '../componentesDePrint/PageExcelNew';
import PageEntExcel from '../componentesDePrint/PageEntExcel';
import PageExcelNewfaltas from '../componentesDePrint/PageExcelNewfaltas';

interface GradeFilterProps {
  stat: string;
  expedicaoData: GradesRomaneio[];
  setDesp: (status: string) => void;
}

const fetcherAlterStatus = async (ids: number[]): Promise<number[] | null> => {
  try {
    const resp = await alterarPDespachadas(ids);
    return resp;
  } catch (error) {
    console.error("Erro ao atualizar status das grades:", error);
    return null;
  }
};

export default function GradesFilter({ stat, expedicaoData, setDesp }: GradeFilterProps) {

  const [expedidasIds, setExpedidasIds] = useState<number[]>([]);
  const [gradesRoman, setGradesRoman] = useState<GradesRomaneio[]>([]);
  const [escolasUnicas, setEscolasUnicas] = useState<string[]>([]);
  const [ajustStatus, setAjustStatus] = useState(false);
  const [reposicoes, setReposicoes] = useState<GradesRomaneio[]>([]);
  const [pedidosValidos, setPedidosValidos] = useState<GradesRomaneio[]>([]);
  const [escolasEntregues, setEscolasEntregues] = useState<string[]>([]);
  const [escolasParaEnvio, setEscolasParaEnvio] = useState<string[]>([]);
  const [message, setMessage] = useState<string>(`GERE OS RELATÓRIOS ANTES DA ALTERAÇÃO`);

  const groupedByStatus = useMemo(() => {
    return expedicaoData.reduce((acc, grade) => {
      if (!acc[grade.status]) acc[grade.status] = [];
      acc[grade.status].push(grade);
      return acc;
    }, {} as Record<string, GradesRomaneio[]>);
  }, [expedicaoData]);

  useEffect(() => {
    const ids = expedicaoData
      .filter(grade => grade.status === "EXPEDIDA")
      .map(grade => grade.id);
    setExpedidasIds(ids);
    const romanExpeds = expedicaoData.filter(grade => grade.status === "EXPEDIDA" || "DESPACHADA");
    setGradesRoman(romanExpeds);
    const pedRepo = expedicaoData.filter(grade => grade.tipo);
    setReposicoes(pedRepo);
    const pedValid = expedicaoData.filter(grade => !grade.tipo);
    setPedidosValidos(pedValid);
    const escolasParaEnvio = expedicaoData.filter(grade => grade.status === 'EXPEDIDA' && !grade.tipo);
    const escPEnvio = Array.from(new Set(escolasParaEnvio.map(grade => grade.escola)));
    setEscolasParaEnvio(escPEnvio);
    const escolasAtendidas = expedicaoData.filter(grade => grade.status === 'DESPACHADA' && !grade.tipo);
    const escAtendidas = Array.from(new Set(escolasAtendidas.map(grade => grade.escola)));
    setEscolasEntregues(escAtendidas);
    const uniqueEscolas = Array.from(new Set(expedicaoData.map(grade => grade.escola)));
    setEscolasUnicas(uniqueEscolas);
  }, [expedicaoData]);

  const abrirModalAjustStatus = () => {
    setAjustStatus(ajustStatus ? false : true);
  }

  const fecharModalAjustStatus = () => {
    setAjustStatus(ajustStatus ? false : true);
  }

  function calcularPorcentagem(parte: number, total: number): string {
    if (total === 0) return `${(0).toFixed(2)} %`.replace('.', ',');
    return `${((parte / total) * 100).toFixed(2)} %`.replace('.', ',');
  }

  const ajustarStatus = async (ids: number[]) => {
    const resp = await fetcherAlterStatus(ids);
    if (resp) {
      setExpedidasIds(resp);
      setMessage(`GRADES ALTERADAS COM OS SEGUINTES IDs:`);
      const timeout = setTimeout(() => {
        setDesp("DESPACHADA");
        setMessage(`GERE OS RELATÓRIOS ANTES DA ALTERAÇÃO`);
        setAjustStatus(false);
        setExpedidasIds([]);
        clearTimeout(timeout);
      }, 1000);
      return
    }
    setMessage(`ERRO AO MUDAR STATUS DAS GRADES`);
    const timeout = setTimeout(() => {
      setMessage(`TENTE NOVAMENTE`);
      clearTimeout(timeout);
    }, 1000);
    return
  }

  // Cores mais suaves para as bordas conforme status (opacidade reduzida)
  const statusBorders: any = {
    EXPEDIDA: 'border-green-600',
    DESPACHADA: 'border-blue-500',
    PRONTA: 'border-gray-500',
    IMPRESSA: 'border-purple-400',
    TODAS: 'border-pink-500',
  };

  // Fundo com transparência mínima e bordas mais suaves
  const statusBackgrounds: any = {
    EXPEDIDA: 'bg-green-600 bg-opacity-[1%]',
    DESPACHADA: 'bg-blue-600 bg-opacity-[1%]',
    PRONTA: 'bg-gray-300 bg-opacity-[1%]',
    IMPRESSA: 'bg-purple-600 bg-opacity-[1%]',
    TODAS: 'bg-gray-800 bg-opacity-[1%]',
  };

  const buttonBaseClassTheme =
    "rounded px-4 py-2 cursor-pointer transition-colors duration-300 fixed bottom-5 left-1/2 transform -translate-x-1/2 min-w-[400px]";

  const buttonBaseClassTheme2 =
    "rounded px-4 py-2 cursor-pointer transition-colors duration-300 fixed bottom-24 left-1/2 transform -translate-x-1/2 min-w-[400px]";

  const buttonClassTheme = `${buttonBaseClassTheme} bg-gray-700 text-gray-200 hover:bg-gray-600`;

  const buttonClassTheme2 = `${buttonBaseClassTheme2} bg-red-500 text-white hover:bg-red-600`;

  return (
    <div className="w-full px-6 py-4 bg-[#181818]">
      {Object.entries(groupedByStatus).map(([status, grades]) => {
        const totalItensPrev = grades.reduce(
          (sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.previsto, 0),
          0
        );
        const totalItens = grades.reduce(
          (sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.quantidade, 0),
          0
        );
        const totalCaixas = grades.reduce((sum, grade) => sum + grade.caixas.length, 0);

        return (
          <div
            key={status}
            className={`mb-10 p-6 border ${statusBorders[status] || 'border-gray-600'} rounded-lg ${statusBackgrounds[status]}
             border-opacity-40 mb-48`}
          >
            <h2 className="text-3xl font-semibold text-yellow-700 mb-4 uppercase"><span className='text-cyan-500 text-3xl pl-5'>{`STATUS: ${status}`}</span></h2>
            {grades.map((grade) => {
              const totalQuantidade = grade.tamanhosQuantidades.reduce((sum, item) => sum + item.quantidade, 0);
              const totalPrevisto = grade.tamanhosQuantidades.reduce((sum, item) => sum + item.previsto, 0);
              return (
                <div
                  key={grade.id}
                  className={`mb-6 p-4 border ${statusBorders[status] || 'border-gray-400'} rounded-md ${statusBackgrounds[status]} border-opacity-40`}
                >
                  <h3 className="text-2xl font-semibold text-teal-700 uppercase">
                    {`PROJETO: ${grade.projectname} - ${grade.company} - GRADE ID: `}<span className="text-cyan-500 pl-3 pr-3 font-normal text-2xl">{grade.id}</span>
                    <span className="text-yellow-500 pl-3 font-normal text-2xl">{`Última atualização: ${grade.update}`}</span>
                  </h3>
                  <p className="text-green-600 uppercase text-xl">Escola: {grade.escola} (Nº {grade.numeroEscola})</p>
                  <p className="text-green-600 uppercase text-xl">Número Join: {grade.numberJoin}</p>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-zinc-300 mb-2 uppercase">Itens Expedidos:</h4>
                    <table className="w-full text-zinc-400 border-collapse">
                      <thead>
                        <tr className={`border-b ${statusBorders[status]} border-opacity-30`}>
                          <th className="py-2 px-4 text-left uppercase w-[17%]">Item</th>
                          <th className="py-2 px-4 text-left uppercase w-[19%]">Gênero</th>
                          <th className="py-2 px-4 text-left uppercase w-[16%]">Tamanho</th>
                          <th className="py-2 px-4 text-left uppercase w-[16%]">À expedir</th>
                          <th className="py-2 px-4 text-left uppercase w-[16%]">Previsto</th>
                          <th className="py-2 px-4 text-left uppercase w-[16%]">Expedido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grade.tamanhosQuantidades.map((item, index) => (
                          <tr key={index} className={`border-b ${statusBorders[status]} border-opacity-60
                          ${item.previsto > item.quantidade ? 'bg-zinc-400 bg-opacity-[0.07]' : ''}`}>
                            <td className="py-2 px-4 uppercase text-left">{item.item}</td>
                            <td className="py-2 px-4 uppercase text-left">{item.genero}</td>
                            <td className="py-2 px-4 uppercase text-left">{item.tamanho}</td>
                            <td className="py-2 px-4 uppercase text-cyan-500 text-left">{item.previsto - item.quantidade}</td>
                            <td className="py-2 px-4 uppercase text-purple-500 text-left">{item.previsto}</td>
                            <td className="py-2 px-4 uppercase text-green-500 text-left">{item.quantidade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={`flex w-full flex-col items-start justify-center`}>
                    <div className={`flex w-full items-center justify-start`}>
                      <div className={`flex w-[20.1%] border-b border-dashed border-zinc-500 mb-2 items-center justify-start`}>
                        <p className="text-teal-400 mt-10 uppercase">
                          Total de itens previstos para a escola:
                        </p>
                      </div>
                      <div className={`flex w-auto`}>
                        <span className="text-purple-500 mt-10 pl-3 font-normal text-xl pb-3">{totalPrevisto}</span>
                      </div>
                    </div>
                    <div className={`flex w-full items-center justify-start`}>
                      <div className={`flex w-[20.1%] border-b border-dashed border-zinc-500 mb-2 items-center justify-start`}>
                        <p className="text-teal-400 uppercase">
                          Total de itens à expedir para a escola:
                        </p>
                      </div>
                      <div className={`flex w-auto`}>
                        <span className="text-cyan-500 pl-3 font-normal text-xl pb-3">{totalPrevisto - totalQuantidade}</span>
                      </div>
                    </div>
                    <div className={`flex w-full items-center justify-start`}>
                      <div className={`flex w-[20.1%] border-b border-dashed border-zinc-500 mb-2 items-center justify-start`}>
                        <p className="text-teal-400 uppercase">
                          Total de itens expedidos para a escola:
                        </p>
                      </div>
                      <div className={`flex w-auto`}>
                        <span className="text-green-500 pl-3 font-normal text-xl pb-3">{totalQuantidade}</span>
                      </div>
                    </div>
                    <div className={`flex w-full items-center justify-start`}>
                      <div className={`flex w-[20.1%] border-b border-dashed border-zinc-500 mb-2 items-center justify-start`}>
                        <p className="text-teal-400 uppercase">
                          Total de volumes para a escola:
                        </p>
                      </div>
                      <div className={`flex w-auto`}>
                        <span className="text-red-500 pl-3 font-normal text-xl pb-3">{grade.caixas.length}</span>
                      </div>
                    </div>
                    <div className={`flex w-full items-center justify-start`}>
                      <div className={`flex w-[20.1%] border-b border-dashed border-zinc-500 mb-2 items-center justify-start`}>
                        <p className="text-teal-400 uppercase">
                          concluído
                        </p>
                      </div>
                      <div className={`flex w-auto`}>
                        <span className="text-yellow-300 pl-3 font-normal text-xl pb-3">{calcularPorcentagem(totalQuantidade, totalPrevisto)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="text-right text-teal-500 font-normal uppercase">
              <p className="text-lg">Total de itens previstos do grupo: <span className="text-purple-500 pl-3 font-normal text-xl">{totalItensPrev}</span></p>
              <p className="text-lg">Total de itens à expedir do grupo: <span className="text-cyan-500 pl-3 font-normal text-xl">{totalItensPrev - totalItens}</span></p>
              <p className="text-lg">Total de itens expedidos do grupo: <span className="text-green-500 pl-3 font-normal text-xl">{totalItens}</span></p>
              <p className="text-lg">Total de volumes do grupo: <span className="text-red-500 pl-3 font-normal text-xl">{totalCaixas}</span></p>
            </div>
          </div>
        );
      })}
      <div className={`flex justify-center items-center flex-col fixed bottom-0 left-0 px-6 h-[150px] bg-[#1F1F1F] w-full
           text-center text-lg font-normal mt-10 pb-2 uppercase gap-y-2`}>
        <div className={`flex justify-start items-center`}>
          <h4 className="text-md font-semibold text-zinc-300 uppercase"></h4>
        </div>
        <div className="flex items-center justify-start  text-zinc-500 w-full border border-zinc-600 p-3 rounded-md">
          <div className='flex gap-x-10 items-center justify-start w-[100%]'>
            <p>Previstos com reposições:<span className='text-purple-500 text-2xl pl-5 text-left'>{expedicaoData.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.previsto, 0), 0)}</span></p>
            <p>Expedidos:<span className='text-green-500 text-2xl pl-5'>{pedidosValidos.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.quantidade, 0), 0)}</span></p>
            <p>Reposições:<span className='text-slate-300 text-2xl pl-5'>{reposicoes.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.quantidade, 0), 0)}</span></p>
            <p>Volumes:<span className='text-red-500 text-2xl pl-5'>{expedicaoData.reduce((sum, grade) => sum + grade.caixas.length, 0)}</span></p>
            {stat === 'TODAS' && (
              <>
                <p>Escolas atendidas:<span className='text-emerald-500 text-2xl pl-5'>{escolasEntregues.length}</span></p>
                <p>Escolas prontas para envio:<span className='text-blue-500 text-2xl pl-5'>{escolasParaEnvio.length}</span></p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center  text-zinc-500 w-full border border-zinc-600 p-3 rounded-md">
          <div className='flex gap-x-10 items-center justify-start w-[70%]'>
            <p>Previstos sem reposições:<span className='text-purple-500 text-2xl pl-5 text-left'>{pedidosValidos.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.previsto, 0), 0)}</span></p>
            <p>Grades:<span className='text-cyan-500 text-2xl pl-5'>{expedicaoData.length}</span></p>
            <p>Escolas:<span className='text-cyan-500 text-2xl pl-5'>{escolasUnicas.length}</span></p>
            <p>CONCLUÍDO<span className='text-yellow-300 text-2xl pl-5'>
              {calcularPorcentagem(expedicaoData.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.quantidade, 0), 0),
                expedicaoData.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.previsto, 0), 0))}</span>
            </p>
          </div>
          <div className='flex gap-x-6 items-center justify-end w-[30%]'>
            <div title='GERAÇÃO DE ROMANEIS DE EMBARQUE/ENTREGA'>
              {expedicaoData && (
                <RomaneiosAll romaneios={gradesRoman} data-tip="Clique aqui para mais informações" />
              )}
            </div>
            <div title='RELATÓRIO EM EXCEL FALTAS EM TEMPO REAL'>
              {expedicaoData && (
                <PageExcelNewfaltas expedicaoDataB={expedicaoData} />
              )}
            </div>
            <div title='RELATÓRIO EM EXCEL EXPEDIDOS NO DIA'>
              {expedicaoData && (
                <PageExcelNew expedicaoDataB={expedicaoData} />
              )}
            </div>
            <div title='RELATÓRIO EM EXCEL POR ENTREGA'>
              {expedicaoData && (
                <PageEntExcel expedicaoDataB={expedicaoData} />
              )}
            </div>
            <div title='RELATÓRIO EM EXCEL POR GRADE'>
              {expedicaoData && (
                <PageExcelRelatorio expedicaoData={expedicaoData} />
              )}
            </div>
            <button onClick={abrirModalAjustStatus} className="flex items-center justify-center text-[16px] px-6 py-1 min-w-[250px] h-[34px] bg-red-700 text-white rounded-md hover:bg-red-600">
              DESPACHAR
            </button>             
          </div>
        </div>
      </div>

      {expedidasIds.length > 0 && ajustStatus && (
        <div className={`fixed inset-0 z-50 bg-[#181818] bg-opacity-80 min-h-[105vh]
                lg:min-h-[100vh] flex flex-col pt-10
                justify-center items-center p-4`}>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white p-8 rounded-md shadow-md min-w-[30%] min-h-[40%]
                        flex flex-col items-center justify-center max-w-[800px]"
          >
            <div>
              <AlertTriangle size={90} color={`rgba(255, 0, 0, 1)`} />
            </div>
            <div className={`flex flex-col text-black w-full items-center justify-center`}>
              <h2 className={`text-[50px] font-bold`}>{`MUDANÇA DE STATUS`}</h2>
              <h2 className={`text-[30px] font-bold`}>{message}</h2>
              <div className={`flex items-center justify-center flex-wrap`}>
                <span className={`text-[25px] font-bold mr-2`}>
                  {`GRADES IDs AFETADOS:`}
                </span>
                {expedidasIds.map((id, index) => (
                  <span key={index} className={`text-[25px] text-red-700 font-bold mr-2`}>
                    {id}
                  </span>
                ))}
              </div>
              <span className={`text-[17px] font-bold`}>DESEJA MESMO ALTERAR O STATUS DAS GRADES?</span>
              <span className={`text-[17px] font-bold`}>A OPERAÇÃO NÃO PODERÁ SER REVERTIDA</span>
            </div>
          </motion.div>
          <button
            onClick={() => ajustarStatus(expedidasIds)}
            className={`${buttonClassTheme} hover:bg-green-600`}
          >
            {"AJUSTAR"}
          </button>
          <button
            onClick={fecharModalAjustStatus}
            className={buttonClassTheme2}
          >
            {"CANCELAR"}
          </button>
        </div>
      )}
    </div>
  );

}
