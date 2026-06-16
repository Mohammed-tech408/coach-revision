"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { BadgesPanel } from "../components/BadgesPanel";
import { ExamRemindersPanel } from "../components/ExamRemindersPanel";
import { SubjectProgressPanel } from "../components/SubjectProgressPanel";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  type ConversationEntry,
  type ExamReminder,
  type GenerationMode,
  type QuizQuestion,
  classNeedsSpecialty,
  modeDescriptions,
  modeIcons,
  modeLabels,
  specialties,
  studentClasses,
  subjects,
  suggestionsBySubject,
  type StudentClass,
} from "../lib/constants";
import {
  buildShareText,
  copyShareText,
  downloadPdfFiche,
  downloadTextFile,
  shareContent,
} from "../lib/export-content";
import {
  clearHistory,
  loadHistory,
  loadMessageCount,
  saveHistory,
  saveMessageCount,
} from "../lib/storage";
import {
  computeBadges,
  computeSubjectProgress,
  daysUntilExam as getDaysUntilExam,
  loadFavorites,
  loadQuizHighScores,
  loadReminders,
  saveQuizHighScore,
  saveReminders,
  toggleFavorite,
} from "../lib/user-progress";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

const modes: GenerationMode[] = ["chat", "fiche", "quiz", "plan"];

