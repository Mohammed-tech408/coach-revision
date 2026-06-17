"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { ThemeToggle } from "../components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = login(email, password);
    if (message) {
      setError(message);
      return;
    }
    router.push("/revision");
  }

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="mx-auto flex max-w-md items-center justify-between px-6 py-4">
          <Link href="/" className="app-brand">
            Coach de Révision IA
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-12">
        <div className="app-card p-8">
          <h1 className="text-3xl font-bold">
            <span className="app-gradient-title">Connexion</span>
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Connecte-toi pour sauvegarder tes conversations.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="app-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="app-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="app-label">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="app-input"
              />
            </div>

            {error && <p className="app-error text-sm">{error}</p>}

            <button type="submit" className="app-btn-primary w-full">
              Se connecter
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-semibold text-[var(--primary-text)]"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
