import type { Badge } from "../lib/constants";

type Props = {
  badges: Badge[];
};

export function BadgesPanel({ badges }: Props) {
  const earnedCount = badges.filter((badge) => badge.earned).length;

  return (
    <section className="app-card mt-8 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Badges</h2>
        <span className="app-badge">
          {earnedCount}/{badges.length} débloqués
        </span>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Révise régulièrement pour débloquer de nouveaux badges.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {badges.map((badge) => (
          <article
            key={badge.id}
            className={`app-badge-card ${badge.earned ? "app-badge-earned" : "app-badge-locked"}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{badge.emoji}</span>
              <div>
                <p className="font-semibold">{badge.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {badge.description}
                </p>
                <p className="mt-2 text-xs font-semibold text-[var(--primary-text)]">
                  {badge.earned ? "Débloqué" : "À débloquer"}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
