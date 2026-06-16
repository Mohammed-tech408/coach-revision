import { HomeHeader } from "./components/HomeHeader";
import { HomeCtaActions, HomeHeroActions } from "./components/HomeHeroActions";

export default function Home() {
  return (
    <div className="app-page">
      <HomeHeader />

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="app-badge">Nouveau · Projet de stage</span>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                <span className="app-gradient-title">
                  Révise plus vite, retiens mieux,
                </span>
                <br />
                stresse moins.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
                Coach de Révision IA t&apos;aide à organiser tes révisions,
                créer des fiches, t&apos;entraîner avec des quiz et suivre ta
                progression avant un contrôle.
              </p>
              <HomeHeroActions />
            </div>

            <div className="app-card p-6">
              <p className="text-sm font-medium text-[var(--muted)]">
                Exemple de session
              </p>
              <h2 className="mt-2 text-2xl font-bold">Révision · Mathématiques</h2>
              <div className="mt-6 space-y-4">
                <div className="app-card-soft p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Prochaine étape
                  </p>
                  <p className="mt-1 font-semibold">Fonctions affines · 20 min</p>
                </div>
                <div className="app-card-highlight p-4">
                  <p className="text-sm font-semibold text-[var(--primary-text)]">
                    Conseil du coach
                  </p>
                  <p className="mt-1">
                    Commence par 5 exercices faciles pour te remettre en confiance.
                  </p>
                </div>
                <div className="app-card-soft flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm text-[var(--muted)]">Progression</p>
                    <p className="font-semibold">68% du chapitre</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border-4 border-[var(--primary)] border-r-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="comment-ca-marche" className="app-section-alt scroll-mt-24 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-bold">Comment ça marche ?</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "Étape 1",
                  title: "Choisis ta matière",
                  text: "Maths, français, SVT… sélectionne ce que tu veux réviser.",
                },
                {
                  step: "Étape 2",
                  title: "Pose ta question",
                  text: "Demande une explication, une fiche ou un rappel de cours.",
                },
                {
                  step: "Étape 3",
                  title: "Révise avec le coach",
                  text: "Le coach te répond et te propose des questions pour t'entraîner.",
                },
              ].map((item) => (
                <article key={item.step} className="app-card p-6">
                  <p className="text-sm font-semibold text-[var(--primary-text)]">
                    {item.step}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[var(--muted)]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold">
                Tout ce dont tu as besoin pour réviser
              </h2>
              <p className="mt-4 text-lg text-[var(--muted)]">
                Une application simple, pensée pour les élèves de seconde comme toi.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  emoji: "📚",
                  title: "Fiches intelligentes",
                  text: "Transforme tes cours en fiches claires, avec les points importants à retenir.",
                },
                {
                  emoji: "🎯",
                  title: "Quiz personnalisés",
                  text: "Entraîne-toi avec des questions adaptées à ton niveau et à tes difficultés.",
                },
                {
                  emoji: "📅",
                  title: "Planning de révision",
                  text: "Organise ton temps avant un contrôle avec un plan simple jour par jour.",
                },
              ].map((item) => (
                <article key={item.title} className="app-card p-6">
                  <div className="text-2xl">{item.emoji}</div>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[var(--muted)]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="app-section-alt py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-bold">Espace Brevet & Bac</h2>
            <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
              Deux espaces dédiés pour préparer le DNB et le baccalauréat avec
              des conseils, fiches et quiz adaptés à chaque épreuve.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <a href="/examens/brevet" className="app-exam-card app-exam-card-brevet">
                <span className="text-4xl">🎓</span>
                <h3 className="mt-4 text-2xl font-bold">Brevet des collèges</h3>
                <p className="mt-2 text-sm leading-7 opacity-90">
                  Français, maths, histoire-géo, sciences et anglais — entraîne-toi
                  au format du DNB.
                </p>
              </a>
              <a href="/examens/bac" className="app-exam-card app-exam-card-bac">
                <span className="text-4xl">🏆</span>
                <h3 className="mt-4 text-2xl font-bold">Baccalauréat</h3>
                <p className="mt-2 text-sm leading-7 opacity-90">
                  Dissertation, philo, spécialités, grand oral — prépare chaque
                  épreuve du bac.
                </p>
              </a>
            </div>
            <a href="/examens" className="app-btn-secondary mt-8 inline-flex">
              Voir tous les espaces examens
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="app-cta">
            <h2 className="text-3xl font-bold">
              Prêt à commencer ta première révision ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-violet-100">
              Crée ton compte, choisis une matière et laisse le coach t&apos;accompagner
              étape par étape.
            </p>
            <HomeCtaActions />
          </div>
        </section>
      </main>

      <footer className="app-header py-8 text-center text-sm text-[var(--muted)]">
        Coach de Révision IA · Projet de stage découverte · 2026
      </footer>
    </div>
  );
}
