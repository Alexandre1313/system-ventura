import Image from "next/image";
import Link from "next/link";
import Projeto from "../../../core/interfaces/Projeto";
import { convertSPTime } from "../../../core/utils/tools";

interface ProjetoComponentProps {
    projeto: Projeto; // Define que você espera um objeto Projeto
}

export default function ProjetoComponent({ projeto }: ProjetoComponentProps) {
    return (
        <Link href={`/escolas/${projeto.id}`} target={'_SELF'}>
            <div className="flexColCS border rounded-lg border-gray-800 max-w-[350px] lg:max-w-[240px]
             min-h-[390px] lg:min-h-[310px] shadow hover:border-gray-700 transition-colors duration-700
             transform lg:transition-transform lg:duration-300 hover:-translate-y-2">
                <div className="flexColCS overflow-hidden rounded-lg">
                    <Image
                        src={projeto.url}
                        alt={`bandeira de ${projeto.nome}`}
                        width={500}
                        height={310}
                        priority
                        className="transition-transform duration-700 ease-in-out 
                        transform hover:scale-105 w-full h-full object-cover"
                    />
                </div>
                <div className="flexColCC gap-y-2 p-5 lg:p-4 pt-10 w-full">
                    <span className="flex text-center text-2xl lg:text-lg font-bold text-teal-700">{projeto.nome}</span>
                    <span className="font-semibold text-[13px] lg:text-[12px] text-zinc-400">{projeto.descricao}</span>
                    <span className="text-[13px] lg:text-[11px] text-zinc-400">{`Cadastrado em: ${convertSPTime(projeto.createdAt)}`}</span>
                    <span className="text-[13px] lg:text-[11px] text-zinc-400">{`Modificado em: ${convertSPTime(projeto.updatedAt)}`}</span>
                </div>
            </div>
        </Link>
    )
}
