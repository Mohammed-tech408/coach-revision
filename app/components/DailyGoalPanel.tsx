"use client";

import type { DailyGoal } from "../lib/daily-goal";

type Props = {
  goal: DailyGoal;
  onToggle: (type: "fiche" | "quiz") => void;
};

export function DailyGoalPanel({ goal, onToggle }: Props) {
  const completed = Number(goal.ficheDone) + Number(goal.quizDone);
  const allDone = goal.ficheDone && goal.quizDone;

  return (
    <section className="app-card mt-8 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Objectif du jour</h2>
        <span className="app-badge">
          {completed}/2 complété{completed > 1 ? "s" : ""}
        </span>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Aujourd&apos;hui : 1 fiche + 1 question au coach pour progresser
        régulièrement.
      </p>

      <div className="mt-5 space-y-3">
        <label className="app-goal-item">
          <input
            type="checkbox"
            checked={goal.ficheDone}
            onChange={() => onToggle("fiche")}
          />
          <span>Générer ou réviser 1 fiche</span>
        </label>
        <label className="app-goal-item">
          <input
            type="checkbox"
            checked={goal.quizDone}
            onChange={() => onToggle("quiz")}
          />
          <span>Poser 1 question au coach</span>
        </label>
      </div>

      {allDone && (
        <p className="app-card-highlight mt-4 p-4 text-sm font-semibold text-[var(--primary-text)]">
          Bravo ! Objectif du jour atteint.
        </p>
      )}
    </section>
  );
}
