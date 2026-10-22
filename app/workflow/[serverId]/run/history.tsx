import { AppBar } from '@/components/layout/app-bar';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ZoomableMedia } from '@/features/generation/components/media-preview/zoomable-media';
import { MediaActions } from '@/features/generation/components/media-preview/media-actions';
import { useTranslation } from '@/i18n';
import { loadHistoryMedia } from '@/services/image-storage';
import { showToast } from '@/utils/toast';
import { File } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import { Download, Share, Trash2, X } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeleteAlert } from '@/features/generation/components/history-drawer/delete-alert';
import { HistoryItem } from '@/features/generation/components/history-drawer/history-item';

const NUM_COLUMNS = 3;
const GRID_GAP = 4;
const HORIZONTAL_PADDING = 16;

const listContentStyle = {
  paddingHorizontal: HORIZONTAL_PADDING - GRID_GAP / 2,
  paddingBottom: 40,
};

export default function HistoryGalleryPage() {
  const { t } = useTranslation();
  const { serverId, workflowId } = useLocalSearchParams<{ serverId: string; workflowId: string }>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [mediaItems, setMediaItems] = useState<{ url: string; timestamp: number }[]>([]);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // Preview state. The preview pages through the whole gallery, so what it
  // shows is an index into `mediaItems` rather than a single URL.
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showMediaActions, setShowMediaActions] = useState(false);
  // Read once when the pager mounts. Kept out of state because FlatList only
  // honours `initialScrollIndex` on mount, and feeding it a value that moves
  // while the user swipes invites it to jump back.
  const initialPreviewIndexRef = useRef(0);
  const previewUrl = mediaItems[previewIndex]?.url;

  // The preview is an in-tree overlay rather than a Modal, so Android's back
  // gesture isn't intercepted for us — without this it would pop the whole
  // gallery instead of closing the image.
  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setShowMediaActions(false);
  }, []);

  useEffect(() => {
    if (!isPreviewOpen) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      closePreview();
      return true;
    });
    return () => subscription.remove();
  }, [isPreviewOpen, closePreview]);

  // Stable callback refs to avoid re-renders
  const onItemPressRef = useRef<(url: string) => void>(() => {});
  const onItemLongPressRef = useRef<(url: string) => void>(() => {});

  onItemPressRef.current = (url: string) => {
    if (isSelectionMode) {
      setSelectedMedia((prev) => {
        const next = new Set(prev);
        if (next.has(url)) next.delete(url);
        else next.add(url);
        if (next.size === 0) setIsSelectionMode(false);
        return next;
      });
    } else {
      const index = Math.max(
        mediaItems.findIndex((item) => item.url === url),
        0,
      );
      initialPreviewIndexRef.current = index;
      setPreviewIndex(index);
      setIsPreviewOpen(true);
    }
  };

  onItemLongPressRef.current = (url: string) => {
    setIsSelectionMode(true);
    setSelectedMedia(new Set([url]));
  };

  // Load data on mount
  useEffect(() => {
    if (serverId && workflowId) {
      loadHistoryMedia(serverId, workflowId).then(setMediaItems);
    }
  }, [serverId, workflowId]);

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedMedia(new Set());
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!workflowId || selectedMedia.size === 0) return;
    try {
      for (const url of selectedMedia) {
        try { new File(url).delete(); } catch { /* ignore */ }
        try { new File(`${url}.json`).delete(); } catch { /* ignore */ }
      }
      const updatedMedia = await loadHistoryMedia(serverId, workflowId);
      setMediaItems(updatedMedia);
      setSelectedMedia(new Set());
      setIsSelectionMode(false);
      setIsDeleteAlertOpen(false);
    } catch {
      showToast.error(t('app.history.deleteFailedTitle'), t('app.history.deleteFailedDescription'), insets.top + 8);
    }
  }, [selectedMedia, serverId, workflowId, insets.top, t]);

  const handleShare = useCallback(async () => {
    if (selectedMedia.size === 0) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showToast.error(
          t('app.history.shareUnavailableTitle'),
          t('app.history.shareUnavailableDescription'),
          insets.top + 8,
        );
        return;
      }
      await Sharing.shareAsync(selectedMedia.values().next().value!);
    } catch { /* ignore */ }
  }, [insets.top, selectedMedia, t]);

  const handleSave = useCallback(async () => {
    if (selectedMedia.size === 0) return;
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      showToast.error(t('app.history.permissionTitle'), t('app.history.permissionDescription'), insets.top + 8);
      return;
    }
    let savedCount = 0;
    try {
      for (const url of selectedMedia) {
        await MediaLibrary.saveToLibraryAsync(url);
        savedCount++;
      }
      showToast.success(
        t('app.history.savedTitle'),
        savedCount > 1 ? t('app.history.saved', { count: savedCount }) : t('app.history.savedOne'),
        insets.top + 8,
      );
      setIsSelectionMode(false);
      setSelectedMedia(new Set());
    } catch {
      showToast.error(t('app.history.saveFailedTitle'), t('app.history.saveFailedDescription'), insets.top + 8);
    }
  }, [insets.top, selectedMedia, t]);

  const handlePreviewScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setPreviewIndex(Math.round(event.nativeEvent.contentOffset.x / screenWidth));
    },
    [screenWidth],
  );

  const renderPreviewPage = useCallback(
    ({ item, index }: { item: { url: string; timestamp: number }; index: number }) => (
      <View style={{ width: screenWidth }}>
        <ZoomableMedia
          mediaUrl={item.url}
          isActive={index === previewIndex}
          onClose={closePreview}
          onLongPress={() => setShowMediaActions(true)}
        />
      </View>
    ),
    [screenWidth, previewIndex, closePreview],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: { url: string; timestamp: number }; index: number }) => (
      <View style={{ flex: 1, padding: GRID_GAP / 2 }}>
        <HistoryItem
          url={item.url}
          index={index}
          isSelectionMode={isSelectionMode}
          isSelected={selectedMedia.has(item.url)}
          onPress={onItemPressRef.current}
          onLongPress={onItemLongPressRef.current}
        />
      </View>
    ),
    [isSelectionMode, selectedMedia],
  );

  const hasSelection = selectedMedia.size > 0;

  const rightElement = useMemo(() => {
    return (
      <HStack className="items-center" space="xs">
        <Button
          variant="link"
          className="h-9 w-9 rounded-xl p-0"
          onPress={handleShare}
          disabled={!isSelectionMode || !hasSelection}
          style={{ opacity: isSelectionMode && hasSelection ? 1 : isSelectionMode ? 0.3 : 0 }}
          pointerEvents={isSelectionMode ? 'auto' : 'none'}
        >
          <Icon as={Share} size="md" className="text-primary-500" />
        </Button>
        <Button
          variant="link"
          className="h-9 w-9 rounded-xl p-0"
          onPress={handleSave}
          disabled={!isSelectionMode || !hasSelection}
          style={{ opacity: isSelectionMode && hasSelection ? 1 : isSelectionMode ? 0.3 : 0 }}
          pointerEvents={isSelectionMode ? 'auto' : 'none'}
        >
          <Icon as={Download} size="md" className="text-primary-500" />
        </Button>
        <Button
          variant="link"
          className="h-9 w-9 rounded-xl p-0"
          onPress={() => setIsDeleteAlertOpen(true)}
          disabled={!isSelectionMode || !hasSelection}
          style={{ opacity: isSelectionMode && hasSelection ? 1 : isSelectionMode ? 0.3 : 0 }}
          pointerEvents={isSelectionMode ? 'auto' : 'none'}
        >
          <Icon as={Trash2} size="md" className="text-error-500" />
        </Button>
        {isSelectionMode ? (
          <Button
            variant="solid"
            size="xs"
            onPress={exitSelectionMode}
            className="ml-1 rounded-lg bg-primary-500"
            style={{ width: 60 }}
          >
            <ButtonText className="text-xs font-semibold">{t('common.action.done')}</ButtonText>
          </Button>
        ) : (
          <Button
            variant="solid"
            size="xs"
            onPress={() => setIsSelectionMode(true)}
            className="ml-1 rounded-lg bg-background-100"
            style={{ width: 60, borderWidth: 1, borderColor: 'transparent' }}
          >
            <ButtonText className="text-xs font-medium text-primary-400">{t('app.history.select')}</ButtonText>
          </Button>
        )}
      </HStack>
    );
  }, [isSelectionMode, hasSelection, handleShare, handleSave, exitSelectionMode, t]);

  return (
    <View className="flex-1 bg-background-0">
      <AppBar
        title={isSelectionMode ? t('app.history.selectedCount', { count: selectedMedia.size }) : t('app.history.title')}
        titleSize="sm"
        rightElement={rightElement}
      />

      {/* Grid */}
      <FlatList
        data={mediaItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        removeClippedSubviews
        contentContainerStyle={listContentStyle}
        initialNumToRender={12}
        maxToRenderPerBatch={9}
        windowSize={5}
      />

      {/* Fullscreen preview.
          A plain overlay rather than a Modal. This screen is already presented
          as a native modal, and nesting an RN Modal inside it puts VideoView in
          a separate native view hierarchy where the video layer never renders —
          videos played with sound over a black screen. The screen fills the
          modal already, so an absolutely positioned sibling covers everything
          without leaving the view tree.

          AnimatePresence keeps the overlay mounted through its exit animation,
          which a bare `isPreviewOpen && ...` cannot do — the children hold
          their last props while it plays.

          Backdrop and content animate separately on purpose. Fading the whole
          thing at once cross-dissolves the fullscreen media into the grid,
          which holds a thumbnail of that very same media — two copies of one
          image at two sizes, i.e. a ghost. So the content leaves first against
          opaque black, and only then does the black pull back. */}
      <AnimatePresence>
        {isPreviewOpen && (
          <MotiView
            key="preview"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'timing', duration: 140 }}
            exitTransition={{ type: 'timing', duration: 110, delay: 120 }}
            style={[StyleSheet.absoluteFill, { zIndex: 20, backgroundColor: 'black' }]}
          >
            <MotiView
              from={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'timing', duration: 200 }}
              exitTransition={{ type: 'timing', duration: 120 }}
              style={{ flex: 1 }}
            >
              {/* A paging FlatList rather than a PagerView (which the run
                  screen uses): a pager mounts every child, and a gallery can
                  hold hundreds of items — this only keeps a few pages alive.
                  Each page is exactly one screen wide, so getItemLayout is
                  arithmetic and initialScrollIndex lands on the tapped item
                  without a visible scroll. */}
              <FlatList
                data={mediaItems}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={keyExtractor}
                initialScrollIndex={initialPreviewIndexRef.current}
                getItemLayout={(_, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                onMomentumScrollEnd={handlePreviewScrollEnd}
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                // Three pages is already a small enough window; the extra
                // removeClippedSubviews has a history of blanking pages on
                // horizontal iOS lists, so it isn't worth the trade here.
                windowSize={3}
                renderItem={renderPreviewPage}
              />

              {mediaItems.length > 1 && (
                <View
                  pointerEvents="none"
                  style={{ position: 'absolute', top: insets.top + 12, left: 12, zIndex: 30 }}
                  className="min-w-[52px] items-center rounded-full bg-black/40 px-2.5 py-1.5"
                >
                  <Text className="text-xs font-medium text-white">
                    {previewIndex + 1}/{mediaItems.length}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                activeOpacity={0.5}
                onPress={closePreview}
                style={{
                  position: 'absolute',
                  top: insets.top + 12,
                  right: 12,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 8,
                  padding: 8,
                  zIndex: 30,
                }}
              >
                <Icon as={X} size="sm" className="text-white" />
              </TouchableOpacity>
            </MotiView>

            {/* Inside the overlay so it shares the stacking context: the panel
                positions itself absolutely with no z-index of its own, so as a
                sibling it would sit under the overlay on Android. Outside the
                animated content so dismissing it doesn't ride the scale. */}
            <MediaActions
              isOpen={showMediaActions}
              onClose={() => setShowMediaActions(false)}
              mediaUrl={previewUrl}
              workflowId={workflowId}
              serverId={serverId}
            />
          </MotiView>
        )}
      </AnimatePresence>

      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirm={confirmDelete}
        title={selectedMedia.size > 1 ? t('app.history.deleteSelectedTitle') : t('app.history.deleteTitle')}
        description={
          selectedMedia.size > 1
            ? t('app.history.deleteSelectedDescription', { count: selectedMedia.size })
            : t('app.history.deleteDescription')
        }
      />
    </View>
  );
}

const keyExtractor = (item: { url: string }) => item.url;
