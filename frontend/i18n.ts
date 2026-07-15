import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';

export default getRequestConfig(async () => {
  const locale = 'en';

  return {
    locale,
    messages: (await import('./messages/en.json')).default,
  };
});
