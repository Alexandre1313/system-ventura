import React from 'react';
import { ProjetoStockItems } from '../../../core';
import { getProjectsItemsSaldos } from '@/hooks_api/api';

interface StockRenderProps {
  id: string;
}

export default async function StockRender({ id }: StockRenderProps) {

  const stockRender: ProjetoStockItems | null = await getProjectsItemsSaldos(id);

  if (!stockRender) {
    return null;
  }

  return (
    <div className="p-6 flex flex-col w-full">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">{stockRender.nome}</h1>
      {stockRender.itens.map((item, index) => (
        <div key={index} className="mb-8 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-yellow-700">
            {item.nome} ({item.genero})
          </h2>
          <table className="min-w-full border-collapse border border-zinc-500">
            <thead>
              <tr className="bg-blue-700 text-white border-b border-blue-800">
                <th className="px-4 py-2 text-left border-r border-blue-800 w-[25%]">Tamanho</th>
                <th className="px-4 py-2 text-left border-r border-blue-800 w-[25%]">Estoque</th>
                <th className="px-4 py-2 text-left border-r border-blue-800 w-[25%]">Entradas</th>
                <th className="px-4 py-2 text-left w-[25%]">Saídas</th>
              </tr>
            </thead>
            <tbody>
              {item.tamanhos.map((tamanho, idx) => (
                <tr
                  key={idx}
                  className={tamanho.estoque < 0 ? 'text-red-500 font-semibold' : 'text-zinc-500 font-semibold'}
                >
                  <td className="px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.tamanho}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.estoque}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.entradas}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.saidas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
  
};
