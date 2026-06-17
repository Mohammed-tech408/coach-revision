import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export type AiProvider = "google" | "anthropic" | "openai";

function getOpenAiApiKey(): string | undefined {
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  if (openAiKey) return openAiKey;

  const anthropicSlot = process.env.ANTHROPIC_API_KEY?.trim();
  if (anthropicSlot?.startsWith("sk-")) {
    return anthropicSlot;
  }

  return undefined;
}

function getAnthropicApiKey(): string | undefined {
  const gatewayKey = process.env.AI_GATEWAY_API_KEY?.trim();
  if (gatewayKey) return gatewayKey;

  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (anthropicKey && !anthropicKey.startsWith("sk-")) {
    return anthropicKey;
  }

  return undefined;
}

function usesVercelGateway(apiKey: string): boolean {
  return apiKey.startsWith("vck_") || Boolean(process.env.AI_GATEWAY_API_KEY?.trim());
}

export function getAiProvider(): AiProvider | null {
  if (getOpenAiApiKey()) {
    return "openai";
  }
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()) {
    return "google";
  }
  if (getAnthropicApiKey()) {
    return "anthropic";
  }
  return null;
}

export function getProviderLabel(): string {
  const apiKey = getAnthropicApiKey();
  if (apiKey && usesVercelGateway(apiKey)) {
    return "Vercel AI Gateway (Claude)";
  }
  const provider = getAiProvider();
  if (provider === "openai") return "OpenAI";
  if (provider === "google") return "Google Gemini";
  if (provider === "anthropic") return "Anthropic Claude";
  return "Aucune";
}

export function getMissingKeyMessage(): string {
  return (
    "Aucune clé API IA trouvée. Ajoute OPENAI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY " +
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

async function generateWithOpenAI(
  systemPrompt: string,
  userContent: string,
  maxTokens: number,
): Promise<string> {
  const openai = new OpenAI({
    apiKey: getOpenAiApiKey(),
  });

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
  });

  return completion.choices[0]?.message?.content ?? "";
}

async function generateWithAnthropic(
  systemPrompt: string,
  userContent: string,
  maxTokens: number,
): Promise<string> {
  const apiKey = getAnthropicApiKey()!;
  const anthropic = usesVercelGateway(apiKey)
    ? new Anthropic({
        apiKey,
        baseURL: "https://ai-gateway.vercel.sh",
      })
    : new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model:
      process.env.ANTHROPIC_MODEL?.trim() ||
      (usesVercelGateway(apiKey)
        ? "anthropic/claude-3-5-haiku-latest"
        : "claude-3-5-haiku-latest"),
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

  if (provider === "openai") {
    return generateWithOpenAI(systemPrompt, userContent, maxTokens);
  }

  return generateWithAnthropic(systemPrompt, userContent, maxTokens);
}

export function formatAiError(error: unknown): string {
  if (error instanceof Error && error.message === "MISSING_KEY") {
    return getMissingKeyMessage();
  }

  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return "Clé OpenAI invalide. Vérifie OPENAI_API_KEY dans .env.local.";
    }
    if (error.status === 429) {
      return "Quota OpenAI dépassé. Vérifie ta facturation sur platform.openai.com.";
    }
    return `Erreur OpenAI : ${error.message}`;
  }

  if (error instanceof Anthropic.APIError) {
    if (error.status === 401) {
      return "Clé API invalide. Vérifie ANTHROPIC_API_KEY ou AI_GATEWAY_API_KEY dans .env.local.";
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
