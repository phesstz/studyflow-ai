"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from "react-hot-toast";

export default function ModoEstudo() {
  const router = useRouter();
  const supabase = createBrowserClient(
    'https://yfiukvjyvhjrohiklcbf.supabase.co',
    'sb_publishable_o-9LqegWA6o-IPl3PPRtHQ_lHrhdya7'
  );

  const [tempo, setTempo] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [materia, setMateria] = useState("");
  const [mostrarFoco, setMostrarFoco] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let intervalo: any;
    if (ativo) {
      intervalo = setInterval(() => setTempo((t) => t + 1), 1000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [ativo]);

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const finalizarSessao = async (focoNivel: number) => {
    setSalvando(true);
    const loadingToast = toast.loading("Sincronizando com a nuvem...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/");

      const { error } = await supabase
        .from('sessoes')
        .insert([{
          user_id: user.id,
          materia: materia || "Estudo Geral",
          duracao: tempo,
          foco: focoNivel,
          questoes_feitas: 0,
          questoes_acertos: 0
        }]);

      if (error) throw error;
      
      toast.success("Sessão salva com sucesso!", { id: loadingToast });
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erro ao salvar sessão.", { id: loadingToast });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans text-slate-900">
        <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-xl border border-slate-100">
          {!mostrarFoco ? (
            <div className="text-center">
              <input
                type="text"
                placeholder="O QUE ESTÁS A ESTUDAR?"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-center font-black text-indigo-600 outline-none focus:border-indigo-500 mb-8 uppercase tracking-widest"
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
              />
              <div className="text-7xl font-black italic tracking-tighter text-slate-900 mb-10">
                {formatarTempo(tempo)}
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => setAtivo(!ativo)}
                  className={`w-full py-5 rounded-3xl font-black text-lg transition-all ${
                    ativo ? "bg-slate-100 text-slate-400 border-2 border-slate-200" : "bg-slate-900 text-white shadow-lg"
                  }`}
                >
                  {ativo ? "PAUSAR" : "INICIAR ESTUDO"}
                </button>
                {tempo > 0 && !ativo && (
                  <button
                    onClick={() => setMostrarFoco(true)}
                    className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black text-lg shadow-indigo-200 shadow-xl"
                  >
                    CONCLUIR SESSÃO
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-black mb-2 italic">SESSÃO FINALIZADA!</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-8">Qual foi o seu nível de foco?</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((nivel) => (
                  <button
                    key={nivel}
                    disabled={salvando}
                    onClick={() => finalizarSessao(nivel)}
                    className="aspect-square rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-xl font-black hover:border-indigo-600 hover:text-indigo-600 transition-all text-slate-400"
                  >
                    {nivel}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => router.push("/dashboard")} className="mt-10 w-full text-slate-300 font-black text-[10px] tracking-[0.3em] hover:text-red-400 transition-colors uppercase">
            Sair sem salvar
          </button>
        </div>
      </main>
    </ProtectedRoute>
  );
}