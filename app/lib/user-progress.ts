import type {
  ConversationEntry,
  ExamReminder,
  SubjectProgress,
  Badge,
} from "./constants";
import { PROGRESS_GOAL_PER_SUBJECT, subjects } from "./constants";

function favoritesKey(userId: string) {
  return `coach-revision-favorites-${userId}`;
}

function remindersKey(userId: string) {
  return `coach-revision-reminders-${userId}`;
}

function quizScoresKey(userId: string) {
  return `coach-revision-quiz-scores-${userId}`;
}

export function loadFavorites(userId: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(favoritesKey(userId));
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function saveFavorites(userId: string, favoriteIds: string[]) {
  localStorage.setItem(favoritesKey(userId), JSON.stringify(favoriteIds));
}

export function toggleFavorite(userId: string, entryId: string): string[] {
  const current = loadFavorites(userId);
  const next = current.includes(entryId)
    ? current.filter((id) => id !== entryId)
    : [...current, entryId];
  saveFavorites(userId, next);
  return next;
}

export function loadReminders(userId: string): ExamReminder[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(remindersKey(userId));
    if (!raw) return [];
    return JSON.parse(raw) as ExamReminder[];
  } catch {
    return [];
  }
}

export function saveReminders(userId: string, reminders: ExamReminder[]) {
  localStorage.setItem(remindersKey(userId), JSON.stringify(reminders));
}

export function loadQuizHighScores(userId: string): number {
  if (typeof window === "undefined") return 0;

  const raw = localStorage.getItem(quizScoresKey(userId));
  const count = Number(raw);
  return Number.isFinite(count) ? count : 0;
}

export function saveQuizHighScore(userId: string, count: number) {
  localStorage.setItem(quizScoresKey(userId), String(count));
}

export function computeSubjectProgress(
  history: ConversationEntry[],
): SubjectProgress[] {
  const counts = new Map<string, number>();

  for (const entry of history) {
    counts.set(entry.subject, (counts.get(entry.subject) ?? 0) + 1);
  }

  return subjects.map((subject) => {
    const sessions = counts.get(subject) ?? 0;
    const percent = Math.min(
      100,
      Math.round((sessions / PROGRESS_GOAL_PER_SUBJECT) * 100),
    );
    return { subject, sessions, percent };
  });
}

export function getWeakestSubject(
  progress: SubjectProgress[],
): SubjectProgress | null {
  if (progress.length === 0) return null;

  return progress.reduce((weakest, current) => {
    if (current.sessions < weakest.sessions) return current;
    if (current.sessions === weakest.sessions && current.percent < weakest.percent) {
      return current;
    }
    return weakest;
  });
}

export function daysUntilExam(examDate: string): number | null {
  if (!examDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${examDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;

  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function computeBadges(
  history: ConversationEntry[],
  messageCount: number,
  quizHighScores: number,
): Badge[] {
  const ficheCount = history.filter((e) => e.mode === "fiche").length;
  const quizCount = history.filter((e) => e.mode === "quiz").length;
  const planCount = history.filter((e) => e.mode === "plan").length;
  const subjectCount = new Set(history.map((e) => e.subject)).size;

  const defs: Omit<Badge, "earned">[] = [
    {
      id: "first",
      emoji: "🌟",
      title: "Première session",
      description: "Enregistre ta première révision",
    },
    {
      id: "messages10",
      emoji: "💬",
      title: "Curieux",
      description: "10 messages envoyés au coach",
    },
    {
      id: "fiches5",
      emoji: "📋",
      title: "Ficheur",
      description: "5 fiches de révision créées",
    },
    {
      id: "quiz5",
      emoji: "🎯",
      title: "Quiz addict",
      description: "5 quiz générés",
    },
    {
      id: "quiz-master",
      emoji: "🏆",
      title: "As du quiz",
      description: "5 quiz réussis à 70% ou plus",
    },
    {
      id: "planner",
      emoji: "📅",
      title: "Organisé",
      description: "3 plans de révision créés",
    },
    {
      id: "explorer",
      emoji: "🧭",
      title: "Explorateur",
      description: "Réviser 3 matières différentes",
    },
  ];

  const earnedMap: Record<string, boolean> = {
    first: history.length >= 1,
    messages10: messageCount >= 10,
    fiches5: ficheCount >= 5,
    quiz5: quizCount >= 5,
    "quiz-master": quizHighScores >= 5,
    planner: planCount >= 3,
    explorer: subjectCount >= 3,
  };

  return defs.map((badge) => ({
    ...badge,
    earned: earnedMap[badge.id] ?? false,
  }));
}
