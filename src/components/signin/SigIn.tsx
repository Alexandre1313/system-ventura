'use client'

import { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import { useAuth } from '@/contexts/AuthContext';
import { siginn } from '@/hooks_api/api'; // Função que chama o backend para pegar o usuário
import { setCookie } from 'cookies-next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SigIn() {
    const { login, logout } = useAuth();  // Função de login do contexto
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();  // Agora usamos o hook useRouter
    const [isClient, setIsClient] = useState(false); // Estado para verificar se o componente foi montado

    useEffect(() => {
        // Marcar que o componente foi montado no cliente
        setIsClient(true);

        // Este código é para garantir que a imagem de fundo seja aplicada corretamente
        document.body.style.backgroundImage = "url('/planofundo2.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";

        return () => {
            // Limpa o estilo ao sair da página
            document.body.style.backgroundImage = "none";
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        try {
            const user = await siginn({ email, password });

            if (!user) {
                throw new Error('Credenciais inválidas');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Senha inválida');
            }

            // Armazenar o token no cookie
            setCookie('userToken', JSON.stringify(user), { maxAge: 60 * 60 * 24 });  // 1 dia de validade          
            login(user);
            setError(null);

            // Redireciona para a raiz após o login, mas só no lado do cliente
            if (isClient) {
                router.push('/');
            }
        } catch (error: any) {
            setError(error.message || 'Erro ao tentar fazer login');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-[100vh] w-[100%] bg-zinc-950">           
            <div className="relative z-10 flex flex-col items-center justify-center rounded-2xl w-[500px] bg-zinc-950 p-10 gap-y-12">
                <div className="flex flex-col items-center justify-center h-auto w-auto gap-y-10">
                    <Image
                        src={`/venturalogo.png`}
                        alt={`Logo da Empresa`}
                        width={250}
                        height={0}
                        priority
                        className="transition-transform duration-700 ease-in-out 
                        transform hover:scale-105 w-full h-full object-cover"/>
                    <h2 className={`flex text-[35px] text-white`}>LOGIN</h2>
                </div>

                <form onSubmit={handleSubmit} className="w-full justify-start flex flex-col items-center gap-8">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`rounded-md p-2 w-full min-h-[40px] text-zinc-800 font-normal text-[20px] outline-none`}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`rounded-md p-2 w-full min-h-[40px] text-zinc-800 font-normal text-[20px] outline-none`}
                        required
                    />
                    <div className={`flex flex-col w-full gap-y-14`}>
                        <div className={`flex gap-x-5 h-[20px] w-full`}>
                            <button type="submit"
                                className={`p-4 py-2 w-[50%] h-[35px] text-white cursor-pointer rounded-md 
                                font-semibold text-[14px] outline-none bg-slate-700 hover:bg-slate-500`}>
                                LOGIN
                            </button>
                            <button type="button"
                                onClick={logout}
                                className={`p-4 py-2 w-[50%] h-[35px] text-white cursor-pointer rounded-md 
                                    font-semibold text-[14px] outline-none bg-slate-700 hover:bg-slate-500`}>
                                LOGOUT
                            </button>
                        </div>
                        <div className={`flex justify-center items-center`}>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                    </div>
                </form>
            </div>          
        </div>
    );
}
