import { cookies, headers } from "next/headers";
import { localeFromLanguage, isLocale, localeCookieName, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(localeCookieName)?.value;
  if (isLocale(saved)) return saved;

  return localeFromLanguage((await headers()).get("accept-language") ?? undefined);
}
