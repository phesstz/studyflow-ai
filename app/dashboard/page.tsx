"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr'; // Peça nova de 2025
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const router = useRouter();
  
  // Inicialização correta com as suas chaves
  const supabase = createBrowserClient(
    'https://yfiukvjyvhjrohiklcbf.supabase.co',
    'sb_publishable_o-9LqegWA6o-IPl3PPRtHQ_lHrhdya7'
  );
  
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<any>(null);
  const [sessoes, setSessoes] = useState<any[]>([]);

  const [stats, setStats] = useState({
    tempoTotal: 0, taxaAcerto: "0", focoMedio: "0", minutosHoje: 0, chartData: []
  });

  const [xpStats, setXpStats] = useState({
    level: 1, currentXp: 0, rank: "Recruta"
  });

  useEffect(() => {
    const fetchDados = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Busca Perfil
      const { data: profileData } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single();

      // Busca Sessões
      const { data: sessionsData } = await supabase
        .from('sessoes')
        .select('*')
        .eq('user_id', user.id)
        .order('criado_em', { ascending: true });

      if (profileData) setPerfil(profileData);
      if (sessionsData) {
        setSessoes(sessionsData);
        processarStats(sessionsData);
      }
      
      setLoading(false);
    };

    fetchDados();
  }, [supabase]);

  const processarStats = (data: any[]) => {
    const hoje = new Date().toLocaleDateString();
    
    const totalMinutos = data.reduce((acc, s) => acc + Math.floor(s.duracao / 60), 0);
    const totalAcertos = data.reduce((acc, s) => acc + (s.questoes_acertos || 0), 0);
    const totalFeitas = data.reduce((acc, s) => acc + (s.questoes_feitas || 0), 0);
    const tHoje = data.filter(s => new Date(s.criado_em).toLocaleDateString() === hoje)
                     .reduce((acc, s) => acc + s.duracao, 0);

    const xp = data.reduce((acc, s) => acc + (Math.floor(s.duracao / 60) * 10) + (s.questoes_acertos * 50), 0);
    const lvl = Math.floor(xp / 1000) + 1;
    const ranks = ["Jerry", "Morty", "Summer", "Beth", "Rick"];

    setXpStats({
      level: lvl,
      currentXp: xp % 1000,
      rank: ranks[Math.min(lvl - 1, 4)]
    });

    setStats({
      tempoTotal: totalMinutos,
      taxaAcerto: totalFeitas > 0 ? ((totalAcertos / totalFeitas) * 100).toFixed(0) : "0",
      focoMedio: data.length > 0 ? (data.reduce((acc, s) => acc + s.foco, 0) / data.length).toFixed(1) : "0",
      minutosHoje: Math.floor(tHoje / 60),
      chartData: data.slice(-7).map((s, i) => ({
        name: `S${i+1}`,
        foco: s.foco * 20,
        acerto: s.questoes_feitas ? (s.questoes_acertos / s.questoes_feitas) * 100 : 0
      })) as any
    });
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-indigo-500 font-black italic">CONECTANDO AO BANCO...</div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32 text-slate-900">
        
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex justify-between items-center mb-3">
            <span className="text-xl font-black tracking-tighter italic text-indigo-600">StudyFlow</span>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{xpStats.rank}</p>
                <p className="text-sm font-bold text-slate-400 italic">Mestre {perfil?.username || 'Explorador'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black border-2 border-indigo-500">
                {xpStats.level}
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(xpStats.currentXp / 1000) * 100}%` }}></div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6 pt-10">
  
  {/* --- SEÇÃO 1: META DIÁRIA --- */}
  <section className="mb-10 bg-indigo-600 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
    <div className="relative z-10">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-80">Meta de Hoje</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-black italic">{stats.minutosHoje}</span>
        <span className="text-xl font-bold opacity-60">/ 60 min</span>
      </div>
      <div className="mt-6 h-3 w-full bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-1000" 
          style={{ width: `${Math.min((stats.minutosHoje / 60) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
    {/* Círculos decorativos Rick & Morty */}
    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
  </section>

  {/* --- SEÇÃO 2: GRID DE CARDS (Onde estava vazio) --- */}
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:scale-105 transition-transform">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Estudado</p>
      <p className="text-2xl font-black text-slate-900">{stats.tempoTotal}m</p>
    </div>
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:scale-105 transition-transform">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Taxa de Acerto</p>
      <p className="text-2xl font-black text-emerald-500">{stats.taxaAcerto}%</p>
    </div>
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:scale-105 transition-transform col-span-2 md:col-span-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Foco Médio</p>
      <p className="text-2xl font-black text-indigo-600">{stats.focoMedio}/5</p>
    </div>
  </div>

  {/* --- SEÇÃO 3: GRÁFICO DE EVOLUÇÃO --- */}
  <section className="mb-10 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-black uppercase text-xs tracking-[0.2em] text-slate-400">Desempenho Semanal</h3>
      <div className="flex gap-4 text-[10px] font-bold">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> FOCO</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> ACERTOS</span>
      </div>
    </div>
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={stats.chartData}>
          <defs>
            <linearGradient id="colorFoco" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" hide />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="foco" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorFoco)" />
          <Area type="monotone" dataKey="acerto" stroke="#10b981" strokeWidth={4} fill="transparent" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </section>

  {/* --- SEÇÃO 4: BOTÕES DE AÇÃO (Começar Estudos / Simulado) --- */}
  <div className="grid grid-cols-2 gap-4 mb-10">
    <button 
      onClick={() => router.push("/estudo")}
      className="bg-slate-900 text-white p-6 rounded-[32px] font-black italic hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
    >
      🚀 COMEÇAR ESTUDOS
    </button>
    <button 
      onClick={() => router.push("/simulado")}
      className="bg-white text-slate-900 border-2 border-slate-100 p-6 rounded-[32px] font-black italic hover:border-indigo-600 transition-all active:scale-95 shadow-sm"
    >
      🎯 NOVO SIMULADO
    </button>
  </div>

  {/* --- SEÇÃO 5: HISTÓRICO --- */}
  <section>
    <h3 className="text-xl font-black mb-6 italic text-slate-900 underline decoration-indigo-500 underline-offset-8">
      Histórico da Nuvem
    </h3>
    <div className="space-y-3">
      {sessoes.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic">Nenhuma sessão na nuvem. Vamos estudar, Morty!</p>
        </div>
      ) : (
        sessoes.slice().reverse().map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
            {/* ... Conteúdo do item do histórico que já fizemos ... */}
          </div>
        ))
      )}
    </div>
  </section>
</main>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full flex gap-10 shadow-2xl z-50">
            <button className="text-indigo-400" onClick={() => window.location.reload()}>🏠</button>
            <button onClick={() => router.push("/simulado")}>🎯</button>
            <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}>🚪</button>
        </div>
      </div>
    </ProtectedRoute>
  );
}