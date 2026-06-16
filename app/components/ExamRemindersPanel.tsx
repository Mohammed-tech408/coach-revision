"use client";

import { FormEvent, useState } from "react";
import type { ExamReminder } from "../lib/constants";
import { subjects } from "../lib/constants";
import { daysUntilExam } from "../lib/user-progress";

type Props = {
  reminders: ExamReminder[];
  onAdd: (reminder: Omit<ExamReminder, "id" | "createdAt">) => void;
  onRemove: (id: string) => void;
  onPreparePlan: (reminder: ExamReminder) => void;
};

function formatExamDate(examDate: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  }).format(new Date(`${examDate}T00:00:00`));
}

export function ExamRemindersPanel({
  reminders,
  onAdd,
  onRemove,
  onPreparePlan,
}: Props) {
  const [subject, setSubject] = useState<string>(subjects[0]);
  const [title, setTitle] = useState("");
  const [examDate, setExamDate] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !examDate) return;

    onAdd({ subject, title: title.trim(), examDate });
    setTitle("");
    setExamDate("");
  }

  const sorted = [...reminders].sort((a, b) =>
    a.examDate.localeCompare(b.examDate),
  );

  return (
    <section className="app-card mt-8 p-5">
      <h2 className="text-xl font-bold">Rappels de contrôle</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Planifie tes contrôles et prépare un plan de révision en un clic.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="reminder-subject" className="app-label">
            Matière
          </label>
          <select
            id="reminder-subject"
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
        <div>
          <label htmlFor="reminder-date" className="app-label">
            Date du contrôle
          </label>
          <input
            id="reminder-date"
            type="date"
            required
            value={examDate}
            onChange={(event) => setExamDate(event.target.value)}
            className="app-input"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="reminder-title" className="app-label">
            Chapitre / thème
          </label>
          <input
            id="reminder-title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Exemple : Les fonctions affines"
            className="app-input"
          />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="app-btn-primary">
            Ajouter un rappel
          </button>
        </div>
      </form>

      {sorted.length === 0 ? (
        <p className="app-empty mt-5 p-4 text-sm">
          Aucun rappel pour l&apos;instant.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {sorted.map((reminder) => {
            const days = daysUntilExam(reminder.examDate);
            const urgent = days !== null && days >= 0 && days <= 3;
            const past = days !== null && days < 0;

            return (
              <article
                key={reminder.id}
                className={`app-card-soft p-4 ${urgent ? "app-reminder-urgent" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{reminder.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {reminder.subject} · {formatExamDate(reminder.examDate)}
                    </p>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        past
                          ? "text-[var(--muted)]"
                          : urgent
                            ? "text-red-600"
                            : "text-[var(--primary-text)]"
                      }`}
                    >
                      {past
                        ? "Contrôle passé"
                        : days === 0
                          ? "Contrôle aujourd'hui !"
                          : days === 1
                            ? "Contrôle demain"
                            : `Contrôle dans ${days} jours`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!past && (
                      <button
                        type="button"
                        onClick={() => onPreparePlan(reminder)}
                        className="app-btn-ghost !py-1.5 !px-3 text-xs"
                      >
                        Préparer un plan
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(reminder.id)}
                      className="app-btn-ghost !py-1.5 !px-3 text-xs hover:!text-red-500"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
