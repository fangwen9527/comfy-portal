import { KeyboardModal } from '@/components/self-ui/keyboard-modal';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { parseWorkflowTemplate } from '@/features/workflow/utils/workflow-parser';
import { useTranslation, type TranslationKey } from '@/i18n';
import { saveWorkflowThumbnail } from '@/services/image-storage';
import { showToast } from '@/utils/toast';
import { Asset } from 'expo-asset';
import { generateUUID } from '@/utils/uuid';
import * as ImagePicker from 'expo-image-picker';
import { Circle, CircleCheck, ImagePlus, Scroll } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface WorkflowPreset {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  templatePath: any; // JSON template
  thumbnailPath: number; // React Native static image require
}

const WORKFLOW_PRESETS: WorkflowPreset[] = [
  {
    id: '1',
    titleKey: 'workflow.addModal.presets.textToImage.title',
    descriptionKey: 'workflow.addModal.presets.textToImage.description',
    templatePath: require('@/assets/workflows/basic.json'),
    thumbnailPath: require('@/assets/workflows/basic.png'),
  },
  {
    id: '2',
    titleKey: 'workflow.addModal.presets.textToImageLora.title',
    descriptionKey: 'workflow.addModal.presets.textToImageLora.description',
    templatePath: require('@/assets/workflows/basic-lora.json'),
    thumbnailPath: require('@/assets/workflows/basic-lora.png'),
  },
  {
    id: '3',
    titleKey: 'workflow.addModal.presets.textToImageFluxDev.title',
    descriptionKey: 'workflow.addModal.presets.textToImageFluxDev.description',
    templatePath: require('@/assets/workflows/flux-dev.json'),
    thumbnailPath: require('@/assets/workflows/flux-dev.png'),
  },
];

interface AddWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
}

