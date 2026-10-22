import { NumberInput } from '@/components/self-ui/number-input';
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
import BaseNode from '../../common/base-node';
import SubItem from '../../common/sub-item';

interface CLIPTextEncodeSDXLNodeProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function CLIPTextEncodeSDXL({ node, serverId, workflowId }: CLIPTextEncodeSDXLNodeProps) {
  const { t } = useTranslation();
  const updateNodeInput = useWorkflowStore((state) => state.updateNodeInput);
  const promptEditorRef = useRef<PromptEditorModalRef>(null);

  const handleOpenEditor = useCallback(
    (field: 'text_g' | 'text_l', title: string) => {
      promptEditorRef.current?.present({
        initialValue: node.inputs?.[field] || '',
        onSave: (value) => updateNodeInput(workflowId, node.id, field, value),
        title,
      });
    },
    [node.inputs, workflowId, node.id, updateNodeInput],
  );

  return (
    <BaseNode node={node}>
      <SubItem title={t('nodes.fields.width')} node={node} dependencies={['width']}>
        <NumberInput
          value={node.inputs.width}
          onChange={(value) => {
            updateNodeInput(workflowId, node.id, 'width', value);
          }}
          minValue={0}
          maxValue={10000}
          step={1}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.height')} node={node} dependencies={['height']}>
        <NumberInput
          value={node.inputs.height}
          onChange={(value) => {
            updateNodeInput(workflowId, node.id, 'height', value);
          }}
          minValue={0}
          maxValue={10000}
          step={1}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.cropWidth')} node={node} dependencies={['crop_w']}>
        <NumberInput
          value={node.inputs.crop_w}
          onChange={(value) => {
            updateNodeInput(workflowId, node.id, 'crop_w', value);
          }}
          minValue={0}
          maxValue={10000}
          step={1}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.cropHeight')} node={node} dependencies={['crop_h']}>
        <NumberInput
          value={node.inputs.crop_h}
          onChange={(value) => {
            updateNodeInput(workflowId, node.id, 'crop_h', value);
          }}
          minValue={0}
          maxValue={10000}
          step={1}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.targetWidth')} node={node} dependencies={['target_width']}>
        <NumberInput
          value={node.inputs.target_width}
          onChange={(value) => {
            updateNodeInput(workflowId, node.id, 'target_width', value);
          }}
          minValue={0}
          maxValue={10000}
          step={1}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.targetHeight')} node={node} dependencies={['target_height']}>
        <NumberInput
          value={node.inputs.target_height}
          onChange={(value) => {
            updateNodeInput(workflowId, node.id, 'target_height', value);
          }}
          minValue={0}
          maxValue={10000}
          step={1}
        />
      </SubItem>
      <SubItem
        title={t('nodes.fields.textG')}
        node={node}
        dependencies={['text_g']}
        rightComponent={
          <Pressable onPress={() => handleOpenEditor('text_g', t('nodes.clipTextEncodeSdxl.promptG'))} className="p-1">
            <Icon as={Maximize2} size="sm" className="text-typography-500" />
          </Pressable>
        }
      >
        <Textarea size="md" className="flex-1 rounded-lg border-0 bg-background-50">
          <TextareaInput
            value={node.inputs?.text_g || ''}
            onChangeText={(text) => updateNodeInput(workflowId, node.id, 'text_g', text)}
            size="sm"
            placeholder={t('nodes.clipTextEncodeSdxl.placeholder')}
          />
        </Textarea>
      </SubItem>
      <SubItem
        title={t('nodes.fields.textL')}
        node={node}
        dependencies={['text_l']}
        rightComponent={
          <Pressable onPress={() => handleOpenEditor('text_l', t('nodes.clipTextEncodeSdxl.promptL'))} className="p-1">
            <Icon as={Maximize2} size="sm" className="text-typography-500" />
          </Pressable>
        }
      >
        <Textarea size="md" className="flex-1 rounded-lg border-0 bg-background-50">
          <TextareaInput
            value={node.inputs?.text_l || ''}
            onChangeText={(text) => updateNodeInput(workflowId, node.id, 'text_l', text)}
            size="sm"
            placeholder={t('nodes.clipTextEncodeSdxl.placeholder')}
          />
        </Textarea>
      </SubItem>
      <PromptEditorModal ref={promptEditorRef} />
    </BaseNode>
  );
}
