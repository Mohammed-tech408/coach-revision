import { NextResponse } from "next/server";
import type { GenerationMode } from "@/app/lib/constants";
import type { ExamDiploma } from "@/app/lib/exam-constants";
import { buildUserContent, getSystemPrompt } from "@/app/lib/ai-prompts";
import {
  formatAiError,
  generateAiText,
  getAiProvider,
  getMissingKeyMessage,
  getProviderLabel,
} from "@/app/lib/ai";

export async function GET() {
  const provider = getAiProvider();
  return NextResponse.json({
    connected: Boolean(provider),
    provider,
    label: getProviderLabel(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mode = (body.mode || "chat") as GenerationMode;
    const subject = body.subject as string;
    const question = body.question as string;
    const examDate = body.examDate as string | undefined;
    const daysUntilExam = Number(body.daysUntilExam);
    const hoursPerDay = Number(body.hoursPerDay);
    const studentClass = (body.studentClass as string) || "Seconde";
    const specialty = (body.specialty as string) || "";
    const examType =
      body.examType === "bac" ? (body.examType as ExamDiploma) : undefined;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Indique un thème ou une question." },
        { status: 400 },
      );
    }

    if (!getAiProvider()) {
      return NextResponse.json(
        { error: getMissingKeyMessage() },
        { status: 500 },
      );
    }

    const systemPrompt = getSystemPrompt(
      mode,
      studentClass,
      specialty || undefined,
      examType,
    );
    const userContent = buildUserContent(
      mode,
      subject,
      question,
      studentClass,
      specialty || undefined,
      examDate,
      daysUntilExam,
      hoursPerDay,
      examType,
    );

    const answer = await generateAiText(
      systemPrompt,
      userContent,
      mode === "quiz" || mode === "flashcards" ? 2048 : 1500,
    );

    if (!answer.trim()) {
      return NextResponse.json(
        { error: "Le coach n'a pas pu répondre." },
        { status: 500 },
      );
    }

    if (mode === "quiz") {
      try {
        const cleaned = answer.replace(/```json|```/g, "").trim();
        const quiz = JSON.parse(cleaned);
        return NextResponse.json({ answer, quiz });
      } catch {
        return NextResponse.json({ answer });
      }
    }

    if (mode === "flashcards") {
      try {
        const cleaned = answer.replace(/```json|```/g, "").trim();
        const flashcards = JSON.parse(cleaned);
        return NextResponse.json({ answer, flashcards });
      } catch {
        return NextResponse.json({ answer });
      }
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Erreur API IA:", error);
    return NextResponse.json(
      { error: formatAiError(error) },
      { status: 500 },
    );
  }
}