export const AddWorkflowModal = ({ isOpen, onClose, serverId }: AddWorkflowModalProps) => {
  const [selectedPreset, setSelectedPreset] = useState<WorkflowPreset | null>(null);
  const [name, setName] = useState('');
  const [customThumbnail, setCustomThumbnail] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const addWorkflow = useWorkflowStore((state) => state.addWorkflow);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (name.trim().length > 50) {
      setName(name.slice(0, 50));
      showToast.error(t('workflow.nameTooLong', { count: 50 }), undefined, insets.top + 8);
    }
  }, [name, t]);

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
          setCustomThumbnail(localImageUri);
          setSelectedPreset(null);
        }
      } catch (error) {
        console.error('Failed to save thumbnail:', error);
        alert(t('workflow.saveImageFailed'));
      }
    }
  };

  const handleAddWorkflow = async () => {
    if (!name.trim()) {
      setError(t('workflow.nameRequired'));
      return;
    }

    if (!selectedPreset) {
      setError(t('workflow.addModal.selectPresetRequired'));
      return;
    }

    let finalThumbnail = customThumbnail;
    if (!customThumbnail && selectedPreset) {
      try {
        // Load the static asset
        const asset = Asset.fromModule(selectedPreset.thumbnailPath);
        await asset.downloadAsync();

        if (asset.localUri) {
          // Save the preset thumbnail
          const tempId = await generateUUID();
          const savedImage = await saveWorkflowThumbnail({
            serverId,
            workflowId: tempId,
            imageUri: asset.localUri,
            mimeType: 'image/png',
          });

          if (savedImage) {
            finalThumbnail = savedImage.path.startsWith('file://') ? savedImage.path : `file://${savedImage.path}`;
          }
        }
      } catch (error) {
        console.error('Failed to save preset thumbnail:', error);
      }
    }

    // Parse the template data
    const templateData = parseWorkflowTemplate(selectedPreset.templatePath);

    addWorkflow({
      name: name.trim(),
      serverId,
      thumbnail: finalThumbnail || undefined,
      data: templateData,
      lastUsed: new Date(),
      addMethod: 'preset',
    });

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setCustomThumbnail('');
    setError('');
    setSelectedPreset(null);
    onClose();
  };

  return (
    <KeyboardModal isOpen={isOpen} onClose={handleClose}>
      <KeyboardModal.Header>
        <Text className="text-lg font-semibold text-primary-500">{t('workflow.addModal.title')}</Text>
      </KeyboardModal.Header>

      <KeyboardModal.Body scrollEnabled={false}>
        <VStack space="md">
          {/* Fixed sections */}
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

            <KeyboardModal.Item title={t('workflow.thumbnailOptional')}>
              <Pressable onPress={handleSelectImage} className="overflow-hidden rounded-md border-0 bg-background-0">
                {customThumbnail ? (
                  <Image
                    source={{ uri: customThumbnail }}
                    className="h-40 w-full"
                    resizeMode="cover"
                    alt={t('workflow.thumbnailAlt')}
                  />
                ) : selectedPreset ? (
                  <Image
                    source={selectedPreset.thumbnailPath}
                    className="h-40 w-full"
                    resizeMode="cover"
                    alt={t('workflow.presetThumbnailAlt', { name: t(selectedPreset.titleKey) })}
                  />
                ) : (
                  <VStack className="h-32 items-center justify-center">
                    <ImagePlus className="text-primary-300" />
                    <Text className="mt-2 text-sm text-primary-300">{t('workflow.addThumbnail')}</Text>
                  </VStack>
                )}
              </Pressable>
            </KeyboardModal.Item>
          </VStack>

          {/* Scrollable section */}
          <KeyboardModal.Item title={t('workflow.addModal.selectPreset')}>
            <ScrollView className="h-40">
              <Accordion type="single" className="w-full space-y-2 bg-background-200 shadow-none">
                {WORKFLOW_PRESETS.map((preset) => (
                  <AccordionItem
                    key={preset.id}
                    value={preset.id}
                    className={`overflow-hidden rounded-lg shadow-none ${selectedPreset?.id === preset.id ? 'bg-background-100' : 'bg-background-200'
                      }`}
                  >
                    <AccordionHeader className="rounded-lg p-0">
                      <AccordionTrigger
                        className="w-full p-0 py-2 hover:bg-transparent active:bg-transparent"
                        onPress={() => {
                          const newPreset = selectedPreset?.id === preset.id ? null : preset;
                          setSelectedPreset(newPreset);
                          setCustomThumbnail('');
                          if (newPreset) {
                            setName(t(newPreset.titleKey));
                            setError('');
                          } else {
                            setName('');
                          }
                        }}
                      >
                        <HStack className="w-full flex-row items-center justify-between">
                          <HStack space="sm" className="flex-row items-center justify-start">
                            <Icon as={Scroll} size="sm" className="text-typography-900" />
                            <Text
                              className={`text-xs font-medium ${selectedPreset?.id === preset.id ? 'text-typography-900' : 'text-typography-700'
                                }`}
                            >
                              {t(preset.titleKey)}
                            </Text>
                          </HStack>
                          {selectedPreset?.id === preset.id ? (
                            <Icon as={CircleCheck} size="sm" className="text-success-500" />
                          ) : (
                            <Icon as={Circle} size="sm" className="text-typography-700" />
                          )}
                        </HStack>
                      </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent className="bg-background-200">
                      <VStack space="sm" className="px-0 py-3">
                        <Text className="text-xs text-typography-600">{t(preset.descriptionKey)}</Text>
                      </VStack>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollView>
          </KeyboardModal.Item>
        </VStack>
      </KeyboardModal.Body>

      <KeyboardModal.Footer>
        <HStack space="sm">
          <Button
            variant="outline"
            onPress={handleClose}
            className="flex-1 rounded-md border-primary-200 bg-background-0"
          >
            <ButtonText className="text-primary-500">{t('common.action.cancel')}</ButtonText>
          </Button>
          <Button
            variant="solid"
            onPress={handleAddWorkflow}
            isDisabled={!selectedPreset || !name.trim()}
            className={`flex-1 rounded-md ${!selectedPreset || !name.trim() ? 'bg-primary-200' : 'bg-primary-500'}`}
          >
            <ButtonText className="text-background-0">{t('workflow.addButton')}</ButtonText>
          </Button>
        </HStack>
      </KeyboardModal.Footer>
    </KeyboardModal>
  );
};
