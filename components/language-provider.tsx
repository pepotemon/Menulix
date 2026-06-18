"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  defaultLanguage,
  dictionary,
  type Language,
  type TranslationKey
} from "@/lib/i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const storageKey = "menulix-language";

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({
  children
}: LanguageProviderProps): JSX.Element {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "pt" || stored === "es") {
      setLanguageState(stored);
    } else if (navigator.language.toLowerCase().startsWith("es")) {
      setLanguageState("es");
    }
  }, []);

  function setLanguage(nextLanguage: Language): void {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(storageKey, nextLanguage);
    document.documentElement.lang = nextLanguage === "pt" ? "pt-BR" : "es";
  }

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => dictionary[language][key] ?? dictionary.pt[key]
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useI18n deve ser usado dentro de LanguageProvider.");
  }

  return context;
}
