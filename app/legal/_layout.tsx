import { AppBar } from '@/components/layout/app-bar';
import { useTranslation } from '@/i18n';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LegalLayout() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Stack>
        <Stack.Screen
          name="privacy"
          options={{
            header: () => <AppBar title={t('app.legal.privacyTitle')} showBack />,
          }}
        />
        <Stack.Screen
          name="terms"
          options={{
            header: () => <AppBar title={t('app.legal.termsTitle')} showBack />,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
