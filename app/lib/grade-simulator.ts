import type { ExamDiploma } from "./exam-constants";

export type BrevetScores = {
  francais: number;
  maths: number;
  histoireGeo: number;
  sciences: number;
  oral: number;
  controleContinu: number;
};

export type BacScores = {
  specialite: number;
  francais: number;
  philo: number;
  grandOral: number;
  histoireGeo: number;
  langue: number;
};

export function simulateBrevetAverage(scores: BrevetScores) {
  const examAverage =
    (scores.francais +
      scores.maths +
      scores.histoireGeo +
      scores.sciences +
      scores.oral) /
    5;
  const finalAverage = examAverage * 0.8 + scores.controleContinu * 0.2;
  const points = Math.round(finalAverage * 40);

  return {
    examAverage: round(finalAverage),
    finalAverage: round(finalAverage),
    points: clamp(points, 0, 400),
    mention:
      finalAverage >= 16
        ? "Très bien"
        : finalAverage >= 14
          ? "Bien"
          : finalAverage >= 12
            ? "Assez bien"
            : finalAverage >= 10
              ? "Admis"
              : "Non admis (estimation)",
  };
}

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

export function getGradeFields(diploma: ExamDiploma) {
  if (diploma === "brevet") {
    return [
      { key: "francais", label: "Français /20" },
      { key: "maths", label: "Mathématiques /20" },
      { key: "histoireGeo", label: "Histoire-Géo-EMC /20" },
      { key: "sciences", label: "Sciences /20" },
      { key: "oral", label: "Oral /20" },
      { key: "controleContinu", label: "Contrôle continu /20" },
    ] as const;
  }

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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
