export type DailyGoal = {
  date: string;
  ficheDone: boolean;
  quizDone: boolean;
};

function dailyGoalKey(userId: string) {
  return `coach-revision-daily-goal-${userId}`;
}

function todayKey() {
  return new Intl.DateTimeFormat("fr-CA").format(new Date());
}

export function loadDailyGoal(userId: string): DailyGoal {
  const empty: DailyGoal = {
    date: todayKey(),
    ficheDone: false,
    quizDone: false,
  };

  if (typeof window === "undefined") return empty;

  try {
    const raw = localStorage.getItem(dailyGoalKey(userId));
    if (!raw) return empty;

    const saved = JSON.parse(raw) as DailyGoal;
    if (saved.date !== todayKey()) return empty;
    return saved;
  } catch {
    return empty;
  }
}

export function saveDailyGoal(userId: string, goal: DailyGoal) {
  localStorage.setItem(dailyGoalKey(userId), JSON.stringify(goal));
}

export function markDailyGoalDone(
  userId: string,
  type: "fiche" | "quiz",
): DailyGoal {
  const current = loadDailyGoal(userId);
  const next: DailyGoal = {
    date: todayKey(),
    ficheDone: type === "fiche" ? true : current.ficheDone,
    quizDone: type === "quiz" ? true : current.quizDone,
  };
  saveDailyGoal(userId, next);
  return next;
}

export function toggleDailyGoalItem(
  userId: string,
  type: "fiche" | "quiz",
): DailyGoal {
  const current = loadDailyGoal(userId);
  const next: DailyGoal = {
    date: todayKey(),
    ficheDone: type === "fiche" ? !current.ficheDone : current.ficheDone,
    quizDone: type === "quiz" ? !current.quizDone : current.quizDone,
  };
  saveDailyGoal(userId, next);
  return next;
}
