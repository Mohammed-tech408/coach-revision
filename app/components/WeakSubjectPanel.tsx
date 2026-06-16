import type { SubjectProgress } from "../lib/constants";

type Props = {
  weakest: SubjectProgress;
  onRevise: (subject: string) => void;
};

export function WeakSubjectPanel({ weakest, onRevise }: Props) {
  return (
    <section className="app-card app-weak-subject mt-8 p-5">
      <h2 className="text-xl font-bold">Matière à renforcer</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Tu as le moins révisé{" "}
        <strong className="text-[var(--foreground)]">{weakest.subject}</strong>{" "}
        ({weakest.sessions} session{weakest.sessions > 1 ? "s" : ""} ·{" "}
        {weakest.percent}%).
      </p>
      <button
        type="button"
        onClick={() => onRevise(weakest.subject)}
        className="app-btn-primary mt-4"
      >
        Réviser {weakest.subject} maintenant
      </button>
    </section>
  );
}
