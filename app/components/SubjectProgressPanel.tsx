import type { SubjectProgress } from "../lib/constants";

type Props = {
  progress: SubjectProgress[];
};

export function SubjectProgressPanel({ progress }: Props) {
  const active = progress.filter((item) => item.sessions > 0);

  return (
    <section className="app-card mt-8 p-5">
      <h2 className="text-xl font-bold">Progression par matière</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Objectif : 10 sessions par matière pour atteindre 100%.
      </p>

      <div className="mt-5 space-y-4">
        {progress.map((item) => (
          <div key={item.subject}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{item.subject}</span>
              <span className="text-[var(--muted)]">
                {item.sessions}/10 · {item.percent}%
              </span>
            </div>
            <div className="app-progress mt-2">
              <div
                className="app-progress-bar"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {active.length === 0 && (
        <p className="mt-4 text-sm text-[var(--muted)]">
          Commence une session pour voir ta progression.
        </p>
      )}
    </section>
  );
}
