export type BacScores = {
  specialite: number;
  francais: number;
  philo: number;
  grandOral: number;
  histoireGeo: number;
  langue: number;
};

export function simulateBacAverage(scores: BacScores) {
  const average =
    (scores.specialite * 2 +
      scores.francais * 2 +
      scores.philo +
      scores.grandOral +
      scores.histoireGeo +
      scores.langue) /
    8;

  return {
    average: round(average),
    mention:
      average >= 16
        ? "Très bien"
        : average >= 14
          ? "Bien"
          : average >= 12
            ? "Assez bien"
            : average >= 10
              ? "Admis"
              : "Non admis (estimation)",
  };
}

export function getGradeFields() {
  return [
    { key: "specialite", label: "Spécialité /20 (coef 2)" },
    { key: "francais", label: "Français /20 (coef 2)" },
    { key: "philo", label: "Philosophie /20" },
    { key: "grandOral", label: "Grand oral /20" },
    { key: "histoireGeo", label: "Histoire-Géo /20" },
    { key: "langue", label: "Langue vivante /20" },
  ] as const;
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}
