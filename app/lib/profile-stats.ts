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

function toDateKey(date: Date): string {
  return new Intl.DateTimeFormat("fr-CA").format(date);
}

function parseDateKey(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return toDateKey(date);
}

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

export function computeRevisionStreak(
  history: ConversationEntry[],
  includeToday: boolean,
): number {
  const activeDays = new Set<string>();

  for (const entry of history) {
    const dateKey = parseDateKey(entry.createdAt);
    if (dateKey) activeDays.add(dateKey);
  }

  if (includeToday) {
    activeDays.add(toDateKey(new Date()));
  }

  let current = new Date();
  let streak = 0;

  while (activeDays.has(toDateKey(current))) {
    streak += 1;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}
