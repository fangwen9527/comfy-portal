import { WebViewPage } from '@/components/common/webview-page';
import { useTranslation } from '@/i18n';
import { docsUrl } from '@/utils/docs-url';

export default function PrivacyScreen() {
  const { t, locale } = useTranslation();

  return (
    <WebViewPage
      uri={docsUrl('/privacy', locale)}
      loadingTitle={t('app.legal.loadingTitle', { name: t('app.legal.privacyTitle') })}
      slowLoadingTitle={t('app.legal.slowLoadingTitle', { name: t('app.legal.privacyTitle') })}
    />
  );
}
