import { createTranslator } from 'next-intl';
import { routing } from './i18n/routing';

export const i18nConfig = {
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
};

export { createTranslator };
