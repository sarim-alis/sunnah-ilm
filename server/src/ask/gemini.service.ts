import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Hadith } from '../hadith/entities/hadith.entity';

const SYSTEM_INSTRUCTION = `You explain retrieved Ahadees for Sunnah-Ilm in plain, simple English.
Rules:
- Use easy words. Write short sentences. Avoid complex or academic language.
- Quote only Arabic, English, and Urdu text from the provided narrations.
- When quoting a narration, use this exact layout with a blank line between each language:
  ARABIC
  [arabic text on the next line]

  ENGLISH
  [english text on the next line]

  URDU
  [urdu text on the next line]
- Write ARABIC, ENGLISH, and URDU in all capitals on their own line. Put the quote text on the line below each label.
- Always name the collection and Hadith number when citing a narration.
- Never present your words as part of the Hadith.
- Do not add a title, heading, or label — start directly with the answer.
- If none of the retrieved items answer the question, say so clearly in simple words.
- Never invent a chain, grade, wording, or source.
- Keep it brief: 2–4 short paragraphs with small sentences.`;

function stripExplanationLabel(text: string): string {
  return text
    .replace(
      /^(?:\*\*)?(?:explanation(?:\s+only)?|answer)(?:\*\*)?\s*:?\s*/i,
      '',
    )
    .trim();
}

function formatLanguageSpacing(text: string): string {
  return text
    .replace(/\s*(?:\*\*)?Arabic\s*:?\s*(?:\*\*)?\s*/gi, '\n\nARABIC\n')
    .replace(/\s*(?:\*\*)?English\s*:?\s*(?:\*\*)?\s*/gi, '\n\nENGLISH\n')
    .replace(/\s*(?:\*\*)?Urdu\s*:?\s*(?:\*\*)?\s*/gi, '\n\nURDU\n')
    .replace(/^\n+/, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

@Injectable()
export class GeminiService {
  constructor(private config: ConfigService) {}

  async explain(
    topic: string,
    question: string,
    hadiths: Hadith[],
  ): Promise<string> {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    const model =
      this.config.get<string>('GEMINI_MODEL') ?? 'gemini-2.0-flash';
    if (!apiKey) {
      throw new ServiceUnavailableException('Gemini is not configured');
    }

    const corpus = hadiths.map((item) => ({
      id: item.id,
      book: item.book,
      hadithNumber: item.hadithNumber,
      grade: item.grade,
      topic: item.topic,
      narrator: item.narrator,
      chapter: item.chapter,
      arabic: item.translation?.arabic || item.text,
      english: item.translation?.english || '',
      urdu: item.translation?.urdu || '',
      text: item.text,
    }));

    const userPrompt = `Topic: ${topic}
User question: ${question}

Retrieved Ahadees (use only these):
${JSON.stringify(corpus, null, 2)}

Explain what these narrations teach about the user's question. Use simple words and short sentences.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        }),
      },
    );

    const data = (await response.json()) as {
      error?: { message?: string };
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    if (!response.ok) {
      throw new ServiceUnavailableException(
        data.error?.message ?? 'Gemini request failed',
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      throw new ServiceUnavailableException('Empty response from Gemini');
    }

    return formatLanguageSpacing(stripExplanationLabel(text));
  }
}
