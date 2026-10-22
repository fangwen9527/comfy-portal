import type { Locale } from '@/store/language';

const DOCS_BASE = 'https://shunl12324.github.io/comfy-portal';

/**
 * The docs site is built once per language, so every in-app link to it has to
 * point at the matching build. English lives at the root, Chinese under /zh.
 */
export function docsUrl(path: string, locale: Locale): string {
  return DOCS_BASE + (locale === 'en' ? '' : '/zh') + path;
}
