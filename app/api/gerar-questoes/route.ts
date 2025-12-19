import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { tema, quantidade } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) return NextResponse.json({ error: "Chave não configurada" }, { status: 500 });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um professor tutor. Responda APENAS com um array JSON puro. Não use markdown."
          },
          {
            role: "user",
            content: `Gere um array JSON com ${quantidade} questões sobre "${tema}". 
            Cada objeto deve ter exatamente este formato: 
            {"pergunta": "...", "opcoes": ["A", "B", "C", "D"], "correta": 0, "explicacao": "..."}`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.error?.message }, { status: response.status });

    let content = data.choices[0].message.content;
    content = content.replace(/```json|```/g, "").trim();

    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}