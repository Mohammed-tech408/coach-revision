import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

export type AiProvider = "google" | "anthropic";

export function getAiProvider(): AiProvider | null {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()) {
    return "google";
  }
  if (process.env.ANTHROPIC_API_KEY?.trim()) {
    return "anthropic";
  }
  return null;
}

export function getProviderLabel(): string {
  const provider = getAiProvider();
  if (provider === "google") return "Google Gemini";
  if (provider === "anthropic") return "Anthropic Claude";
  return "Aucune";
}

export function getMissingKeyMessage(): string {
  return (
    "Aucune clé API IA trouvée. Ajoute GOOGLE_GENERATIVE_AI_API_KEY (gratuit) " +
    "ou ANTHROPIC_API_KEY dans .env.local, puis redémarre npm run dev."
  );
}

async function generateWithGoogle(
  systemPrompt: string,
  userContent: string,
): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  });

  const response = await ai.models.generateContent({
    model: process.env.GOOGLE_MODEL?.trim() || "gemini-2.0-flash",
    contents: userContent,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text ?? "";
}

async function generateWithAnthropic(
  systemPrompt: string,
  userContent: string,
  maxTokens: number,
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-haiku-latest",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

export async function generateAiText(
  systemPrompt: string,
  userContent: string,
  maxTokens: number,
): Promise<string> {
  const provider = getAiProvider();
  if (!provider) {
    throw new Error("MISSING_KEY");
  }

  if (provider === "google") {
    return generateWithGoogle(systemPrompt, userContent);
  }

  return generateWithAnthropic(systemPrompt, userContent, maxTokens);
}

export function formatAiError(error: unknown): string {
  if (error instanceof Error && error.message === "MISSING_KEY") {
    return getMissingKeyMessage();
  }

  if (error instanceof Anthropic.APIError) {
    if (error.status === 401) {
      return "Clé Anthropic invalide. Vérifie ANTHROPIC_API_KEY dans .env.local.";
    }
    if (error.status === 429) {
      return "Quota Anthropic dépassé. Essaie Google Gemini (gratuit) ou recharge ton compte.";
    }
    if (error.message.includes("credit balance")) {
      return "Crédits Anthropic épuisés. Ajoute GOOGLE_GENERATIVE_AI_API_KEY dans .env.local (gratuit sur Google AI Studio).";
    }
    return `Erreur Anthropic : ${error.message}`;
  }

  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("API key not valid") || message.includes("API_KEY_INVALID")) {
    return "Clé Google invalide. Copie-la telle quelle depuis aistudio.google.com/apikey (format AQ. ou AIzaSy...).";
  }

  if (message.includes("429") || message.includes("quota")) {
    return "Quota Google dépassé. Réessaie dans quelques minutes ou vérifie ton compte Google AI Studio.";
  }

  return "Erreur lors de l'appel à l'IA. Vérifie ta clé API et redémarre le serveur.";
}
