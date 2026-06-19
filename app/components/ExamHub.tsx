"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { ThemeToggle } from "../components/ThemeToggle";
import { diplomaConfig } from "../lib/exam-constants";

export function ExamHub() {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center app-page">
        <p className="text-[var(--muted)]">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="app-brand">
            Coach de Révision IA
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/revision" className="app-btn-ghost">
              Révision
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold">
          <span className="app-gradient-title">Espace Bac</span>
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Prépare le baccalauréat avec un coach adapté aux épreuves du lycée :
          français, philosophie, spécialités, langues et grand oral.
        </p>

        <div className="mt-10">
          <Link href="/examens/bac" className="app-exam-card app-exam-card-bac">
            <span className="text-4xl">{diplomaConfig.bac.emoji}</span>
            <h2 className="mt-4 text-2xl font-bold">{diplomaConfig.bac.title}</h2>
            <p className="mt-2 text-sm leading-7 opacity-90">
              {diplomaConfig.bac.description}
            </p>
            <p className="mt-4 text-sm font-semibold">
              Classe cible · {diplomaConfig.bac.targetClass}
            </p>
            <span className="app-btn-primary mt-6 inline-flex">
              Entrer dans l&apos;espace {diplomaConfig.bac.shortTitle}
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
