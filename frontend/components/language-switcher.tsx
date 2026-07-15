"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { localeCookieName } from "../i18n/routing";

interface LanguageSwitcherProps {
  className?: string;
  buttonClassName?: string;
}

export function LanguageSwitcher({ className, buttonClassName }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (nextLocale: string) => {
    if (nextLocale === locale) return;

    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000`;

    startTransition(() => {
      router.replace(`${pathname}${window.location.search}`);
      router.refresh();
    });
  };

  return (
    <div className={['flex items-center gap-1', className].filter(Boolean).join(' ')}>
      <Button
        variant="ghost"
        size="sm"
        className={['h-8 px-2 text-sm font-medium', buttonClassName ?? 'text-white/70 hover:text-white'].filter(Boolean).join(' ')}
        onClick={() => switchLocale("en")}
        disabled={isPending || locale === "en"}
      >
        EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={['h-8 px-2 text-sm font-medium', buttonClassName ?? 'text-white/70 hover:text-white'].filter(Boolean).join(' ')}
        onClick={() => switchLocale("fr")}
        disabled={isPending || locale === "fr"}
      >
        FR
      </Button>
    </div>
  );
}
