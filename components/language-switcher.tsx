"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/components/language-provider";
import { languages, type Language } from "@/lib/i18n";

const languageOptions: Language[] = ["pt", "es"];

export function LanguageSwitcher(): JSX.Element {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="fixed bottom-4 left-3 z-50 flex items-center gap-1 rounded-full border border-line bg-white/95 p-1 text-ink shadow-soft backdrop-blur sm:bottom-auto sm:left-auto sm:right-3 sm:top-3">
      <span className="sr-only">{t("language.switch")}</span>
      <Languages aria-hidden="true" className="ml-2 h-4 w-4 text-ink/50" />
      {languageOptions.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`min-h-8 rounded-full px-2.5 text-xs font-black transition ${
            language === option
              ? "bg-leaf text-white"
              : "text-ink/60 hover:bg-cream hover:text-ink"
          }`}
          aria-label={languages[option].label}
          title={languages[option].label}
        >
          {languages[option].shortLabel}
        </button>
      ))}
    </div>
  );
}
