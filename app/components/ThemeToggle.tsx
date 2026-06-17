"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "coach-revision-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = localStorage.getItem(THEME_KEY);
      const prefersDark =
        saved === "dark" ||
        (!saved &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    });
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="app-btn-ghost"
      aria-label="Changer le mode sombre"
    >
      {dark ? "☀️ Clair" : "🌙 Sombre"}
    </button>
  );
}
