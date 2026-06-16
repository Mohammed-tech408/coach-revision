export type ExamDiploma = "brevet" | "bac";

export type ExamPrepMode = "chat" | "fiche" | "quiz" | "plan";

export const examModeLabels: Record<ExamPrepMode, string> = {
  chat: "Coach examen",
  fiche: "Fiche de révision",
  quiz: "Quiz type examen",
  plan: "Plan avant l'épreuve",
};

export const examModeDescriptions: Record<ExamPrepMode, string> = {
  chat: "Pose une question sur l'épreuve, la méthode ou un chapitre du programme.",
  fiche: "Génère une fiche ciblée sur le format et les attentes de l'examen.",
  quiz: "Entraîne-toi avec des questions proches de celles de l'examen.",
  plan: "Organise tes révisions jour par jour avant le brevet ou le bac.",
};

export const diplomaConfig: Record<
  ExamDiploma,
  {
    title: string;
    shortTitle: string;
    emoji: string;
    targetClass: string;
    description: string;
    subjects: string[];
    tips: string[];
    defaultExamDate: string;
  }
> = {
  brevet: {
    title: "Brevet des collèges",
    shortTitle: "Brevet",
    emoji: "🎓",
    targetClass: "3ème",
    description:
      "Prépare le DNB avec des fiches, quiz et plans adaptés aux épreuves de français, maths, histoire-géo, sciences et langues.",
    subjects: [
      "Français",
      "Mathématiques",
      "Histoire-Géographie-EMC",
      "Sciences (SVT + Physique-Chimie)",
      "Anglais",
    ],
    tips: [
      "Entraîne-toi sur la rédaction et la grammaire en français.",
      "Révise les automatismes en mathématiques (calcul, géométrie, proportionnalité).",
      "Fais des sujets chronométrés pour gérer ton temps le jour J.",
      "Relis les consignes deux fois avant de répondre.",
    ],
    defaultExamDate: "2026-06-25",
  },
  bac: {
    title: "Baccalauréat",
    shortTitle: "Bac",
    emoji: "🏆",
    targetClass: "Terminale",
    description:
      "Prépare le bac avec des méthodes de dissertation, commentaire, épreuves de spécialité, philosophie et grand oral.",
    subjects: [
      "Français",
      "Philosophie",
      "Grand oral",
      "Spécialité",
      "Histoire-Géographie",
      "Anglais",
      "Mathématiques",
    ],
    tips: [
      "Travaille la méthode avant le contenu (intro, plan, conclusion).",
      "Fais des fiches de citations et d'exemples pour le bac de français et de philo.",
      "Prépare ton grand oral : problématique, plan et questions possibles.",
      "Alterne révisions de cours et sujets type chaque semaine.",
    ],
    defaultExamDate: "2026-06-15",
  },
};

export const examSuggestions: Record<
  ExamDiploma,
  Record<string, string[]>
> = {
  brevet: {
    Français: [
      "Comment réussir la rédaction du brevet ?",
      "Quelles figures de style reviser pour le brevet ?",
      "Comment analyser un paragraphe au brevet ?",
    ],
    Mathématiques: [
      "Quels chapitres de maths sont essentiels pour le brevet ?",
      "Comment réussir les exercices de géométrie au brevet ?",
      "Donne-moi une méthode pour les problèmes de proportionnalité.",
    ],
    "Histoire-Géographie-EMC": [
      "Quels thèmes d'histoire-géo reviser pour le brevet ?",
      "Comment répondre à une question de géographie au brevet ?",
      "Explique la démarche pour analyser un document histoire-géo.",
    ],
    "Sciences (SVT + Physique-Chimie)": [
      "Quels sont les grands thèmes sciences pour le brevet ?",
      "Comment réussir l'épreuve sciences du brevet ?",
      "Rappelle-moi les bases en SVT et physique-chimie pour le DNB.",
    ],
    Anglais: [
      "Comment préparer l'oral d'anglais au brevet ?",
      "Quels temps et structures reviser pour le brevet anglais ?",
      "Donne-moi des phrases utiles pour l'épreuve d'anglais.",
    ],
  },
  bac: {
    Français: [
      "Comment construire une dissertation de français au bac ?",
      "Quelle méthode pour le commentaire composé ?",
      "Comment préparer les oeuvres au programme de français ?",
    ],
    Philosophie: [
      "Comment rédiger une intro de dissertation de philo ?",
      "Quelles notions essentielles reviser pour le bac de philo ?",
      "Comment trouver une problématique rapidement ?",
    ],
    "Grand oral": [
      "Comment structurer mon grand oral ?",
      "Quelles questions peut poser le jury au grand oral ?",
      "Aide-moi à formuler ma problématique de grand oral.",
    ],
    Spécialité: [
      "Comment reviser mon épreuve de spécialité efficacement ?",
      "Quelle méthode pour un exercice type en spécialité ?",
      "Fais-moi un plan de révision pour mon épreuve de spécialité.",
    ],
    "Histoire-Géographie": [
      "Comment réussir la dissertation d'histoire-géo au bac ?",
      "Quelle méthode pour l'étude de documents au bac ?",
      "Quels thèmes majeurs reviser en histoire-géo ?",
    ],
    Anglais: [
      "Comment préparer l'épreuve d'anglais au bac ?",
      "Quelle méthode pour la compréhension écrite au bac ?",
      "Aide-moi à structurer ma production écrite en anglais.",
    ],
    Mathématiques: [
      "Comment organiser mes révisions de maths pour le bac ?",
      "Quelle méthode pour un exercice type bac maths ?",
      "Quels chapitres incontournables reviser en maths terminale ?",
    ],
  },
};
