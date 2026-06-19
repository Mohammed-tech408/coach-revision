import Link from "next/link";
import { HomeHeader } from "../components/HomeHeader";

const features = [
  "Génération de fiches, quiz, flashcards et plans de révision",
  "Suivi de progression, badges, favoris et objectif du jour",
  "Espace Bac avec simulateur de notes et préparation au grand oral",
  "Profil élève avec classe, spécialité, statistiques et streak",
];

const stack = [
  "Next.js 16 avec App Router",
  "React 19 et TypeScript",
  "Tailwind CSS 4 pour l'interface",
  "API IA compatible Google Gemini, OpenAI et Anthropic",
  "Stockage local navigateur pour la démo de stage",
];

export default function AboutPage() {
  return (
    <div className="app-page">
      <HomeHeader />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="app-card p-6 sm:p-8">
          <span className="app-badge">Projet de stage</span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            <span className="app-gradient-title">À propos du projet</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Coach de Révision IA est une application web pensée pour aider un
            élève à organiser ses révisions, comprendre ses cours et préparer
            ses examens avec un assistant simple à utiliser.
          </p>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="app-card p-6">
            <h2 className="text-2xl font-bold">Objectif</h2>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              L&apos;objectif est de proposer un espace unique où l&apos;élève peut poser
              une question, créer une fiche, s&apos;entraîner avec un quiz et suivre
              sa progression sans se perdre dans plusieurs outils différents.
            </p>
          </section>

          <section className="app-card p-6">
            <h2 className="text-2xl font-bold">Fonctionnement</h2>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              L&apos;utilisateur choisit sa matière, son mode de révision et son
              thème. L&apos;application envoie ensuite la demande à l&apos;API IA, puis
              affiche une réponse adaptée à sa classe et à sa spécialité.
            </p>
          </section>
        </div>

        <section className="app-card mt-8 p-6">
          <h2 className="text-2xl font-bold">Fonctionnalités principales</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="app-card-soft p-4">
                <p className="font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="app-card mt-8 p-6">
          <h2 className="text-2xl font-bold">Technologies utilisées</h2>
          <ul className="mt-5 space-y-3 text-[var(--muted)]">
            {stack.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="font-bold text-[var(--primary-text)]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="app-card-highlight mt-8 p-6">
          <h2 className="text-2xl font-bold">Limites de la version actuelle</h2>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            Cette version est une démo de stage : les comptes et l&apos;historique
            sont sauvegardés dans le navigateur avec localStorage. Pour une
            vraie version production, il faudrait ajouter une base de données et
            une authentification sécurisée comme Supabase.
          </p>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/revision" className="app-btn-primary">
            Ouvrir le coach
          </Link>
          <Link href="/examens" className="app-btn-secondary">
            Voir les espaces examens
          </Link>
          <Link href="/" className="app-btn-ghost">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    </div>
  );
}
