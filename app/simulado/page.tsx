"use client";
import { useState, useEffect } from "react";

export default function SimuladoPage() {
  const [tema, setTema] = useState("");
  const [quantidade, setQuantidade] = useState(5);
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [respostasUsuario, setRespostasUsuario] = useState<{ [key: number]: number }>({});
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);

  // Lógica do Cronômetro
  useEffect(() => {
    let intervalo: any = null;
    if (ativo) {
      intervalo = setInterval(() => setSegundos((s) => s + 1), 1000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [ativo]);

  const formatarTempo = (t: number) => {
    const mins = Math.floor(t / 60);
    const segs = t % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const totalRespondidas = Object.keys(respostasUsuario).length;
  const concluido = questoes.length > 0 && totalRespondidas === questoes.length;
  const acertos = questoes.reduce((acc, q, idx) => (respostasUsuario[idx] === q.correta ? acc + 1 : acc), 0);
  const porcentagem = questoes.length > 0 ? Math.round((acertos / questoes.length) * 100) : 0;

  if (concluido && ativo) setAtivo(false);

  const gerarSimulado = async () => {
    setCarregando(true);
    setQuestoes([]);
    setRespostasUsuario({});
    setSegundos(0);
    try {
      const res = await fetch("/api/gerar-questoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema, quantidade }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestoes(data);
        setAtivo(true);
      } else alert("Erro ao gerar simulado.");
    } catch (e) { alert("Erro de conexão."); }
    finally { setCarregando(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-500">StudyFlow AI</h1>
            <p className="text-slate-500 text-sm">Aprenda com Inteligência Artificial</p>
          </div>
          {(ativo || concluido) && (
            <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-full font-mono text-xl text-blue-400">
              {formatarTempo(segundos)}
            </div>
          )}
        </header>

        {/* PLACAR FINAL */}
        {concluido && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl mb-10 text-center shadow-2xl animate-in zoom-in duration-500">
            <h2 className="text-2xl font-bold mb-2">Simulado Concluído!</h2>
            <div className="text-6xl font-black mb-6">{porcentagem}%</div>
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="opacity-70 uppercase">Tempo Total</p>
                <p className="text-xl font-bold">{formatarTempo(segundos)}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="opacity-70 uppercase">Total Acertos</p>
                <p className="text-xl font-bold">{acertos}/{questoes.length}</p>
              </div>
            </div>
            <button onClick={() => {setQuestoes([]); setTema("");}} className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all">
              Novo Simulado
            </button>
          </div>
        )}

        {/* BUSCA */}
        {!questoes.length && !carregando && (
          <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 shadow-xl mb-10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Tema do Simulado</label>
                <input 
                  type="text"
                  placeholder="Ex: Mitocôndrias, Guerra Fria, Python..."
                  className="w-full bg-[#1e293b] border border-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <select className="flex-1 bg-[#1e293b] border border-slate-700 rounded-2xl p-4 outline-none" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))}>
                  <option value={3}>3 Questões</option>
                  <option value={5}>5 Questões</option>
                  <option value={10}>10 Questões</option>
                </select>
                <button onClick={gerarSimulado} disabled={!tema} className="flex-[2] bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg disabled:opacity-50 transition-all shadow-lg shadow-blue-900/40">
                  Gerar Agora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {carregando && (
          <div className="text-center py-20 bg-[#0f172a] rounded-3xl border border-slate-800 border-dashed">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <p className="text-blue-400 font-medium animate-pulse">IA criando questões e explicações...</p>
          </div>
        )}

        {/* QUESTÕES */}
        <div className="space-y-6">
          {questoes.map((q, qIdx) => {
            const respondeu = respostasUsuario[qIdx] !== undefined;
            return (
              <div key={qIdx} className={`bg-[#0f172a] p-6 rounded-3xl border-2 transition-all ${respondeu ? 'border-slate-800' : 'border-slate-700'}`}>
                <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">Questão {qIdx + 1}</span>
                <h3 className="text-xl font-semibold my-4 leading-relaxed">{q.pergunta}</h3>
                <div className="grid gap-3">
                  {q.opcoes.map((opcao: string, oIdx: number) => {
                    const correta = oIdx === q.correta;
                    const escolhida = respostasUsuario[qIdx] === oIdx;
                    let cores = "bg-[#1e293b] border-slate-700 hover:border-blue-500";
                    if (respondeu) {
                      if (correta) cores = "bg-green-500/20 border-green-500 text-green-400";
                      else if (escolhida) cores = "bg-red-500/20 border-red-500 text-red-400";
                      else cores = "opacity-30 border-transparent cursor-default";
                    }
                    return (
                      <button key={oIdx} onClick={() => { if(!respondeu) setRespostasUsuario({...respostasUsuario, [qIdx]: oIdx}); }} disabled={respondeu} className={`text-left p-4 rounded-2xl border-2 transition-all font-medium ${cores}`}>
                        {opcao}
                      </button>
                    );
                  })}
                </div>
                {respondeu && (
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl animate-in fade-in slide-in-from-top-2">
                    <p className="text-blue-300 text-sm">
                      <span className="font-bold font-mono uppercase text-xs">Explicação:</span><br/>
                      {q.explicacao}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}