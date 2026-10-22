import { AppBar } from '@/components/layout/app-bar';
import { SegmentedControl } from '@/components/self-ui/segmented-control';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useTranslation } from '@/i18n';
import { LOCALE_LABELS, LOCALES, useLanguageStore } from '@/store/language';
import { useThemeStore } from '@/store/theme';
import * as Linking from 'expo-linking';
import { Link } from 'expo-router';
import {
  BookOpen,
  ChevronRight,
  FileText,
  GithubIcon,
  Info,
  Languages,
  Palette,
  Shield,
  Sparkles,
  Star,
} from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';

const THEME_PREFERENCES = ['light', 'dark', 'system'] as const;

export default function SettingScreen() {
  const { preference, setPreference } = useThemeStore();
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslation();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  // App Store URL
  const appStoreUrl = 'https://apps.apple.com/us/app/comfy-portal/id6741044736';

  const openAppStore = () => {
    Linking.openURL(appStoreUrl);
  };

  const themeLabels = {
    light: t('settings.themeLight'),
    dark: t('settings.themeDark'),
    system: t('settings.themeSystem'),
  };
  const languageLabels = LOCALES.map((code) => LOCALE_LABELS[code]);

  // SegmentedControl reports back the label it was handed, so map it to a value.
  const pickTheme = (label: string) => {
    const index = THEME_PREFERENCES.findIndex((option) => themeLabels[option] === label);
    if (index !== -1) {
      setPreference(THEME_PREFERENCES[index]);
    }
  };

  const pickLanguage = (label: string) => {
    const index = languageLabels.indexOf(label);
    if (index !== -1) {
      setLocale(LOCALES[index]);
    }
  };

  return (
    <View className="flex-1 bg-background-0">
      <AppBar title={t('settings.title')} titleSize="xl" />
      <ScrollView className="flex-1">
        <View className="px-5 w-full">
          {/* Theme Section */}
          <View className="py-4">
            <View className="mb-4 flex-row items-center">
              <Icon as={Palette} size="lg" className="mr-3 text-primary-500" />
              <Text className="text-base font-medium text-typography-900">{t('settings.theme')}</Text>
            </View>
            <SegmentedControl
              options={THEME_PREFERENCES.map((option) => themeLabels[option])}
              value={themeLabels[preference]}
              onChange={pickTheme}
            />
          </View>

          {/* Language Section */}
          <View className="py-4">
            <View className="mb-4 flex-row items-center">
              <Icon as={Languages} size="lg" className="mr-3 text-primary-500" />
              <Text className="text-base font-medium text-typography-900">{t('settings.language')}</Text>
            </View>
            <SegmentedControl options={languageLabels} value={LOCALE_LABELS[locale]} onChange={pickLanguage} />
          </View>

          {/* AI Assistant Section */}
          <Link href="/settings/ai-assistant" asChild>
            <Pressable className="py-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Icon as={Sparkles} size="lg" className="mr-3 text-primary-500" />
                  <Text className="text-base font-medium text-typography-900">{t('settings.aiAssistant.title')}</Text>
                </View>
                <Icon as={ChevronRight} size="sm" className="text-typography-400" />
              </View>
            </Pressable>
          </Link>

          {/* Guide Section */}
          <Link href="/guide" asChild>
            <Pressable className="py-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Icon as={BookOpen} size="lg" className="mr-3 text-primary-500" />
                  <Text className="text-base font-medium text-typography-900">{t('settings.guide')}</Text>
                </View>
                <Icon as={ChevronRight} size="sm" className="text-typography-400" />
              </View>
            </Pressable>
          </Link>

          {/* Legal Section */}
          <Link href="/legal/privacy" asChild>
            <Pressable className="py-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Icon as={Shield} size="lg" className="mr-3 text-primary-500" />
                  <Text className="text-base font-medium text-typography-900">{t('settings.privacyPolicy')}</Text>
                </View>
                <Icon as={ChevronRight} size="sm" className="text-typography-400" />
              </View>
            </Pressable>
          </Link>

          <Link href="/legal/terms" asChild>
            <Pressable className="py-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Icon as={FileText} size="lg" className="mr-3 text-primary-500" />
                  <Text className="text-base font-medium text-typography-900">{t('settings.termsOfService')}</Text>
                </View>
                <Icon as={ChevronRight} size="sm" className="text-typography-400" />
              </View>
            </Pressable>
          </Link>

          {/* Rate App Section */}
          <Pressable className="py-4" onPress={openAppStore}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Icon as={Star} size="lg" className="mr-3 text-primary-500" />
                <Text className="text-base font-medium text-typography-900">{t('settings.rateApp')}</Text>
              </View>
              <Icon as={ChevronRight} size="sm" className="text-typography-400" />
            </View>
          </Pressable>

          {/* About Section */}
          <View className="py-4">
            <Pressable
              className="flex-row items-center justify-between"
              onPress={() => setIsAboutExpanded(!isAboutExpanded)}
            >
              <View className="flex-row items-center">
                <Icon as={Info} size="lg" className="mr-3 text-primary-500" />
                <Text className="text-base font-medium text-typography-900">{t('settings.about')}</Text>
              </View>
              <MotiView
                animate={{
                  rotateZ: isAboutExpanded ? '90deg' : '0deg',
                }}
              >
                <Icon as={ChevronRight} size="sm" className="text-typography-400" />
              </MotiView>
            </Pressable>

            {isAboutExpanded && (
              <MotiView
                from={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  type: 'timing',
                  duration: 200,
                }}
                className="mt-4"
              >
                <Text className="mb-4 text-sm text-typography-600">{t('settings.aboutDescription')}</Text>
                <Link href="https://github.com/ShunL12324/comfy-portal" asChild>
                  <Pressable className="mb-2 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Icon as={GithubIcon} size="lg" className="mr-3 text-primary-500" />
                      <Text className="text-base font-medium text-typography-900">{t('settings.github')}</Text>
                    </View>
                    <Icon as={ChevronRight} size="sm" className="text-typography-400" />
                  </Pressable>
                </Link>
                <Text className="text-sm text-typography-500">{t('settings.openSourceNote')}</Text>
              </MotiView>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
