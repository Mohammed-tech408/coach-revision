"use client";

import { FormEvent, useState } from "react";
import {
  getGradeFields,
  simulateBacAverage,
  type BacScores,
} from "../lib/grade-simulator";

const defaultBac: BacScores = {
  specialite: 13,
  francais: 12,
  philo: 11,
  grandOral: 14,
  histoireGeo: 12,
  langue: 13,
};

export function GradeSimulatorPanel() {
  const [bacScores, setBacScores] = useState(defaultBac);

  const result = simulateBacAverage(bacScores);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className="app-card mt-8 p-5">
      <h2 className="text-xl font-bold">Simulateur de notes · Bac</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Estimation simplifiée pour te projeter sur ta moyenne (démo pédagogique).
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
        {getGradeFields().map((field) => (
          <div key={field.key}>
            <label htmlFor={`grade-${field.key}`} className="app-label">
              {field.label}
            </label>
            <input
              id={`grade-${field.key}`}
              type="number"
              min={0}
              max={20}
              step={0.5}
              value={bacScores[field.key as keyof BacScores]}
              onChange={(event) => {
                const value = Number(event.target.value);
                setBacScores((current) => ({
                  ...current,
                  [field.key]: value,
                }));
              }}
              className="app-input"
            />
          </div>
        ))}
      </form>

      <div className="app-card-highlight mt-6 p-5">
        <p className="text-sm text-[var(--muted)]">Moyenne estimée</p>
        <p className="mt-1 text-3xl font-bold">{result.average}/20</p>
        <p className="mt-3 font-semibold text-[var(--primary-text)]">
          {result.mention}
        </p>
      </div>
    </section>
  );
}
