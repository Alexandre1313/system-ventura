'use client'

import Image from "next/image";
import Link from "next/link";
//import { useEffect } from "react";

export default function Home() {

  /*useEffect(() => {
    // Este código é para garantir que a imagem de fundo seja aplicada corretamente
    document.body.style.backgroundImage = "url('/background.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    return () => {
      // Limpa o estilo ao sair da página
      document.body.style.backgroundImage = "none";
    };
  }, []);*/ 
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <Image
          className="transition-transform duration-700 ease-in-out transform hover:scale-105"
          src="/venturalogo.png"
          alt="ventura.js logo"
          width={650}
          height={0}        
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Ventura Systems{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
            </code>
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">         
          <Link href={'/projetos'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              EXPEDIÇÃO...
            </a>
          </Link>
          <Link href={'/entradas_embalagem'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              EMBALAGEM...
            </a>
          </Link>
          <Link href={'/romaneios_despacho'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              DESPACHO...
            </a>
          </Link>
          <Link href={'/estoques'} legacyBehavior>
            <a
              className="rounded-md border border-solid border-white/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-[12px] h-10 sm:h-8 px-4 sm:px-5 sm:min-w-40"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              MOVIMENTAÇÕES...
            </a>
          </Link>
        </div>
      </main>
      <footer className="row-start-3 items-center justify-center">
        <div className={`row-start-3 flex gap-6 flex-wrap items-center justify-center`}>
          <Link href={'/entradas_embalagem'} legacyBehavior>
            <a
              className="flex items-center text-[13px] gap-2 hover:underline hover:underline-offset-4"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="https://nextjs.org/icons/file.svg"
                alt="File icon"
                width={16}
                height={0}              
                priority
              />
              Run Packages →
            </a>
          </Link>
          <Link href={'/romaneios_despacho'} legacyBehavior>
            <a
              className="flex items-center text-[13px] gap-2 hover:underline hover:underline-offset-4"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="https://nextjs.org/icons/window.svg"
                alt="Window icon"
                width={16}
                height={0}           
                priority
              />
              Run Shipping Manifests →
            </a>
          </Link>
          <Link href={'/projetos'} legacyBehavior>
            <a
              className="flex button items-center text-[13px] gap-2 hover:underline hover:underline-offset-4"
              href=""
              target=""
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="https://nextjs.org/icons/globe.svg"
                alt="Globe icon"
                width={16}
                height={0}              
                priority              
              />
              Run Projects →
            </a>
          </Link>
        </div>
        <div className={`row-start-3 flex gap-6 flex-wrap text-[13px] items-center justify-center pt-14 text-zinc-600`}>
        © {new Date().getFullYear()} - {`Ventura Têxtil`} - All rights reserved.
        </div>
      </footer>
    </div>
  );
}
