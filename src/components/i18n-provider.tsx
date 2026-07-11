"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale, localeCookieName, type Locale, translate } from "@/lib/i18n";

type I18nContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: string, values?: Record<string, string | number>) => string };
const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale: initialLocale, children }: { locale: Locale; children: React.ReactNode }) {
  const router = useRouter();
  const [locale, setCurrentLocale] = useState<Locale>(initialLocale ?? defaultLocale);
  function setLocale(nextLocale: Locale) {
    setCurrentLocale(nextLocale);
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return <I18nContext.Provider value={{ locale, setLocale, t: (key, values) => translate(locale, key, values) }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
