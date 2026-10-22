import { AppBar } from '@/components/layout/app-bar';
import { WebViewPage } from '@/components/common/webview-page';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from '@/i18n';
import { docsUrl } from '@/utils/docs-url';
import React, { useMemo, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';

const LocalServerGuide = () => {
  const { t, locale } = useTranslation();

  return (
    <WebViewPage
      uri={docsUrl('/guide/local-server', locale)}
      loadingTitle={t('app.guide.loadingTitle', { name: t('app.guide.tab.localServer') })}
      slowLoadingTitle={t('app.guide.slowLoadingTitle', { name: t('app.guide.tab.localServer') })}
    />
  );
};

const RemoteServerGuide = () => {
  const { t, locale } = useTranslation();

  return (
    <WebViewPage
      uri={docsUrl('/guide/remote-server', locale)}
      loadingTitle={t('app.guide.loadingTitle', { name: t('app.guide.tab.remoteServer') })}
      slowLoadingTitle={t('app.guide.slowLoadingTitle', { name: t('app.guide.tab.remoteServer') })}
    />
  );
};

const RunPodServerGuide = () => {
  const { t, locale } = useTranslation();

  return (
    <WebViewPage
      uri={docsUrl('/guide/remote-server-runpod', locale)}
      loadingTitle={t('app.guide.loadingTitle', { name: t('app.guide.tab.runpod') })}
      slowLoadingTitle={t('app.guide.slowLoadingTitle', { name: t('app.guide.tab.runpod') })}
    />
  );
};

const renderScene = SceneMap({
  local: LocalServerGuide,
  remote: RemoteServerGuide,
  runpod: RunPodServerGuide,
});

export default function GuideScreen() {
  const layout = useWindowDimensions();
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const routes = useMemo(
    () => [
      { key: 'local', title: t('app.guide.tab.localServer') },
      { key: 'remote', title: t('app.guide.tab.remoteServer') },
      { key: 'runpod', title: t('app.guide.tab.runpod') },
    ],
    [t],
  );

  const renderTabBar = (props: any) => {
    return (
      <VStack className="bg-background-0">
        <AppBar title={t('app.guide.title')} showBack />
        <HStack className="border-b border-outline-200 px-5">
          {props.navigationState.routes.map((route: any, i: number) => {
            const isActive = index === i;
            return (
              <Pressable
                key={route.key}
                onPress={() => setIndex(i)}
                className="flex-1"
              >
                <VStack className="items-center pb-3">
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? 'text-primary-900' : 'text-typography-500'
                    }`}
                  >
                    {route.title}
                  </Text>
                </VStack>
                {isActive && (
                  <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-900" />
                )}
              </Pressable>
            );
          })}
        </HStack>
      </VStack>
    );
  };

  return (
    <View className="flex-1 bg-background-0">
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}
