import React, { useEffect, useState } from 'react';
import { Loader } from 'react-feather';
import { motion } from 'framer-motion';
import { Stock } from '../../../core';

interface ModalStockAtualizationProps {
  stock?: Stock;
  isOpenStock: boolean;
  messageStock: string;
  onCloseStock: () => void;
  mutateStock?: () => void; 
}

const ModalStockAtualization: React.FC<ModalStockAtualizationProps> = ({ isOpenStock, messageStock, onCloseStock, mutateStock }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<string>(messageStock);
  const [isError, setIsError] = useState(false);

  const getSoundForMessage = (message: string) => {
    if (message.includes('Grade finalizada')) {
      return '/caixasound.mp3';
    } else if (message.includes('Erro ao encerrar a grade')) {
      return '/error2.mp3';
    }
    return '/caixasound.mp3';
  };

  useEffect(() => {
    if (isOpenStock) {
      setMsg(messageStock); // Atualiza a mensagem ao abrir o modal
      const soundFile = getSoundForMessage(messageStock); // Obtém o som baseado na mensagem
      const audio = new Audio(soundFile); // Cria o novo áudio
      audio.play(); // Reproduz o som
    }
  }, [isOpenStock, messageStock]); // Executa o efeito quando `isOpen` ou `message` mudam

  const handleGerarCaixa = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
    
    } catch (error) {
    
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpenStock) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white p-8 rounded-md shadow-md min-w-[550px] min-h-[280px] gap-y-4 
      flex flex-col items-center justify-between"
      >
        <h2 className="text-3xl text-black font-semibold">
          <Loader
            className={isLoading ? 'animate-rotate' : ''}
            size={60}
            color={`rgba(234, 170, 0, 0.7)`}
          />
        </h2>
        <p className="flex text-[16px] text-black uppercase font-semibold text-center">{msg}</p>
        <div className={`flex justify-center items-center w-full`}>
          
        </div>
        <div className="flex w-full justify-between mt-4 gap-4">
          {/* Botão Encerrar Grade */}
          <button
            className={`w-full text-white px-12 py-2 rounded text-[14px] ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-700'}
            flex items-center justify-center`}
            onClick={onCloseStock}
            disabled={isLoading}
          >
            {isLoading ? 'Finalizando...' : isError ? 'Tentar Novamente' : 'Encerrar Caixa'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalStockAtualization;
