"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (type: 'email' | 'google') => {
    // Por enquanto, simulamos a lógica. 
    // No futuro, aqui entrará o 'supabase.auth.signInWithPassword'
    console.log(`Autenticando com ${type}...`);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans text-white">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden text-slate-900">
        
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-black">SF</div>
          <h1 className="text-2xl font-black tracking-tight">StudyFlow Cloud</h1>
          <p className="text-slate-400 text-sm font-medium">Sincronize o seu progresso no multiverso.</p>
        </div>

        <div className="space-y-4">
          {/* Botão Google */}
          <button 
            onClick={() => handleAuth('google')}
            className="w-full border-2 border-slate-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continuar com Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] bg-slate-100 flex-1"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase">Ou use e-mail</span>
            <div className="h-[1px] bg-slate-100 flex-1"></div>
          </div>

          {/* Campos de Texto */}
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-bold outline-none focus:border-indigo-600 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-bold outline-none focus:border-indigo-600 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            onClick={() => handleAuth('email')}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            {isLogin ? "ENTRAR" : "CRIAR CONTA"}
          </button>

          <p className="text-center text-xs font-bold text-slate-400 mt-6">
            {isLogin ? "Não tem conta?" : "Já tem conta?"} 
            <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 ml-1 hover:underline">
              {isLogin ? "Registre-se" : "Faça Login"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}