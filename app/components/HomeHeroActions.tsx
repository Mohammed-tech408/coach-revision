"use client";

import { useAuth } from "./AuthProvider";

export function HomeHeroActions() {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <span className="app-btn-primary opacity-60">Chargement...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a href="/revision" className="app-btn-primary">
          Continuer mes révisions
        </a>
        <a href="#comment-ca-marche" className="app-btn-secondary">
          Voir comment ça marche
        </a>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <a href="/register" className="app-btn-primary">
        Commencer gratuitement
      </a>
      <a href="/login" className="app-btn-secondary">
        Se connecter
      </a>
    </div>
  );
}

export function HomeCtaActions() {
  const { user, ready } = useAuth();

  if (!ready) return null;

  return (
    <a
      href={user ? "/revision" : "/register"}
      className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
    >
      {user ? "Ouvrir mon espace de révision" : "Lancer mon premier coaching"}
    </a>
  );
}
