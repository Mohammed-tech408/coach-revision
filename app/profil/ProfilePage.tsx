"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { BadgesPanel } from "../components/BadgesPanel";
import { PwaInstallPrompt } from "../components/PwaInstallPrompt";
import { SubjectProgressPanel } from "../components/SubjectProgressPanel";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  classNeedsSpecialty,
  specialties,
  studentClasses,
  type StudentClass,
} from "../lib/constants";
import { loadDailyGoal } from "../lib/daily-goal";
import {
  computeProfileStats,
  computeRevisionStreak,
  getInitials,
} from "../lib/profile-stats";
import { loadHistory, loadMessageCount } from "../lib/storage";
import {
  computeBadges,
  computeSubjectProgress,
  loadFavorites,
  loadQuizHighScores,
} from "../lib/user-progress";

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready, logout, updateProfile, updateName } = useAuth();

  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState<StudentClass>("Seconde");
  const [specialty, setSpecialty] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setStudentClass(user.studentClass);
    setSpecialty(user.specialty);
  }, [user]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center app-page">
        <p className="text-[var(--muted)]">Chargement...</p>
      </div>
    );
  }

  const history = loadHistory(user.id);
  const messageCount = loadMessageCount(user.id);
  const favoriteIds = loadFavorites(user.id);
  const quizHighScores = loadQuizHighScores(user.id);
  const dailyGoal = loadDailyGoal(user.id);
  const stats = computeProfileStats(
    history,
    messageCount,
    favoriteIds.length,
    quizHighScores,
  );
  const subjectProgress = computeSubjectProgress(history);
  const badges = computeBadges(history, messageCount, quizHighScores);
  const earnedBadges = badges.filter((badge) => badge.earned).length;
  const dailyDone = Number(dailyGoal.ficheDone) + Number(dailyGoal.quizDone);
  const streak = computeRevisionStreak(history, dailyDone > 0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);

    const nameMessage = updateName(name);
    if (nameMessage) {
      setError(nameMessage);
      return;
    }

    const profileMessage = updateProfile(studentClass, specialty);
    if (profileMessage) {
      setError(profileMessage);
      return;
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="app-logo">CR</div>
            <div>
              <p className="app-brand">Coach de Révision IA</p>
              <p className="app-subtitle">Mon profil</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <a href="/revision" className="app-btn-ghost">
              Réviser
            </a>
            <a href="/examens" className="app-btn-ghost">
              Examens
            </a>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="app-btn-ghost hover:!text-red-400"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <section className="app-card p-6">
          <div className="app-profile-header">
            <div className="app-avatar" aria-hidden="true">
              {getInitials(user.name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="app-gradient-title">{user.name}</span>
              </h1>
              <p className="mt-1 text-[var(--muted)]">{user.email}</p>
              <p className="mt-2 text-sm font-medium">
                {user.studentClass}
                {user.specialty ? ` · ${user.specialty}` : ""}
              </p>
            </div>
          </div>
        </section>

        <div className="app-stats mt-8">
          <div className="app-stat">
            <p className="app-stat-label">Messages</p>
            <p className="app-stat-value">{stats.messageCount}</p>
          </div>
          <div className="app-stat">
            <p className="app-stat-label">Sessions</p>
            <p className="app-stat-value">{stats.sessionCount}</p>
          </div>
          <div className="app-stat">
            <p className="app-stat-label">Matières</p>
            <p className="app-stat-value">{stats.subjectCount}</p>
          </div>
          <div className="app-stat">
            <p className="app-stat-label">Badges</p>
            <p className="app-stat-value">
              {earnedBadges}/{badges.length}
            </p>
          </div>
          <div className="app-stat">
            <p className="app-stat-label">Streak</p>
            <p className="app-stat-value">
              {streak} jour{streak > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <section className="app-card mt-8 p-5">
          <div className="app-streak-card">
            <div className="app-streak-icon" aria-hidden="true">
              🔥
            </div>
            <div>
              <h2 className="text-xl font-bold">Streak de révision</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Tu as révisé {streak} jour{streak > 1 ? "s" : ""} de suite.
              </p>
              <p className="mt-3 text-sm font-medium text-[var(--primary-text)]">
                {streak === 0
                  ? "Lance une fiche ou un quiz aujourd'hui pour commencer ta série."
                  : "Continue demain pour garder ta série active."}
              </p>
            </div>
          </div>
        </section>

        <PwaInstallPrompt />

        <section className="app-card mt-8 p-5">
          <h2 className="text-xl font-bold">Activité</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Résumé de tout ce que tu as fait avec le coach.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <article className="app-profile-stat-card">
              <p className="app-profile-stat-label">Fiches</p>
              <p className="app-profile-stat-value">{stats.ficheCount}</p>
            </article>
            <article className="app-profile-stat-card">
              <p className="app-profile-stat-label">Quiz</p>
              <p className="app-profile-stat-value">{stats.quizCount}</p>
            </article>
            <article className="app-profile-stat-card">
              <p className="app-profile-stat-label">Quiz réussis</p>
              <p className="app-profile-stat-value">{stats.quizHighScores}</p>
            </article>
            <article className="app-profile-stat-card">
              <p className="app-profile-stat-label">Plans</p>
              <p className="app-profile-stat-value">{stats.planCount}</p>
            </article>
            <article className="app-profile-stat-card">
              <p className="app-profile-stat-label">Flashcards</p>
              <p className="app-profile-stat-value">{stats.flashcardCount}</p>
            </article>
            <article className="app-profile-stat-card">
              <p className="app-profile-stat-label">Favoris</p>
              <p className="app-profile-stat-value">{stats.favoriteCount}</p>
            </article>
          </div>

          <p className="mt-4 text-sm text-[var(--muted)]">
            Objectif du jour : {dailyDone}/2 complété
            {dailyGoal.ficheDone ? " · fiche ✓" : ""}
            {dailyGoal.quizDone ? " · quiz ✓" : ""}
          </p>
        </section>

        <section className="app-card mt-8 p-5">
          <h2 className="text-xl font-bold">Modifier mon profil</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Mets à jour tes infos — le coach adapte ses réponses à ton niveau.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="profile-name" className="app-label">
                Prénom
              </label>
              <input
                id="profile-name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="app-input"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-class" className="app-label">
                  Ta classe
                </label>
                <select
                  id="profile-class"
                  required
                  value={studentClass}
                  onChange={(event) => {
                    const nextClass = event.target.value as StudentClass;
                    setStudentClass(nextClass);
                    if (!classNeedsSpecialty(nextClass)) {
                      setSpecialty("");
                    }
                  }}
                  className="app-input"
                >
                  {studentClasses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {classNeedsSpecialty(studentClass) && (
                <div>
                  <label htmlFor="profile-specialty" className="app-label">
                    Ta spécialité
                  </label>
                  <select
                    id="profile-specialty"
                    required
                    value={specialty}
                    onChange={(event) => setSpecialty(event.target.value)}
                    className="app-input"
                  >
                    <option value="">Choisir une spécialité</option>
                    {specialties.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {error && <p className="app-error text-sm">{error}</p>}
            {saved && (
              <p className="text-sm font-semibold text-[var(--success)]">
                Profil mis à jour.
              </p>
            )}

            <button type="submit" className="app-btn-primary">
              Enregistrer
            </button>
          </form>
        </section>

        <SubjectProgressPanel progress={subjectProgress} />
        <BadgesPanel badges={badges} />
      </main>
    </div>
  );
}
