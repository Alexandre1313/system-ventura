import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import ProjetoComponentNew from '@/components/ComponentesProjeto/ProjetoComponentNew';
import { Projeto } from '../../../core';
import { get } from "../../hooks_api/api";

export const revalidate = 0;

// Componente com data fetching assíncrono
export default async function Projetos() {
    try {
        // Busca de dados diretamente no servidor
        const projetos: Projeto[] = await get();

        return (
            <div className="flexColCS p-4 pt-14">
                <TitleComponentFixed stringOne={`PROJETOS`} />
                <div className="flexColCS min-h-[96vh] border border-transparent rounded-lg
                  p-4 pt-7 lg:p-9 gap-y-5 lg:gap-y-10">
                    <div className="flexRRFE max-w-[1300px] border border-transparent 
                      rounded-lg gap-x-6 flex-wrap gap-y-6 p-1 lg:p-3">
                        {
                            projetos.length > 0 ? (
                                projetos
                                    .sort((a, b) => a.nome.localeCompare(b.nome))
                                    .map((p) => (
                                        <ProjetoComponentNew key={p.id} projeto={p} />
                                    ))
                            ) : (
                                <p>Nenhum projeto encontrado.</p>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    } catch (error: any) {
        return (
            <div className='flex items-center justify-center min-h-[95vh] w-[100%]'>
                <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>
                    Erro: {error.message}
                </p>
            </div>
        );
    }
}
