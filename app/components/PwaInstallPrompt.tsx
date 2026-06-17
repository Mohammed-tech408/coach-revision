"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // The app still works without offline support.
      });
    }

    const media = window.matchMedia("(display-mode: standalone)");
    setInstalled(media.matches);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstalled(true);
    }
    setInstallPrompt(null);
  }

  return (
    <section className="app-card mt-8 p-5">
      <div className="app-pwa-card">
        <div>
          <h2 className="text-xl font-bold">Installer l'application</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Ajoute Coach de Révision IA à ton ordinateur ou ton téléphone pour
            l'ouvrir comme une vraie application.
          </p>
          {installed && (
            <p className="mt-3 text-sm font-semibold text-[var(--success)]">
              Application déjà installée.
            </p>
          )}
          {!installed && !installPrompt && (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Si le bouton n'apparaît pas, utilise le menu du navigateur puis
              "Installer l'application".
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleInstall}
          disabled={!installPrompt || installed}
          className="app-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          Installer
        </button>
      </div>
    </section>
  );
}
