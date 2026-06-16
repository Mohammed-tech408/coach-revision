import type { ConversationEntry } from "./constants";

export type ProfileStats = {
  messageCount: number;
  sessionCount: number;
  ficheCount: number;
  quizCount: number;
  planCount: number;
  flashcardCount: number;
  chatCount: number;
  favoriteCount: number;
  quizHighScores: number;
  subjectCount: number;
};

export function computeProfileStats(
  history: ConversationEntry[],
  messageCount: number,
  favoriteCount: number,
  quizHighScores: number,
): ProfileStats {
  return {
    messageCount,
    sessionCount: history.length,
    ficheCount: history.filter((entry) => entry.mode === "fiche").length,
    quizCount: history.filter((entry) => entry.mode === "quiz").length,
    planCount: history.filter((entry) => entry.mode === "plan").length,
    flashcardCount: history.filter((entry) => entry.mode === "flashcards").length,
    chatCount: history.filter((entry) => entry.mode === "chat").length,
    favoriteCount,
    quizHighScores,
    subjectCount: new Set(history.map((entry) => entry.subject)).size,
  };
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
