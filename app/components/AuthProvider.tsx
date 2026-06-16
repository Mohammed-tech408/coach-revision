"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  classNeedsSpecialty,
  type SessionUser,
  type StoredUser,
  type StudentClass,
} from "../lib/constants";
import { SESSION_KEY, USERS_KEY } from "../lib/storage";

type AuthContextValue = {
  user: SessionUser | null;
  ready: boolean;
  login: (email: string, password: string) => string | null;
  register: (
    name: string,
    email: string,
    password: string,
    studentClass: StudentClass,
    specialty: string,
  ) => string | null;
  updateProfile: (
    studentClass: StudentClass,
    specialty: string,
  ) => string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toSessionUser(stored: StoredUser): SessionUser {
  const studentClass = stored.studentClass || "Seconde";
  const specialty =
    classNeedsSpecialty(studentClass) && stored.specialty
      ? stored.specialty
      : "";

  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    studentClass,
    specialty,
  };
}

function normalizeSpecialty(
  studentClass: StudentClass,
  specialty: string,
): string {
  return classNeedsSpecialty(studentClass) ? specialty.trim() : "";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return;

      const session = JSON.parse(raw) as SessionUser;
      const stored = loadUsers().find((item) => item.id === session.id);
      setUser(stored ? toSessionUser(stored) : session);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  function persistSession(sessionUser: SessionUser | null) {
    if (sessionUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    setUser(sessionUser);
  }

  function login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const found = loadUsers().find(
      (item) =>
        item.email === normalizedEmail && item.password === password.trim(),
    );

    if (!found) {
      return "Email ou mot de passe incorrect.";
    }

    persistSession(toSessionUser(found));
    return null;
  }

  function register(
    name: string,
    email: string,
    password: string,
    studentClass: StudentClass,
    specialty: string,
  ) {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();
    const normalizedSpecialty = normalizeSpecialty(studentClass, specialty);

    if (!trimmedName || !normalizedEmail || trimmedPassword.length < 4) {
      return "Remplis tous les champs (mot de passe : 4 caractères minimum).";
    }

    if (classNeedsSpecialty(studentClass) && !normalizedSpecialty) {
      return "Choisis ta spécialité pour Première ou Terminale.";
    }

    const users = loadUsers();
    if (users.some((item) => item.email === normalizedEmail)) {
      return "Un compte existe déjà avec cet email.";
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: normalizedEmail,
      password: trimmedPassword,
      studentClass,
      specialty: normalizedSpecialty,
    };

    saveUsers([...users, newUser]);
    persistSession(toSessionUser(newUser));
    return null;
  }

  function updateProfile(studentClass: StudentClass, specialty: string) {
    if (!user) return "Connecte-toi pour modifier ton profil.";

    const normalizedSpecialty = normalizeSpecialty(studentClass, specialty);

    if (classNeedsSpecialty(studentClass) && !normalizedSpecialty) {
      return "Choisis ta spécialité pour Première ou Terminale.";
    }

    const updatedUser: SessionUser = {
      ...user,
      studentClass,
      specialty: normalizedSpecialty,
    };

    const users = loadUsers().map((item) =>
      item.id === user.id ? { ...item, ...updatedUser, password: item.password } : item,
    );
    saveUsers(users);
    persistSession(updatedUser);
    return null;
  }

  function logout() {
    persistSession(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, login, register, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }
  return context;
}
