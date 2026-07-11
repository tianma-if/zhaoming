import { cookies, headers } from "next/headers";
import { defaultLocale, isLocale, localeCookieName, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(localeCookieName)?.value;
  if (isLocale(saved)) return saved;

  const language = (await headers()).get("accept-language")?.split(",")[0]?.split("-")[0];
  return isLocale(language) ? language : defaultLocale;
}
