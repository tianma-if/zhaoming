"use client";

import { Languages } from "lucide-react";
import { localeLabels, locales } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" aria-label={t("language.label")}><Languages className="size-4" /><span className="hidden sm:inline">{localeLabels[locale]}</span></Button></DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {locales.map((item) => <DropdownMenuItem key={item} onSelect={() => setLocale(item)}>{localeLabels[item]}</DropdownMenuItem>)}
    </DropdownMenuContent>
  </DropdownMenu>;
}
