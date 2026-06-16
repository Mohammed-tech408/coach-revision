import type { ConversationEntry } from "./constants";

const USERS_KEY = "coach-revision-users";
const SESSION_KEY = "coach-revision-session";

function historyKey(userId: string) {
  return `coach-revision-history-${userId}`;
}

function countKey(userId: string) {
  return `coach-revision-message-count-${userId}`;
}

export function loadHistory(userId: string): ConversationEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(historyKey(userId));
    if (!raw) return [];
    return JSON.parse(raw) as ConversationEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(userId: string, history: ConversationEntry[]) {
  localStorage.setItem(historyKey(userId), JSON.stringify(history.slice(0, 50)));
}

export function loadMessageCount(userId: string): number {
  if (typeof window === "undefined") return 0;

  const raw = localStorage.getItem(countKey(userId));
  const count = Number(raw);
  return Number.isFinite(count) ? count : 0;
}

export function saveMessageCount(userId: string, count: number) {
  localStorage.setItem(countKey(userId), String(count));
}

export function clearHistory(userId: string) {
  localStorage.removeItem(historyKey(userId));
}

export { SESSION_KEY, USERS_KEY };
