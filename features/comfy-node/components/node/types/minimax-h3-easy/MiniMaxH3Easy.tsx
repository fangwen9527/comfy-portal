import { OptionSelector } from '@/components/common/selectors/option-selector';
import { NumberInput } from '@/components/self-ui/number-input';
import { NumberSlider } from '@/components/self-ui/slider';
import Switch from '@/components/self-ui/switch';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import {
  PromptEditorModal,
  PromptEditorModalRef,
} from '@/features/ai-assistant/components/prompt-editor-modal';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import { Maximize2 } from 'lucide-react-native';
import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import BaseNode from '../../common/base-node';
import SubItem from '../../common/sub-item';
import {
  ASPECT_RATIO_OPTIONS,
  DIMENSION_MAX,
  DIMENSION_MIN,
  DIMENSION_STEP,
  FPS_MAX,
  FPS_MIN,
  KEYFRAME_ROLE_OPTIONS,
  MODE_OPTIONS,
  type Option,
  REFERENCE_MENTION_OPTIONS,
  REF_IMAGE_SIZE_OPTIONS,
  RESOLUTION_OPTIONS,
  SCENE_GUIDE_OPTIONS,
  SECONDS_MAX,
  SECONDS_MIN,
  withCurrentValue,
} from './constants';

interface MiniMaxH3EasyProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

/**
 * The extension's main node. Media inputs are wired as links on desktop and
 * aren't editable here; everything else is exposed.
 *
 * Mirrors the extension's own UI in two places: the `advanced` toggle gates
 * the same four fields, and width/height only appear for the `custom`
 * resolution (other presets derive dimensions from the aspect ratio).
 */
