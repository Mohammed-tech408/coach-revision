"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  classNeedsSpecialty,
  specialties,
  studentClasses,
  type StudentClass,
} from "../lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentClass, setStudentClass] = useState<StudentClass>("Seconde");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = register(name, email, password, studentClass, specialty);
    if (message) {
      setError(message);
      return;
    }
    router.push("/revision");
  }

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="mx-auto flex max-w-md items-center justify-between px-6 py-4">
          <Link href="/" className="app-brand">
            Coach de Révision IA
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-12">
        <div className="app-card p-8">
          <h1 className="text-3xl font-bold">
            <span className="app-gradient-title">Créer un compte</span>
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Inscription locale pour ton projet de stage (données sur ton navigateur).
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="name" className="app-label">
                Prénom
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="app-input"
              />
            </div>
            <div>
              <label htmlFor="email" className="app-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="app-input"
              />
            </div>
            <div>
              <label htmlFor="studentClass" className="app-label">
                Ta classe
              </label>
              <select
                id="studentClass"
                required
                value={studentClass}
                onChange={(event) => {
                  const nextClass = event.target.value as StudentClass;
                  setStudentClass(nextClass);
                  if (!classNeedsSpecialty(nextClass)) {
                    setSpecialty("");
                  }
                }}
                className="app-input"
              >
                {studentClasses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {classNeedsSpecialty(studentClass) && (
              <div>
                <label htmlFor="specialty" className="app-label">
                  Ta spécialité
                </label>
                <select
                  id="specialty"
                  required
                  value={specialty}
                  onChange={(event) => setSpecialty(event.target.value)}
                  className="app-input"
                >
                  <option value="">Choisir une spécialité</option>
                  {specialties.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="password" className="app-label">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="app-input"
              />
            </div>

            {error && <p className="app-error text-sm">{error}</p>}

            <button type="submit" className="app-btn-primary w-full">
              Créer mon compte
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-[var(--primary-text)]">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
