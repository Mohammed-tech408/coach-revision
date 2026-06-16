import type { GenerationMode } from "./constants";

export function basePrompt(studentClass: string, specialty?: string): string {
  let prompt =
    `Tu es un coach de révision bienveillant pour un élève de ${studentClass} en France. ` +
    "Réponds toujours en français, de façon claire et adaptée au niveau de cette classe.";

  if (specialty) {
    prompt += ` L'élève a choisi la spécialité : ${specialty}. Tiens-en compte dans tes explications et exemples.`;
  }

  return prompt;
}

export function getSystemPrompt(
  mode: GenerationMode,
  studentClass: string,
  specialty?: string,
): string {
  const intro = basePrompt(studentClass, specialty);

  switch (mode) {
    case "fiche":
      return (
        intro +
        " Crée une fiche de révision complète avec : titre, notions clés, définitions, " +
        "exemples, erreurs à éviter, et 5 questions de révision. Utilise des titres et des listes."
      );
    case "quiz":
      return (
        intro +
        " Génère un quiz de révision. Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après, " +
        'au format : {"questions":[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]}. ' +
        "Crée 5 questions avec 4 options chacune, adaptées au niveau de la classe."
      );
    case "plan":
      return (
        intro +
        " Crée un plan de révision personnalisé jour par jour. Structure avec : objectif global, " +
        "durée conseillée par jour, étapes concrètes, pauses, et conseils pour rester motivé."
      );
    default:
      return (
        intro +
        " Explique simplement, avec des exemples concrets. Structure ta réponse avec des titres courts " +
        "et des listes si utile. Termine par 2 ou 3 questions de révision pour tester l'élève."
      );
  }
}

export function buildUserContent(
  mode: GenerationMode,
  subject: string,
  question: string,
  studentClass: string,
  specialty?: string,
  examDate?: string,
  daysUntilExam?: number,
  hoursPerDay?: number,
): string {
  const specialtyLine = specialty ? `\nSpécialité : ${specialty}` : "";
  const base =
    `Classe : ${studentClass}${specialtyLine}\nMatière : ${subject}\nThème / chapitre : ${question}`;

  if (mode === "plan") {
    return (
      `${base}\nDate du contrôle : ${examDate || "non précisée"}\n` +
      `Jours disponibles : ${daysUntilExam || 7}\n` +
      `Temps de révision par jour : ${hoursPerDay || 1} heure(s)`
    );
  }

  return base;
}
