"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLocalProgress, saveLocalProgress } from "@/lib/mockData";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const data = getLocalProgress();
    if (data) {
      setName(data.userName || "");
      setObjetivo(data.objetivo || "Geral");
    }
  }, []);

  const salvarAlteracoes = () => {
    const data = getLocalProgress() || {};
    saveLocalProgress({
      ...data,
      userName: name,
      objetivo: objetivo
    });
    alert("Perfil atualizado, Morty! Tenta não estragar tudo.");
    router.push("/dashboard");
  };

  const resetarTudo = () => {
    if (confirm("Tens a certeza? Isto vai apagar todo o teu progresso. Até eu teria medo disso.")) {
      localStorage.removeItem("studyflow_demo_data");
      router.push("/login");
    }
  };

  if (!isClient) return null;

  return (
    <main className="min-h-screen bg-white font-sans p-6">
      <div className="max-w-md mx-auto pt-10">
        <header className="mb-10 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-black transition-colors text-2xl">←</button>
          <h1 className="text-2xl font-black tracking-tighter uppercase">Definições</h1>
          <div className="w-6"></div>
        </header>

        <div className="space-y-8">
          {/* Campo Nome */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-2">Como te chamas?</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-lg focus:border-black outline-none transition-all"
              placeholder="Ex: Rick Sanchez"
            />
          </div>

          {/* Campo Objetivo */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 ml-2">Qual é a tua missão?</label>
            <select 
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold outline-none appearance-none"
            >
              <option value="Medicina">Medicina</option>
              <option value="Engenharia">Engenharia</option>
              <option value="Concurso Público">Concurso Público</option>
              <option value="Geral">Estudo Geral</option>
            </select>
          </div>

          <div className="pt-10 space-y-4">
            <button 
              onClick={salvarAlteracoes}
              className="w-full bg-black text-white py-5 rounded-[24px] font-black text-lg hover:bg-gray-800 transition-all shadow-xl active:scale-95"
            >
              Guardar Alterações
            </button>

            <button 
              onClick={resetarTudo}
              className="w-full bg-white text-red-500 border-2 border-red-50 border-dashed py-4 rounded-[24px] font-bold text-sm hover:bg-red-50 transition-all"
            >
              Apagar Todo o Progresso
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}