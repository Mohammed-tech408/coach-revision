"use client";

import { useState } from "react";
import type { Flashcard } from "../lib/constants";

type Props = {
  cards: Flashcard[];
};

export function FlashcardDeck({ cards }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;

  const card = cards[index];

  function goNext() {
    setFlipped(false);
    setIndex((current) => (current + 1) % cards.length);
  }

  function goPrev() {
    setFlipped(false);
    setIndex((current) => (current - 1 + cards.length) % cards.length);
  }

  return (
    <div className="mt-6">
      <p className="mb-3 text-sm text-[var(--muted)]">
        Carte {index + 1}/{cards.length} · clique pour retourner
      </p>
      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className={`app-flashcard ${flipped ? "app-flashcard-flipped" : ""}`}
      >
        <span className="app-flashcard-label">
          {flipped ? "Réponse" : "Question"}
        </span>
        <span className="app-flashcard-text">
          {flipped ? card.back : card.front}
        </span>
      </button>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={goPrev} className="app-btn-secondary">
          Précédente
        </button>
        <button type="button" onClick={goNext} className="app-btn-primary">
          Suivante
        </button>
      </div>
    </div>
  );
}
