"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { GrandOralPanel } from "./GrandOralPanel";
import { GradeSimulatorPanel } from "./GradeSimulatorPanel";
import { ThemeToggle } from "./ThemeToggle";
import type { ConversationEntry, GenerationMode, QuizQuestion } from "../lib/constants";
import {
  diplomaConfig,
  examModeDescriptions,
  examModeLabels,
  examSuggestions,
  type ExamDiploma,
  type ExamPrepMode,
} from "../lib/exam-constants";
import {
  buildShareText,
  copyShareText,
  downloadPdfFiche,
  shareContent,
} from "../lib/export-content";
import {
  loadHistory,
  loadMessageCount,
  saveHistory,
  saveMessageCount,
} from "../lib/storage";
import { daysUntilExam as getDaysUntilExam } from "../lib/user-progress";

const modes: ExamPrepMode[] = ["chat", "fiche", "quiz", "plan"];
const modeIcons: Record<ExamPrepMode, string> = {
  chat: "💬",
  fiche: "📋",
  quiz: "🎯",
  plan: "📅",
};

type Props = {
  diploma: ExamDiploma;
};

export function ExamCoach({ diploma }: Props) {
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const config = diplomaConfig[diploma];

  const [mode, setMode] = useState<ExamPrepMode>("chat");
  const [subject, setSubject] = useState(config.subjects[0]);
  const [question, setQuestion] = useState("");
  const [examDate, setExamDate] = useState(config.defaultExamDate);
  const [daysUntilExam, setDaysUntilExam] = useState(14);
  const [hoursPerDay, setHoursPerDay] = useState(2);
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
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      const allHistory = loadHistory(user.id);
      setHistory(allHistory.filter((entry) => entry.diploma === diploma));
      setMessageCount(loadMessageCount(user.id));
    });

    return () => {
      cancelled = true;
    };
  }, [user, diploma]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center app-page">
        <p className="text-[var(--muted)]">Chargement...</p>
      </div>
    );
  }

  const suggestions = examSuggestions[diploma][subject] ?? [];
  const daysLeft = getDaysUntilExam(examDate);

  function saveConversation(entry: ConversationEntry) {
    if (!user) return;
    const allHistory = loadHistory(user.id);
    const updatedHistory = [entry, ...allHistory].slice(0, 50);
    const updatedCount = messageCount + 1;
    setHistory(updatedHistory.filter((item) => item.diploma === diploma));
    setMessageCount(updatedCount);
    saveHistory(user.id, updatedHistory);
    saveMessageCount(user.id, updatedCount);
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
          examType: diploma,
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
        diploma,
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

  async function handleShareAnswer() {
    if (!answer) return;
    const text = buildShareText({
      subject,
      question: question.trim(),
      answer,
      mode: mode as GenerationMode,
    });
    const didShare = await shareContent(`${config.shortTitle} · ${subject}`, text);
    if (!didShare) {
      await copyShareText(text);
    }
    setShared(true);
    window.setTimeout(() => setShared(false), 2000);
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
            <div className="app-logo">{config.emoji}</div>
            <div>
              <p className="app-brand">Espace {config.shortTitle}</p>
              <p className="app-subtitle">
                {user.name} · {config.targetClass}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/examens" className="app-btn-ghost">
              Examens
            </Link>
            <Link href="/revision" className="app-btn-ghost">
              Révision
            </Link>
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
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className={`app-exam-hero app-exam-hero-${diploma}`}>
          <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
            Espace dédié
          </p>
          <h1 className="mt-2 text-3xl font-bold">{config.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 opacity-95">
            {config.description}
          </p>
          {daysLeft !== null && daysLeft >= 0 && (
            <p className="app-exam-countdown mt-4 inline-flex">
              {daysLeft === 0
                ? "Épreuve aujourd'hui — bon courage !"
                : daysLeft === 1
                  ? "Épreuve demain — dernière ligne droite"
                  : `Environ J-${daysLeft} avant les épreuves`}
            </p>
          )}
        </div>

        <div className="app-card mt-8 p-5">
          <h2 className="font-bold">Conseils pour le {config.shortTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {config.tips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-[var(--primary-text)]">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <GradeSimulatorPanel diploma={diploma} />

        {diploma === "bac" && (
          <GrandOralPanel
            studentClass={user.studentClass}
            specialty={user.specialty}
          />
        )}

        <div className="mt-8">
          <p className="app-label">Outils de préparation</p>
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
                {modeIcons[item]} {examModeLabels[item]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {examModeDescriptions[mode]}
          </p>
        </div>

        {error && <div className="app-error mt-6">{error}</div>}

        <div className="app-workspace mt-8">
          <div className="app-panel">
            <h2 className="app-panel-title">Préparer l&apos;épreuve</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label htmlFor="exam-subject" className="app-label">
                  Épreuve / matière
                </label>
                <select
                  id="exam-subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="app-input"
                >
                  {config.subjects.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="app-label">Suggestions</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setQuestion(suggestion);
                        setError("");
                      }}
                      className="app-chip text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="exam-question" className="app-label">
                  Ta question ou ton thème
                </label>
                <textarea
                  id="exam-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  rows={4}
                  required
                  placeholder={`Exemple : méthode pour l'épreuve de ${subject}`}
                  className="app-input"
                />
              </div>

              {mode === "plan" && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="exam-date" className="app-label">
                      Date de l&apos;épreuve
                    </label>
                    <input
                      id="exam-date"
                      type="date"
                      value={examDate}
                      onChange={(event) => setExamDate(event.target.value)}
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="exam-days" className="app-label">
                      Jours de révision
                    </label>
                    <input
                      id="exam-days"
                      type="number"
                      min={1}
                      max={60}
                      value={daysUntilExam}
                      onChange={(event) =>
                        setDaysUntilExam(Number(event.target.value))
                      }
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="exam-hours" className="app-label">
                      Heures / jour
                    </label>
                    <input
                      id="exam-hours"
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

              <button
                type="submit"
                disabled={loading}
                className="app-btn-primary w-full sm:w-auto"
              >
                {loading ? "Génération..." : `Lancer · ${examModeLabels[mode]}`}
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
                <p className="mt-4 font-medium">Préparation en cours...</p>
              </div>
            )}

            {!loading && !answer && quiz.length === 0 && (
              <div className="app-empty mt-6">
                <p className="text-3xl">{config.emoji}</p>
                <p className="mt-4 font-medium">Prêt pour le {config.shortTitle}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Choisis une matière et lance une session de préparation.
                </p>
              </div>
            )}

            {!loading && answer && (
              <div className="app-answer mt-6">
                <p className="app-answer-title">
                  {examModeLabels[mode]} · {subject}
                </p>
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
                            name={`exam-quiz-${index}`}
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
                  onClick={() => setQuizSubmitted(true)}
                  className="app-btn-primary"
                >
                  Corriger ({quizScore}/{quiz.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">
              Historique {config.shortTitle}
            </h2>
            <div className="mt-4 space-y-4">
              {history.slice(0, 5).map((entry) => (
                <article key={entry.id} className="app-card p-5">
                  <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                    <span className="app-badge">{entry.subject}</span>
                    <span className="app-badge">{examModeLabels[entry.mode as ExamPrepMode]}</span>
                  </div>
                  <p className="mt-3 font-semibold">{entry.question}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(entry.mode as ExamPrepMode);
                      setSubject(entry.subject);
                      setQuestion(entry.question);
                      setAnswer(entry.answer);
                    }}
                    className="mt-4 cursor-pointer text-sm font-semibold text-[var(--primary-text)]"
                  >
                    Rouvrir
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
