import { NumberSlider } from '@/components/self-ui/slider';
import { Input, InputField } from '@/components/ui/input';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import BaseNode from '../../common/base-node';
import SubItem from '../../common/sub-item';

interface WanImageToVideoProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function WanImageToVideo({ node, workflowId }: WanImageToVideoProps) {
  const { t } = useTranslation();
  const updateNodeInput = useWorkflowStore((state) => state.updateNodeInput);

  return (
    <BaseNode node={node}>
      <SubItem title={t('nodes.fields.width')}>
        <Input className="flex-1 rounded-md border-0 bg-background-50" variant="outline" size="sm">
          <InputField
            placeholder={t('nodes.fields.width')}
            keyboardType="numeric"
            value={typeof node.inputs.width === 'number' ? node.inputs.width.toString() : ''}
            onChangeText={(text) => updateNodeInput(workflowId, node.id, 'width', Number(text))}
          />
        </Input>
      </SubItem>
      <SubItem title={t('nodes.fields.height')}>
        <Input className="flex-1 rounded-md border-0 bg-background-50" variant="outline" size="sm">
          <InputField
            placeholder={t('nodes.fields.height')}
            keyboardType="numeric"
            value={typeof node.inputs.height === 'number' ? node.inputs.height.toString() : ''}
            onChangeText={(text) => updateNodeInput(workflowId, node.id, 'height', Number(text))}
          />
        </Input>
      </SubItem>
      <SubItem title={t('nodes.fields.length')}>
        <Input className="flex-1 rounded-md border-0 bg-background-50" variant="outline" size="sm">
          <InputField
            placeholder={t('nodes.fields.length')}
            keyboardType="numeric"
            value={typeof node.inputs.length === 'number' ? node.inputs.length.toString() : ''}
            onChangeText={(text) => updateNodeInput(workflowId, node.id, 'length', Number(text))}
          />
        </Input>
      </SubItem>
      <SubItem title={t('nodes.fields.batchSize')}>
        <NumberSlider
          value={node.inputs.batch_size || 1}
          minValue={1}
          maxValue={4}
          step={1}
          onChangeEnd={(value) => updateNodeInput(workflowId, node.id, 'batch_size', Number(value))}
          space={12}
        />
      </SubItem>
    </BaseNode>
  );
}
