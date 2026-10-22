import { useMemo } from 'react';
import { useLanguageStore, type Locale } from '@/store/language';
import en, { type Translations } from './en';
import zhCN from './zh-CN';

const translations: Record<Locale, Translations> = {
  en,
  'zh-CN': zhCN,
};

type DotPaths<T> = T extends object
  ? { [K in keyof T & string]: T[K] extends object ? `${K}.${DotPaths<T[K]>}` : K }[keyof T & string]
  : never;

/** Every translatable string, as a dot path such as `settings.title`. */
export type TranslationKey = DotPaths<Translations>;

export type TranslationParams = Record<string, string | number>;

/**
 * Walks a dot path into a locale tree. The path is checked by the type system,
 * so the walk always lands on a string.
 */
function resolve(locale: Locale, key: string): string {
  let node: unknown = translations[locale];
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown>)[part];
  }
  return node as string;
}

function format(template: string, params?: TranslationParams): string {
  if (!params) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}

/**
 * Translates outside of React — for services, stores and event handlers that
 * run away from a render. Components should use `useTranslation` so they
 * re-render when the language changes.
 */
export function t(key: TranslationKey, params?: TranslationParams): string {
  return format(resolve(useLanguageStore.getState().locale, key), params);
}

/** Subscribes to the language preference so a change re-renders the caller. */
export function useTranslation() {
  const locale = useLanguageStore((s) => s.locale);

  return useMemo(
    () => ({
      locale,
      t: (key: TranslationKey, params?: TranslationParams) => format(resolve(locale, key), params),
    }),
    [locale],
  );
}
