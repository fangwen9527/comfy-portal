import { OptionSelector } from '@/components/common/selectors/option-selector';
import { NumberSlider } from '@/components/self-ui/slider';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import BaseNode from '../../common/base-node';
import SubItem from '../../common/sub-item';

interface ImageScaleByProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function ImageScaleBy({ node, workflowId }: ImageScaleByProps) {
  const { t } = useTranslation();
  const updateNodeInput = useWorkflowStore((state) => state.updateNodeInput);

  const upscaleMethods = [
    { label: 'nearest-exact', value: 'nearest-exact' },
    { label: 'bilinear', value: 'bilinear' },
    { label: 'area', value: 'area' },
    { label: 'bicubic', value: 'bicubic' },
    { label: 'lanczos', value: 'lanczos' },
  ];

  return (
    <BaseNode node={node}>
      <SubItem title={t('nodes.fields.upscaleMethod')}>
        <OptionSelector
          value={node.inputs.upscale_method}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'upscale_method', value)}
          options={upscaleMethods}
          title={t('nodes.selectors.upscaleMethod')}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.scaleBy')}>
        <NumberSlider
          value={node.inputs.scale_by}
          minValue={0.1}
          maxValue={8}
          step={0.05}
          onChangeEnd={(value) => updateNodeInput(workflowId, node.id, 'scale_by', Number(value))}
          space={12}
          decimalPlaces={2}
        />
      </SubItem>
    </BaseNode>
  );
}
