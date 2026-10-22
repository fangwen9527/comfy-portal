import { KeyboardModal } from '@/components/self-ui/keyboard-modal';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Link, LinkText } from '@/components/ui/link';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { parseWorkflowTemplate } from '@/features/workflow/utils/workflow-parser';
import { useTranslation } from '@/i18n';
import { saveWorkflowThumbnail } from '@/services/image-storage';
import { docsUrl } from '@/utils/docs-url';
import { showToast } from '@/utils/toast';
import * as ExpoClipboard from 'expo-clipboard';
import { generateUUID } from '@/utils/uuid';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { CheckCircle, Clipboard, FileJson, ImagePlus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
}

export function ImportWorkflowModal({ isOpen, onClose, serverId }: AddWorkflowModalProps) {
  const { t, locale } = useTranslation();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(() => t('workflow.importModal.defaultName'));
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const [workflowData, setWorkflowData] = useState<any>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const addWorkflow = useWorkflowStore((state) => state.addWorkflow);

  useEffect(() => {
    if (name.trim().length > 50) {
      setName(name.slice(0, 50));
      showToast.error(t('workflow.nameTooLong', { count: 50 }), undefined, insets.top + 8);
    }
  }, [insets.top, name, t]);

  const handleAdd = async () => {
    if (!name.trim()) {
      setError(t('workflow.nameRequired'));
      return;
    }

    if (!workflowData) {
      setError(t('workflow.importModal.importRequired'));
      return;
    }

    const workflowId = generateUUID();
    let finalThumbnail = '';
    if (thumbnail) {
      const ext = thumbnail.split('.').pop();
      const workflowDir = new Directory(Paths.document, 'workflows', workflowId);
      const thumbnailFile = new File(workflowDir, `thumbnail.${ext}`);

      try {
        workflowDir.create({ intermediates: true, idempotent: true });
        new File(thumbnail).copy(thumbnailFile);
        finalThumbnail = thumbnailFile.uri;
      } catch (error) {
        console.error('Failed to save thumbnail:', error);
      }
    }

    addWorkflow({
      name: name.trim(),
      serverId,
      thumbnail: finalThumbnail,
      addMethod: workflowData.addMethod,
      data: workflowData.data,
    });

    handleClose();
  };

  const handleSelectImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert(t('workflow.photoPermission'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const tempId = await generateUUID();
        const savedImage = await saveWorkflowThumbnail({
          serverId,
          workflowId: tempId,
          imageUri: result.assets[0].uri,
          mimeType: result.assets[0].mimeType,
        });

        if (savedImage) {
          const localImageUri = savedImage.path.startsWith('file://') ? savedImage.path : `file://${savedImage.path}`;
          setThumbnail(localImageUri);
        }
      } catch (error) {
        console.error('Failed to save thumbnail:', error);
        alert(t('workflow.saveImageFailed'));
      }
    }
  };

  const handleClose = () => {
    setName('');
    setThumbnail('');
    setError('');
    setWorkflowData(null);
    setUploadedFileName('');
    onClose();
  };

  const handleImportFromFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const fileContent = await new File(result.assets[0].uri).text();
      const jsonData = JSON.parse(fileContent);

      setWorkflowData({
        addMethod: 'file',
        data: parseWorkflowTemplate(jsonData),
      });
      setUploadedFileName(result.assets[0].name);
      setName(result.assets[0].name);
    } catch (error) {
      console.error('Failed to import workflow file:', error);
      showToast.error(t('workflow.importModal.importFailed'), t('workflow.importModal.invalidJsonFile'), insets.top);
    }
  };

  const handleImportFromClipboard = async () => {
    try {
      const hasClipboardText = await ExpoClipboard.hasStringAsync();
      if (!hasClipboardText) {
        showToast.error(t('workflow.importModal.importFailed'), t('workflow.importModal.noClipboardText'), insets.top);
        return;
      }

      const clipboardContent = await ExpoClipboard.getStringAsync();
      if (!clipboardContent) {
        showToast.error(t('workflow.importModal.importFailed'), t('workflow.importModal.clipboardEmpty'), insets.top);
        return;
      }

      const jsonData = JSON.parse(clipboardContent);

      setWorkflowData({
        addMethod: 'clipboard',
        data: parseWorkflowTemplate(jsonData),
      });
      setUploadedFileName(t('workflow.importModal.importedFromClipboard'));
    } catch (error) {
      console.error('Failed to import workflow from clipboard:', error);
      showToast.error(t('workflow.importModal.importFailed'), t('workflow.importModal.invalidClipboardJson'), insets.top);
    }
  };

  return (
    <KeyboardModal isOpen={isOpen} onClose={handleClose}>
      <KeyboardModal.Header>
        <Text className="text-lg font-semibold text-primary-500">{t('workflow.importModal.title')}</Text>
      </KeyboardModal.Header>

      <KeyboardModal.Body scrollEnabled={false}>
        <VStack space="md">
          <KeyboardModal.Item title={t('workflow.nameLabel')} error={error}>
            <Input variant="outline" size="md" className="mt-1 overflow-hidden rounded-md border-0 bg-background-0">
              <InputField
                defaultValue={name}
                onChangeText={(value) => {
                  setName(value);
                  setError('');
                }}
                placeholder={t('workflow.namePlaceholder')}
                className="px-3 py-2 text-sm text-primary-500"
              />
            </Input>
          </KeyboardModal.Item>

          <VStack space="sm">
            <HStack space="sm" className="items-center">
              <Text className="text-sm font-medium text-primary-400">{t('workflow.importModal.title')}</Text>
              <Link href={docsUrl('/guide/workflow-json', locale)}>
                <LinkText className="text-xs">{t('workflow.importModal.whereToGet')}</LinkText>
              </Link>
            </HStack>
            <Pressable
              onPress={handleImportFromFile}
              className="h-32 w-full items-center justify-center rounded-lg border border-dashed border-primary-300 bg-background-0"
            >
              <VStack space="sm" className="items-center">
                <FileJson size={24} className={workflowData ? 'text-primary-500' : 'text-primary-300'} />
                <VStack space="xs" className="items-center">
                  {uploadedFileName ? (
                    <>
                      <Text className="text-sm font-medium text-primary-500">{uploadedFileName}</Text>
                      <Text className="text-xs text-primary-300">{t('workflow.importModal.clickToChange')}</Text>
                    </>
                  ) : (
                    <>
                      <Text className="text-sm font-medium text-primary-400">{t('workflow.importModal.clickToSelect')}</Text>
                      <Text className="text-xs text-primary-300">{t('workflow.importModal.supportsJson')}</Text>
                    </>
                  )}
                </VStack>
              </VStack>
            </Pressable>

            <Button
              variant="solid"
              onPress={handleImportFromClipboard}
              className={`w-full rounded-md ${workflowData?.addMethod === 'clipboard' ? 'bg-success-500' : ''}`}
            >
              <ButtonIcon as={workflowData?.addMethod === 'clipboard' ? CheckCircle : Clipboard} size="md" />
              <ButtonText className="text-typography-0">
                {workflowData?.addMethod === 'clipboard'
                  ? t('workflow.importModal.importedFromClipboard')
                  : t('workflow.importModal.importFromClipboard')}
              </ButtonText>
            </Button>
          </VStack>

          <VStack space="xs">
            <Text className="text-sm font-medium text-primary-400">{t('workflow.thumbnailOptional')}</Text>
            <Pressable onPress={handleSelectImage} className="overflow-hidden rounded-md border-0 bg-background-0">
              {thumbnail ? (
                <Image
                  source={{ uri: thumbnail }}
                  className="h-40 w-full"
                  resizeMode="cover"
                  alt={t('workflow.thumbnailAlt')}
                />
              ) : (
                <VStack className="h-40 items-center justify-center">
                  <ImagePlus className="text-primary-300" />
                  <Text className="mt-2 text-sm text-primary-300">{t('workflow.addThumbnail')}</Text>
                </VStack>
              )}
            </Pressable>
          </VStack>
        </VStack>
      </KeyboardModal.Body>

      <KeyboardModal.Footer>
        <HStack space="sm">
          <Button variant="outline" onPress={handleClose} className="flex-1 rounded-md bg-background-100">
            <ButtonText className="text-primary-400">{t('common.action.cancel')}</ButtonText>
          </Button>
          <Button
            variant="solid"
            onPress={handleAdd}
            className={`flex-1 rounded-md ${!name.trim() || !workflowData ? 'bg-primary-300 opacity-50' : 'bg-primary-500'
              }`}
            disabled={!name.trim() || !workflowData}
          >
            <ButtonText className="text-background-0">{t('workflow.addButton')}</ButtonText>
          </Button>
        </HStack>
      </KeyboardModal.Footer>
    </KeyboardModal>
  );
}
