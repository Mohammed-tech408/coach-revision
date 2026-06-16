import { jsPDF } from "jspdf";
import type { ConversationEntry } from "./constants";
import { modeLabels } from "./constants";

export function buildShareText(entry: {
  subject: string;
  question: string;
  answer: string;
  mode: ConversationEntry["mode"];
}): string {
  return [
    "Coach de Révision IA",
    `${modeLabels[entry.mode]} · ${entry.subject}`,
    `Thème : ${entry.question}`,
    "",
    entry.answer,
    "",
    "— Généré avec Coach de Révision IA",
  ].join("\n");
}

export async function shareContent(title: string, text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function copyShareText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadPdfFiche(options: {
  subject: string;
  question: string;
  answer: string;
  studentName?: string;
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Fiche de revision", margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Matiere : ${options.subject}`, margin, y);
  y += 6;
  if (options.studentName) {
    doc.text(`Eleve : ${options.studentName}`, margin, y);
    y += 6;
  }
  doc.text(`Theme : ${options.question}`, margin, y);
  y += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Contenu", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(options.answer, maxWidth);
  const pageHeight = doc.internal.pageSize.getHeight();

  for (const line of lines) {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += 6;
  }

  const safeName = options.question
    .slice(0, 40)
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  doc.save(`fiche-${options.subject}-${safeName || "revision"}.pdf`);
}