export default function MiniMaxH3Easy({ node, workflowId }: MiniMaxH3EasyProps) {
  const { t } = useTranslation();
  const updateNodeInput = useWorkflowStore((state) => state.updateNodeInput);
  const promptEditorRef = useRef<PromptEditorModalRef>(null);

  /** The option tables carry i18n keys so they stay locale-free. */
  const localizedOptions = (options: Option[], value: unknown) =>
    withCurrentValue(options, value).map((option) => ({
      value: option.value,
      label: option.labelKey ? t(option.labelKey) : option.value,
      description: option.descriptionKey ? t(option.descriptionKey) : undefined,
    }));

  const setInput = useCallback(
    (key: string, value: unknown) => updateNodeInput(workflowId, node.id, key, value),
    [updateNodeInput, workflowId, node.id],
  );

  const handleOpenEditor = useCallback(() => {
    promptEditorRef.current?.present({
      initialValue: node.inputs?.prompt || '',
      onSave: (value) => setInput('prompt', value),
      title: t('nodes.common.editPrompt'),
    });
  }, [node.inputs?.prompt, setInput, t]);

  const isAdvanced = node.inputs.advanced === true;
  const isCustomResolution = node.inputs.resolution === 'custom';
  const isReferenceMode = node.inputs.mode === 'reference';

  return (
    <BaseNode node={node}>
      <SubItem title={t('nodes.minimax.mode')} node={node} dependencies={['mode']}>
        <OptionSelector
          value={node.inputs.mode ?? 'image'}
          onChange={(value) => setInput('mode', value)}
          options={localizedOptions(MODE_OPTIONS, node.inputs.mode)}
          title={t('nodes.minimax.mode')}
        />
      </SubItem>

      <SubItem
        title={t('nodes.fields.prompt')}
        rightComponent={
          <View className="flex-row items-center gap-2">
            <Pressable onPress={handleOpenEditor} className="p-1">
              <Icon as={Maximize2} size="sm" className="text-typography-500" />
            </Pressable>
          </View>
        }
        node={node}
        dependencies={['prompt']}
      >
        <Textarea
          size="sm"
          isReadOnly={false}
          isInvalid={false}
          isDisabled={false}
          className="w-full rounded-md border-0 bg-background-50"
        >
          <TextareaInput
            placeholder={t('nodes.minimax.promptPlaceholder')}
            value={node.inputs?.prompt || ''}
            onChangeText={(text) => setInput('prompt', text)}
            className="text-sm"
          />
        </Textarea>
      </SubItem>

      <SubItem title={t('nodes.fields.resolution')} node={node} dependencies={['resolution']}>
        <OptionSelector
          value={node.inputs.resolution ?? '480P'}
          onChange={(value) => setInput('resolution', value)}
          options={localizedOptions(RESOLUTION_OPTIONS, node.inputs.resolution)}
          title={t('nodes.fields.resolution')}
        />
      </SubItem>

      {!isCustomResolution && (
        <SubItem title={t('nodes.minimax.aspectRatio')} node={node} dependencies={['aspect_ratio']}>
          <OptionSelector
            value={node.inputs.aspect_ratio ?? '16:9'}
            onChange={(value) => setInput('aspect_ratio', value)}
            options={localizedOptions(ASPECT_RATIO_OPTIONS, node.inputs.aspect_ratio)}
            title={t('nodes.minimax.aspectRatio')}
          />
        </SubItem>
      )}

      {isCustomResolution && (
        <>
          <SubItem title={t('nodes.fields.width')} node={node} dependencies={['width']}>
            <NumberInput
              value={node.inputs.width}
              onChange={(value) => setInput('width', Number(value))}
              minValue={DIMENSION_MIN}
              maxValue={DIMENSION_MAX}
              step={DIMENSION_STEP}
              decimalPlaces={0}
              buttonSize={24}
              space={12}
            />
          </SubItem>
          <SubItem title={t('nodes.fields.height')} node={node} dependencies={['height']}>
            <NumberInput
              value={node.inputs.height}
              onChange={(value) => setInput('height', Number(value))}
              minValue={DIMENSION_MIN}
              maxValue={DIMENSION_MAX}
              step={DIMENSION_STEP}
              decimalPlaces={0}
              buttonSize={24}
              space={12}
            />
          </SubItem>
        </>
      )}

      <SubItem title={t('nodes.minimax.duration')} node={node} dependencies={['seconds']}>
        <NumberSlider
          value={node.inputs.seconds}
          minValue={SECONDS_MIN}
          maxValue={SECONDS_MAX}
          step={0.1}
          onChangeEnd={(value) => setInput('seconds', Number(value))}
          space={12}
          decimalPlaces={1}
        />
      </SubItem>

      <SubItem title={t('nodes.minimax.sceneGuide')} node={node} dependencies={['prompt_optimizer_scene_guide']}>
        <OptionSelector
          value={node.inputs.prompt_optimizer_scene_guide ?? 'none'}
          onChange={(value) => setInput('prompt_optimizer_scene_guide', value)}
          options={localizedOptions(SCENE_GUIDE_OPTIONS, node.inputs.prompt_optimizer_scene_guide)}
          title={t('nodes.minimax.sceneGuide')}
        />
      </SubItem>

      <SubItem
        title={t('nodes.minimax.promptOptimizer')}
        rightComponent={
          <Switch
            size="sm"
            value={node.inputs.prompt_optimizer_settings === true}
            onValueChange={(value: boolean) => setInput('prompt_optimizer_settings', value)}
          />
        }
      />

      <SubItem
        title={t('nodes.minimax.advanced')}
        rightComponent={
          <Switch
            size="sm"
            value={isAdvanced}
            onValueChange={(value: boolean) => setInput('advanced', value)}
          />
        }
      />

      {isAdvanced && (
        <>
          <SubItem title={t('nodes.minimax.fps')} node={node} dependencies={['fps']}>
            <NumberSlider
              value={node.inputs.fps}
              minValue={FPS_MIN}
              maxValue={FPS_MAX}
              step={1}
              onChangeEnd={(value) => setInput('fps', Number(value))}
              space={12}
              decimalPlaces={0}
            />
          </SubItem>

          {!isReferenceMode && (
            <SubItem title={t('nodes.minimax.singleImageIs')} node={node} dependencies={['keyframe_role']}>
              <OptionSelector
                value={node.inputs.keyframe_role ?? 'first'}
                onChange={(value) => setInput('keyframe_role', value)}
                options={localizedOptions(KEYFRAME_ROLE_OPTIONS, node.inputs.keyframe_role)}
                title={t('nodes.minimax.singleImageIs')}
              />
            </SubItem>
          )}

          {isReferenceMode && (
            <>
              <SubItem title={t('nodes.minimax.referenceImageSize')} node={node} dependencies={['ref_image_size']}>
                <OptionSelector
                  value={node.inputs.ref_image_size ?? '1k'}
                  onChange={(value) => setInput('ref_image_size', value)}
                  options={localizedOptions(REF_IMAGE_SIZE_OPTIONS, node.inputs.ref_image_size)}
                  title={t('nodes.minimax.referenceImageSize')}
                />
              </SubItem>
              <SubItem title={t('nodes.minimax.mentionMedia')} node={node} dependencies={['reference_mention_mode']}>
                <OptionSelector
                  value={node.inputs.reference_mention_mode ?? 'index'}
                  onChange={(value) => setInput('reference_mention_mode', value)}
                  options={localizedOptions(REFERENCE_MENTION_OPTIONS, node.inputs.reference_mention_mode)}
                  title={t('nodes.minimax.mentionMedia')}
                />
              </SubItem>
            </>
          )}
        </>
      )}

      <PromptEditorModal ref={promptEditorRef} />
    </BaseNode>
  );
}
