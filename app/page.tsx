"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const router = useRouter();
  
  // Inicializa o cliente do Supabase com as tuas chaves
  const supabase = createBrowserClient(
    'https://yfiukvjyvhjrohiklcbf.supabase.co',
    'sb_publishable_o-9LqegWA6o-IPl3PPRtHQ_lHrhdya7'
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // --- FUNÇÃO: LOGIN COM GOOGLE ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      alert("Erro ao conectar com Google: " + error.message);
      setLoading(false);
    }
  };

  // --- FUNÇÃO: LOGIN OU CADASTRO COM EMAIL ---
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Erro no login: " + error.message);
      else router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert("Erro ao criar conta: " + error.message);
      else alert("Verifique seu e-mail para confirmar o cadastro!");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Elemento Decorativo de Fundo */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-black shadow-lg">
              SF
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">StudyFlow</h1>
            <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">Acesso ao Sistema</p>
          </div>

          <div className="space-y-4">
            {/* BOTÃO GOOGLE */}
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border-2 border-slate-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              {loading ? "Processando..." : "Entrar com Google"}
            </button>

            <div className="flex items-center gap-4 my-8">
              <div className="h-[1px] bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ou use seu e-mail</span>
              <div className="h-[1px] bg-slate-100 flex-1"></div>
            </div>

            {/* FORMULÁRIO EMAIL/SENHA */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <input 
                type="email" 
                placeholder="E-mail profissional" 
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-indigo-600 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Sua senha secreta" 
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-indigo-600 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95 mt-4"
              >
                {loading ? "CARREGANDO..." : (isLogin ? "ENTRAR AGORA" : "CRIAR MINHA CONTA")}
              </button>
            </form>

            <div className="text-center mt-8">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                {isLogin ? "Ainda não tem conta? Registre-se" : "Já possui conta? Faça login"}
              </button>
            </div>
          </div>

          <p className="mt-10 text-[9px] text-center text-slate-300 font-bold uppercase tracking-[0.2em]">
            Encriptação de Nível Militar ativada
          </p>
        </div>
      </div>
    </main>
  );
}