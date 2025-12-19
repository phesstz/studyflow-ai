"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_QUESTIONS, saveLocalProgress } from "@/lib/mockData";

export default function Diagnostico() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento de 800ms
    const timer = setTimeout(() => {
      setQuestions(MOCK_QUESTIONS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = (optionIndex: number) => {
    const currentQuestion = questions[index];
    const isCorrect = optionIndex === currentQuestion.answer;
    
    const newAnswers = [...answers, { 
      questionId: currentQuestion.id, 
      isCorrect,
      materia: currentQuestion.materia 
    }];
    
    setAnswers(newAnswers);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      // Finaliza e salva no LocalStorage
      const acertos = newAnswers.filter(a => a.isCorrect).length;
      const performance = (acertos / questions.length) * 100;
      
      saveLocalProgress({
        status: "concluido",
        acertos,
        total: questions.length,
        percentual: performance,
        dataFinalizacao: new Date().toISOString()
      });
      
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Sincronizando frequências dimensionais...</p>
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Barra de Progresso */}
        <div className="w-full h-2 bg-gray-100">
          <div 
            className="h-full bg-black transition-all duration-300" 
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {q.materia}
            </span>
            <span className="text-xs font-medium text-gray-500">
              Questão {index + 1} de {questions.length}
            </span>
          </div>

          <h1 className="text-xl font-semibold text-gray-900 mb-8 leading-relaxed">
            {q.text}
          </h1>

          <div className="space-y-3">
            {q.options.map((opt: string, i: number) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all group flex items-center"
              >
                <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-black group-hover:text-white flex items-center justify-center mr-4 text-sm font-bold transition-colors">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-gray-700 font-medium">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}