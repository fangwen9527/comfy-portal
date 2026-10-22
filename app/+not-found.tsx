import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/i18n';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('app.notFound.title') }} />
      <Box className="flex-1 items-center justify-center p-5">
        <Text className="text-xl font-bold">{t('app.notFound.description')}</Text>
        <Link href="/" asChild>
          <Pressable className="mt-4 py-4">
            <Text className="font-medium text-primary-500">{t('app.notFound.goHome')}</Text>
          </Pressable>
        </Link>
      </Box>
    </>
  );
}
