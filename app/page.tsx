export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* En-tête */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              CR
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                Coach de Révision IA
              </p>
              <p className="text-xs text-slate-500">Ton assistant de révision</p>
            </div>
          </div>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            Se connecter
          </button>
        </div>
      </header>

      <main>
        {/* Section principale (hero) */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700">
                Nouveau · Projet de stage
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Révise plus vite, retiens mieux, stresse moins.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Coach de Révision IA t&apos;aide à organiser tes révisions,
                créer des fiches, t&apos;entraîner avec des quiz et suivre ta
                progression avant un contrôle.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
                  Commencer gratuitement
                </button>
                <button className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  Voir comment ça marche
                </button>
              </div>
            </div>

            {/* Carte de démonstration */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-100">
              <p className="text-sm font-medium text-slate-500">
                Exemple de session
              </p>
              <h2 className="mt-2 text-2xl font-bold">Révision · Mathématiques</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Prochaine étape</p>
                  <p className="mt-1 font-semibold">Fonctions affines · 20 min</p>
                </div>
                <div className="rounded-2xl bg-indigo-50 p-4">
                  <p className="text-sm font-medium text-indigo-700">
                    Conseil du coach
                  </p>
                  <p className="mt-1 text-slate-700">
                    Commence par 5 exercices faciles pour te remettre en confiance.
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="text-sm text-slate-500">Progression</p>
                    <p className="font-semibold">68% du chapitre</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border-4 border-indigo-600 border-r-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fonctionnalités */}
        <section className="border-t border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-slate-900">
                Tout ce dont tu as besoin pour réviser
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Une application simple, pensée pour les élèves de seconde comme toi.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 p-6">
                <div className="text-2xl">📚</div>
                <h3 className="mt-4 text-xl font-semibold">Fiches intelligentes</h3>
                <p className="mt-2 text-slate-600">
                  Transforme tes cours en fiches claires, avec les points importants
                  à retenir.
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 p-6">
                <div className="text-2xl">🎯</div>
                <h3 className="mt-4 text-xl font-semibold">Quiz personnalisés</h3>
                <p className="mt-2 text-slate-600">
                  Entraîne-toi avec des questions adaptées à ton niveau et à tes
                  difficultés.
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 p-6">
                <div className="text-2xl">📅</div>
                <h3 className="mt-4 text-xl font-semibold">Planning de révision</h3>
                <p className="mt-2 text-slate-600">
                  Organise ton temps avant un contrôle avec un plan simple jour par
                  jour.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Appel à l'action */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl bg-indigo-600 px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-bold">
              Prêt à commencer ta première révision ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
              Crée ton compte, choisis une matière et laisse le coach t&apos;accompagner
              étape par étape.
            </p>
            <button className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50">
              Lancer mon premier coaching
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        Coach de Révision IA · Projet de stage découverte · 2026
      </footer>
    </div>
  );
}
