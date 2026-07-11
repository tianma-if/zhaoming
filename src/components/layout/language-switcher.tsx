"use client";

import { Check, Languages } from "lucide-react";
import { localeLabels, locales } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { locale, systemLocale, isSystemDetected, setLocale, useSystemLocale, t } = useI18n();
  const currentLabel = isSystemDetected
    ? `${t("language.auto")} · ${localeLabels[systemLocale]}`
    : localeLabels[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t("language.label")}>
          <Languages className="size-4" />
          <span className="hidden sm:inline">{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem onSelect={useSystemLocale}>
          <Check className={isSystemDetected ? "size-4" : "size-4 opacity-0"} />
          <span>{t("language.auto")} · {localeLabels[systemLocale]}</span>
        </DropdownMenuItem>
        {locales.map((item) => (
          <DropdownMenuItem key={item} onSelect={() => setLocale(item)}>
            <Check className={!isSystemDetected && locale === item ? "size-4" : "size-4 opacity-0"} />
            {localeLabels[item]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
