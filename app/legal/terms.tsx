import { WebViewPage } from '@/components/common/webview-page';
import { useTranslation } from '@/i18n';
import { docsUrl } from '@/utils/docs-url';

export default function TermsScreen() {
  const { t, locale } = useTranslation();

  return (
    <WebViewPage
      uri={docsUrl('/terms', locale)}
      loadingTitle={t('app.legal.loadingTitle', { name: t('app.legal.termsTitle') })}
      slowLoadingTitle={t('app.legal.slowLoadingTitle', { name: t('app.legal.termsTitle') })}
    />
  );
}
