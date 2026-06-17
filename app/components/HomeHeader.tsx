"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { ThemeToggle } from "./ThemeToggle";

export function HomeHeader() {
  const { user, ready } = useAuth();

  return (
    <header className="app-header sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="app-logo">CR</div>
          <div>
            <p className="app-brand">Coach de Révision IA</p>
            <p className="app-subtitle">Ton assistant de révision</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {ready && user ? (
            <>
              <Link href="/examens" className="app-btn-ghost">
                Examens
              </Link>
              <Link
                href="/revision"
                className="app-btn-primary !py-2 !px-4 text-sm"
              >
                Mon espace
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="app-btn-ghost">
                Se connecter
              </Link>
              <Link
                href="/register"
                className="app-btn-primary !py-2 !px-4 text-sm"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