export default function RevisionCoach() {
  const router = useRouter();
  const { user, ready, logout, updateProfile } = useAuth();

  const [mode, setMode] = useState<GenerationMode>("chat");
  const [subject, setSubject] = useState<string>(subjects[0]);
  const [question, setQuestion] = useState("");
  const [examDate, setExamDate] = useState("");
  const [daysUntilExam, setDaysUntilExam] = useState(7);
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [answer, setAnswer] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ConversationEntry[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [aiStatus, setAiStatus] = useState("Vérification...");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [reminders, setReminders] = useState<ExamReminder[]>([]);
  const [quizHighScores, setQuizHighScores] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    setHistory(loadHistory(user.id));
    setMessageCount(loadMessageCount(user.id));
    setFavoriteIds(loadFavorites(user.id));
    setReminders(loadReminders(user.id));
    setQuizHighScores(loadQuizHighScores(user.id));
  }, [user]);

  useEffect(() => {
    fetch("/api/revision")
      .then((response) => response.json())
      .then((data) => {
        setAiStatus(
          data.connected ? `IA : ${data.label}` : "IA : non configurée",
        );
      })
      .catch(() => setAiStatus("IA : hors ligne"));
  }, []);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center app-page">
        <p className="text-[var(--muted)]">Chargement...</p>
      </div>
    );
  }

  const suggestions = suggestionsBySubject[subject] ?? [];
  const subjectProgress = computeSubjectProgress(history);
  const badges = computeBadges(history, messageCount, quizHighScores);
  const favoriteEntries = history.filter((entry) =>
    favoriteIds.includes(entry.id),
  );

  function getSharePayload() {
    return buildShareText({
      subject,
      question: question.trim(),
      answer,
      mode,
    });
  }

  async function handleShareAnswer() {
    if (!answer) return;
    const text = getSharePayload();
    const title = `Fiche ${subject} - Coach de Révision IA`;
    const didShare = await shareContent(title, text);
    if (didShare) {
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
      return;
    }
    const copiedText = await copyShareText(text);
    if (copiedText) {
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } else {
      setError("Impossible de partager le contenu.");
    }
  }

  function handleDownloadText() {
    if (!answer) return;
    const text = getSharePayload();
    const safeName = question
      .slice(0, 30)
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    downloadTextFile(`${mode}-${subject}-${safeName || "revision"}.txt`, text);
  }

  function handleDownloadPdf() {
    if (!answer || !user) return;
    downloadPdfFiche({
      subject,
      question: question.trim(),
      answer,
      studentName: user.name,
    });
  }

  function handleToggleFavorite(entryId: string) {
    if (!user) return;
    setFavoriteIds(toggleFavorite(user.id, entryId));
  }

  function handleAddReminder(data: Omit<ExamReminder, "id" | "createdAt">) {
    if (!user) return;
    const next: ExamReminder[] = [
      {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
      ...reminders,
    ];
    setReminders(next);
    saveReminders(user.id, next);
  }

  function handleRemoveReminder(id: string) {
    if (!user) return;
    const next = reminders.filter((item) => item.id !== id);
    setReminders(next);
    saveReminders(user.id, next);
  }

  function handlePreparePlan(reminder: ExamReminder) {
    const days = getDaysUntilExam(reminder.examDate);

    setMode("plan");
    setSubject(reminder.subject);
    setQuestion(reminder.title);
    setExamDate(reminder.examDate);
    setDaysUntilExam(days !== null && days > 0 ? days : 1);
    setAnswer("");
    setQuiz([]);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleQuizCorrection() {
    setQuizSubmitted(true);
    if (!user || quiz.length === 0) return;

    if (quizScore / quiz.length >= 0.7) {
      const next = quizHighScores + 1;
      setQuizHighScores(next);
      saveQuizHighScore(user.id, next);
    }
  }

  function saveConversation(entry: ConversationEntry) {
    if (!user) return;

    const updatedHistory = [entry, ...history].slice(0, 50);
    const updatedCount = messageCount + 1;
    setHistory(updatedHistory);
    setMessageCount(updatedCount);
    saveHistory(user.id, updatedHistory);
    saveMessageCount(user.id, updatedCount);
  }

  function handleClearHistory() {
    if (!user) return;
    if (!window.confirm("Effacer tout l'historique sauvegardé ?")) return;
    clearHistory(user.id);
    setHistory([]);
  }

  async function copyAnswer() {
    if (!answer) return;
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Impossible de copier le texte.");
    }
  }

  function useSuggestion(text: string) {
    setQuestion(text);
    setError("");
  }

  async function generateContent() {
    if (!user) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setQuiz([]);
    setQuizAnswers([]);
    setQuizSubmitted(false);

    try {
      const response = await fetch("/api/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          subject,
          question: question.trim(),
          studentClass: user.studentClass,
          specialty: user.specialty,
          examDate,
          daysUntilExam,
          hoursPerDay,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      setAnswer(data.answer);

      if (mode === "quiz" && data.quiz?.questions) {
        const questions = data.quiz.questions as QuizQuestion[];
        setQuiz(questions);
        setQuizAnswers(Array(questions.length).fill(-1));
      }

      saveConversation({
        id: crypto.randomUUID(),
        userId: user.id,
        mode,
        subject,
        question: question.trim(),
        answer: data.answer,
        createdAt: new Date().toISOString(),
      });

      window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Impossible de contacter le coach. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generateContent();
  }

  const quizScore =
    quiz.length > 0
      ? quiz.reduce(
          (score, item, index) =>
            score + (quizAnswers[index] === item.correctIndex ? 1 : 0),
          0,
        )
      : 0;

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="app-logo">CR</div>
            <div>
              <p className="app-brand">Coach de Révision IA</p>
              <p className="app-subtitle">
                Bonjour {user.name} · {user.studentClass}
                {user.specialty ? ` · ${user.specialty}` : ""}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="app-badge">
              {messageCount} message{messageCount > 1 ? "s" : ""}
            </span>
            <span className="app-badge">{aiStatus}</span>
            <ThemeToggle />
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
            <a href="/" className="app-btn-ghost">
              Accueil
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold">
          <span className="app-gradient-title">Ton espace de révision</span>
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Coach, fiches, quiz et plan personnalisé — tout est sauvegardé sur ton
          compte.
        </p>

        <div className="app-stats mt-8">
          <div className="app-stat">
            <p className="app-stat-label">Messages envoyés</p>
            <p className="app-stat-value">{messageCount}</p>
          </div>
          <div className="app-stat">
            <p className="app-stat-label">Sessions sauvegardées</p>
            <p className="app-stat-value">{history.length}</p>
          </div>
          <div className="app-stat">
            <p className="app-stat-label">Mode actif</p>
            <p className="app-stat-value text-lg">{modeIcons[mode]} {modeLabels[mode]}</p>
          </div>
        </div>

        <div className="app-card mt-6 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="studentClass" className="app-label">
                Ta classe
              </label>
              <select
                id="studentClass"
                value={user.studentClass}
                onChange={(event) => {
                  const nextClass = event.target.value as StudentClass;
                  const message = updateProfile(nextClass, user.specialty);
                  if (message) setError(message);
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

            {classNeedsSpecialty(user.studentClass) && (
              <div>
                <label htmlFor="specialty" className="app-label">
                  Ta spécialité
                </label>
                <select
                  id="specialty"
                  value={user.specialty}
                  onChange={(event) => {
                    const message = updateProfile(
                      user.studentClass,
                      event.target.value,
                    );
                    if (message) setError(message);
                  }}
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
          <p className="mt-2 text-xs text-[var(--muted)]">
            Le coach adapte ses réponses à ton niveau et à ta spécialité.
          </p>
        </div>

        <ExamRemindersPanel
          reminders={reminders}
          onAdd={handleAddReminder}
          onRemove={handleRemoveReminder}
          onPreparePlan={handlePreparePlan}
        />

        <SubjectProgressPanel progress={subjectProgress} />

        <BadgesPanel badges={badges} />

        <div className="mt-8">
          <p className="app-label">Choisis un outil</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {modes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setAnswer("");
                  setQuiz([]);
                  setError("");
                }}
                className={mode === item ? "app-tab app-tab-active" : "app-tab"}
              >
                {modeIcons[item]} {modeLabels[item]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {modeDescriptions[mode]}
          </p>
        </div>

        {error && <div className="app-error mt-6">{error}</div>}

        <div className="app-workspace mt-8">
          <div className="app-panel">
            <h2 className="app-panel-title">Créer une session</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="subject" className="app-label">
              Matière
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="app-input"
            >
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {mode === "chat" && (
            <div>
              <p className="app-label">Suggestions de questions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => useSuggestion(suggestion)}
                    className="app-chip text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="question" className="app-label">
              {mode === "plan"
                ? "Chapitre à réviser"
                : mode === "quiz"
                  ? "Thème du quiz"
                  : mode === "fiche"
                    ? "Thème de la fiche"
                    : "Ta question"}
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              required
              placeholder="Exemple : Les fonctions affines"
              className="app-input"
            />
          </div>

          {mode === "plan" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="examDate" className="app-label">
                  Date du contrôle
                </label>
                <input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(event) => setExamDate(event.target.value)}
                  className="app-input"
                />
              </div>
              <div>
                <label htmlFor="days" className="app-label">
                  Jours disponibles
                </label>
                <input
                  id="days"
                  type="number"
                  min={1}
                  max={30}
                  value={daysUntilExam}
                  onChange={(event) =>
                    setDaysUntilExam(Number(event.target.value))
                  }
                  className="app-input"
                />
              </div>
              <div>
                <label htmlFor="hours" className="app-label">
                  Heures / jour
                </label>
                <input
                  id="hours"
                  type="number"
                  min={1}
                  max={8}
                  value={hoursPerDay}
                  onChange={(event) =>
                    setHoursPerDay(Number(event.target.value))
                  }
                  className="app-input"
                />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="app-btn-primary w-full sm:w-auto">
            {loading
              ? "Génération en cours..."
              : mode === "chat"
                ? "Demander au coach"
                : mode === "fiche"
                  ? "Générer la fiche"
                  : mode === "quiz"
                    ? "Générer le quiz"
                    : "Générer le plan"}
          </button>
            </form>
          </div>

          <div className="app-panel" ref={resultsRef}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="app-panel-title">Résultat</h2>
              {answer && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyAnswer}
                    className="app-btn-ghost !py-1.5 !px-3 text-xs"
                  >
                    {copied ? "Copié !" : "Copier"}
                  </button>
                  <button
                    type="button"
                    onClick={handleShareAnswer}
                    className="app-btn-ghost !py-1.5 !px-3 text-xs"
                  >
                    {shared ? "Partagé !" : "Partager"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadText}
                    className="app-btn-ghost !py-1.5 !px-3 text-xs"
                  >
                    Export .txt
                  </button>
                  {mode === "fiche" && (
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="app-btn-primary !py-1.5 !px-3 text-xs"
                    >
                      PDF
                    </button>
                  )}
                </div>
              )}
            </div>

            {loading && (
              <div className="app-empty mt-6">
                <div className="app-spinner" aria-hidden="true" />
                <p className="mt-4 font-medium">Le coach prépare ta réponse...</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Cela peut prendre quelques secondes.
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="app-empty mt-6">
                <p className="text-3xl">⚠️</p>
                <p className="mt-4 font-medium">Une erreur est survenue</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Vérifie le message d&apos;erreur au-dessus du formulaire.
                </p>
              </div>
            )}

            {!loading && !error && !answer && quiz.length === 0 && (
              <div className="app-empty mt-6">
                <p className="text-3xl">{modeIcons[mode]}</p>
                <p className="mt-4 font-medium">Aucun résultat pour l&apos;instant</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Remplis le formulaire à gauche puis lance la génération.
                </p>
              </div>
            )}

            {!loading && answer && (
              <div className="app-answer mt-6">
                <p className="app-answer-title">{modeLabels[mode]}</p>
                <div className="app-answer-body">{answer}</div>
              </div>
            )}

            {!loading && quiz.length > 0 && (
              <div className="mt-6 space-y-4">
                {quiz.map((item, index) => (
                  <article key={index} className="app-card p-5">
                    <p className="font-semibold">
                      {index + 1}. {item.question}
                    </p>
                    <div className="mt-3 space-y-2">
                      {item.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="app-card-soft flex cursor-pointer items-center gap-2 px-3 py-2"
                        >
                          <input
                            type="radio"
                            name={`quiz-${index}`}
                            checked={quizAnswers[index] === optionIndex}
                            onChange={() => {
                              const next = [...quizAnswers];
                              next[index] = optionIndex;
                              setQuizAnswers(next);
                            }}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    {quizSubmitted && (
                      <p
                        className={`mt-3 text-sm ${
                          quizAnswers[index] === item.correctIndex
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {quizAnswers[index] === item.correctIndex
                          ? "Bonne réponse !"
                          : "Mauvaise réponse."}{" "}
                        {item.explanation}
                      </p>
                    )}
                  </article>
                ))}
                <button
                  type="button"
                  onClick={handleQuizCorrection}
                  className="app-btn-primary"
                >
                  Corriger le quiz ({quizScore}/{quiz.length} si corrigé)
                </button>
              </div>
            )}
          </div>
        </div>

        {favoriteEntries.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">Favoris</h2>
            <div className="mt-4 space-y-4">
              {favoriteEntries.map((entry) => (
                <article key={entry.id} className="app-card p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="app-badge">{entry.subject}</span>
                    <span className="app-badge">{modeLabels[entry.mode]}</span>
                    <span>{formatDate(entry.createdAt)}</span>
                  </div>
                  <p className="mt-3 font-semibold">{entry.question}</p>
                  <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm text-[var(--muted)]">
                    {entry.answer}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMode(entry.mode);
                        setSubject(entry.subject);
                        setQuestion(entry.question);
                        setAnswer(entry.answer);
                        setError("");
                        window.setTimeout(() => {
                          resultsRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 100);
                      }}
                      className="cursor-pointer text-sm font-semibold text-[var(--primary-text)]"
                    >
                      Rouvrir
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(entry.id)}
                      className="cursor-pointer text-sm text-[var(--muted)] hover:text-red-500"
                    >
                      Retirer des favoris
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Historique sauvegardé</h2>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="cursor-pointer text-sm text-[var(--muted)] hover:text-red-600"
              >
                Effacer l&apos;historique
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="app-card mt-4 border-dashed p-6 text-center text-[var(--muted)]">
              Aucune conversation sauvegardée pour l&apos;instant.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {history.map((entry) => (
                <article key={entry.id} className="app-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      <span className="app-badge">{entry.subject}</span>
                      <span className="app-badge">{modeLabels[entry.mode]}</span>
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(entry.id)}
                      className="cursor-pointer text-lg leading-none"
                      aria-label={
                        favoriteIds.includes(entry.id)
                          ? "Retirer des favoris"
                          : "Ajouter aux favoris"
                      }
                    >
                      {favoriteIds.includes(entry.id) ? "★" : "☆"}
                    </button>
                  </div>
                  <p className="mt-3 font-semibold">{entry.question}</p>
                  <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm text-[var(--muted)]">
                    {entry.answer}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(entry.mode);
                      setSubject(entry.subject);
                      setQuestion(entry.question);
                      setAnswer(entry.answer);
                      setError("");
                      window.setTimeout(() => {
                        resultsRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 100);
                    }}
                    className="mt-4 cursor-pointer text-sm font-semibold text-[var(--primary-text)]"
                  >
                    Rouvrir
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
