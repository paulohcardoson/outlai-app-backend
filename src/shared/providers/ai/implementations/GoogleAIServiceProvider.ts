import { GoogleGenAI } from "@google/genai";
import { env } from "@src/shared/config/env";
import type { AIImageData, AIServiceProvider } from "../interface/AIServiceProvider";

export class GoogleAIServiceProvider implements AIServiceProvider {
  private apiKey;
  private ai;
  private defaultModel = "gemini-2.5-flash";

  constructor() {
    this.apiKey = env.GEMINI_API_KEY;
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async ask(prompt: string): Promise<string | undefined> {
    const response = await this.ai.models.generateContent({
      model: this.defaultModel,
      contents: prompt,
      config: {
        candidateCount: 1
      }
    });

    return response.text;
  }

  async askAboutImage(prompt: string, data: AIImageData): Promise<string | undefined> {
    const response = await this.ai.models.generateContent({
      model: this.defaultModel,
      contents: [
        {
          inlineData: data
        },
        {
          text: prompt
        }
      ],
      config: {
        candidateCount: 1
      }
    });

    return response.text;
  }
}
