export const studentClasses = [
  "6ème",
  "5ème",
  "4ème",
  "3ème",
  "Seconde",
  "Première",
  "Terminale",
] as const;

export type StudentClass = (typeof studentClasses)[number];

export const specialties = [
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "NSI (Numérique et Sciences Informatiques)",
  "SES",
  "HGGSP",
  "HLP",
  "LLCER Anglais",
  "LLCER Espagnol",
  "Arts",
  "Sciences de l'Ingénieur",
  "Biologie-Écologie",
] as const;

export type Specialty = (typeof specialties)[number];

export function classNeedsSpecialty(studentClass: StudentClass): boolean {
  return studentClass === "Première" || studentClass === "Terminale";
}

export const subjects = [
  "Mathématiques",
  "Français",
  "Histoire-Géographie",
  "SVT",
  "Physique-Chimie",
  "Anglais",
] as const;

export type Subject = (typeof subjects)[number];

export type GenerationMode = "chat" | "fiche" | "quiz" | "plan";

export const modeLabels: Record<GenerationMode, string> = {
  chat: "Coach IA",
  fiche: "Fiche de révision",
  quiz: "Quiz",
  plan: "Plan de révision",
};

export const modeDescriptions: Record<GenerationMode, string> = {
  chat: "Pose une question et reçois une explication adaptée à ton niveau.",
  fiche: "Génère une fiche claire avec les points essentiels à retenir.",
  quiz: "Entraîne-toi avec des questions à choix multiples corrigées.",
  plan: "Organise tes révisions jour par jour avant un contrôle.",
};

export const modeIcons: Record<GenerationMode, string> = {
  chat: "💬",
  fiche: "📋",
  quiz: "🎯",
  plan: "📅",
};

export const suggestionsBySubject: Record<string, string[]> = {
  Mathématiques: [
    "Explique-moi les fonctions affines simplement.",
    "Comment résoudre une équation du premier degré ?",
    "Quelle est la différence entre périmètre et aire ?",
  ],
  Français: [
    "Comment analyser un paragraphe argumentatif ?",
    "Explique-moi les figures de style les plus courantes.",
    "Comment rédiger une introduction de commentaire ?",
  ],
  "Histoire-Géographie": [
    "Qu'est-ce que la mondialisation en géographie ?",
    "Explique-moi la Révolution française en 5 points.",
    "Comment lire une carte topographique ?",
  ],
  SVT: [
    "Explique-moi la photosynthèse simplement.",
    "Quelle est la différence entre ADN et gènes ?",
    "Comment fonctionne la digestion ?",
  ],
  "Physique-Chimie": [
    "Qu'est-ce qu'une réaction chimique ?",
    "Explique-moi la loi d'Ohm simplement.",
    "Comment convertir des unités en sciences ?",
  ],
  Anglais: [
    "Comment utiliser le present perfect ?",
    "Donne-moi 10 mots utiles pour décrire ma journée.",
    "Comment répondre à une question en anglais au oral ?",
  ],
};

export type ConversationEntry = {
  id: string;
  userId: string;
  mode: GenerationMode;
  subject: string;
  question: string;
  answer: string;
  createdAt: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  studentClass: StudentClass;
  specialty: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  studentClass: StudentClass;
  specialty: string;
};

export type ExamReminder = {
  id: string;
  subject: string;
  title: string;
  examDate: string;
  createdAt: string;
};

export type SubjectProgress = {
  subject: string;
  sessions: number;
  percent: number;
};

export type Badge = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earned: boolean;
};

export const PROGRESS_GOAL_PER_SUBJECT = 10;
