// lib/mockData.ts

export interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number;
  materia: string;
  tema: string;
}

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Se um portal C-137 consome 40% de carga por salto, quantos saltos posso dar com 180% de carga?",
    options: ["2 saltos", "4 saltos", "4.5 saltos", "5 saltos"],
    answer: 1,
    materia: "Matemática",
    tema: "Proporção"
  },
  {
    id: "q2",
    text: "A Revolução Industrial mudou o modo de produção. Qual seria o impacto de uma impressora 3D de matéria escura?",
    options: ["Fim da escassez", "Colapso gravitacional", "Aumento do PIB galáctico", "Todas as anteriores"],
    answer: 3,
    materia: "História",
    tema: "Revoluções"
  },
  {
    id: "q3",
    text: "Em uma oração 'Rick é um gênio', qual o núcleo do predicado?",
    options: ["Rick", "é", "um", "gênio"],
    answer: 3,
    materia: "Português",
    tema: "Sintaxe"
  }
];

export const saveLocalProgress = (data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("studyflow_demo_data", JSON.stringify(data));
  }
};

export const getLocalProgress = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("studyflow_demo_data");
    return data ? JSON.parse(data) : null;
  }
  return null;
};