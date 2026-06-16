"use client";

import { FormEvent, useState } from "react";

type Props = {
  studentClass: string;
  specialty: string;
};

export function GrandOralPanel({ studentClass, specialty }: Props) {
  const [question, setQuestion] = useState("");
  const [problematique, setProblematique] = useState("");
  const [plan, setPlan] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");

    const prompt = [
      "Prépare mon grand oral de baccalauréat.",
      `Question : ${question.trim()}`,
      `Problématique : ${problematique.trim()}`,
      `Plan : ${plan.trim()}`,
      "",
      "Donne-moi :",
      "1) Un retour sur ma problématique et mon plan",
      "2) 8 questions possibles du jury",
      "3) 3 conseils pour l'oral",
    ].join("\n");

    try {
      const response = await fetch("/api/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          subject: "Grand oral",
          question: prompt,
          studentClass,
          specialty,
          examType: "bac",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setAnswer(data.answer);
    } catch {
      setError("Impossible de contacter le coach.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="app-card mt-8 p-5">
      <h2 className="text-xl font-bold">Préparation Grand oral</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Remplis ton sujet, ta problématique et ton plan — le coach simule le
        jury.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="oral-question" className="app-label">
            Ta question
          </label>
          <input
            id="oral-question"
            required
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Exemple : Comment la science fiction interroge-t-elle notre avenir ?"
            className="app-input"
          />
        </div>
        <div>
          <label htmlFor="oral-problematique" className="app-label">
            Problématique
          </label>
          <textarea
            id="oral-problematique"
            required
            rows={3}
            value={problematique}
            onChange={(event) => setProblematique(event.target.value)}
            placeholder="En quoi..."
            className="app-input"
          />
        </div>
        <div>
          <label htmlFor="oral-plan" className="app-label">
            Plan
          </label>
          <textarea
            id="oral-plan"
            required
            rows={4}
            value={plan}
            onChange={(event) => setPlan(event.target.value)}
            placeholder="I. ... II. ... III. ..."
            className="app-input"
          />
        </div>

        <button type="submit" disabled={loading} className="app-btn-primary">
          {loading ? "Analyse en cours..." : "Simuler le jury"}
        </button>
      </form>

      {error && <div className="app-error mt-4">{error}</div>}

      {answer && (
        <div className="app-answer mt-6">
          <p className="app-answer-title">Retour Grand oral</p>
          <div className="app-answer-body">{answer}</div>
        </div>
      )}
    </section>
  );
}
