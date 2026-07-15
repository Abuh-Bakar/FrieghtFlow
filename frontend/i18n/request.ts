import { getRequestConfig } from "next-intl/server";
import { routing, localeCookieName } from "./routing";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get(localeCookieName)?.value;

  const locale = routing.locales.includes(requestedLocale as (typeof routing.locales)[number])
    ? (requestedLocale as (typeof routing.locales)[number])
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
