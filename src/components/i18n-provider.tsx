"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale, localeCookieName, localeFromLanguage, type Locale, translate } from "@/lib/i18n";

type I18nContextValue = { locale: Locale; systemLocale: Locale; isSystemDetected: boolean; setLocale: (locale: Locale) => void; useSystemLocale: () => void; t: (key: string, values?: Record<string, string | number>) => string };
const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale: initialLocale, isSystemDetected: initialSystemDetected, children }: { locale: Locale; isSystemDetected: boolean; children: React.ReactNode }) {
  const router = useRouter();
  const [locale, setCurrentLocale] = useState<Locale>(initialLocale ?? defaultLocale);
  const [systemLocale, setSystemLocale] = useState<Locale>(initialLocale ?? defaultLocale);
  const [isSystemDetected, setIsSystemDetected] = useState(initialSystemDetected);

  function setLocale(nextLocale: Locale) {
    setCurrentLocale(nextLocale);
    setIsSystemDetected(false);
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  function useSystemLocale() {
    const nextLocale = localeFromLanguage(window.navigator.language);
    setSystemLocale(nextLocale);
    setCurrentLocale(nextLocale);
    setIsSystemDetected(true);
    document.cookie = `${localeCookieName}=; path=/; max-age=0; samesite=lax`;
    router.refresh();
  }

  return <I18nContext.Provider value={{ locale, systemLocale, isSystemDetected, setLocale, useSystemLocale, t: (key, values) => translate(locale, key, values) }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
