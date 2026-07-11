import { cookies } from "next/headers";
import { localeCookieName } from "@/lib/i18n";

export async function hasLocalePreference() {
  return Boolean((await cookies()).get(localeCookieName)?.value);
}
