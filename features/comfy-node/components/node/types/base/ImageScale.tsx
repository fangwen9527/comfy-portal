import { OptionSelector } from '@/components/common/selectors/option-selector';
import { NumberInput } from '@/components/self-ui/number-input';
import { SegmentedControl } from '@/components/self-ui/segmented-control';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import BaseNode from '../../common/base-node';
import SubItem from '../../common/sub-item';

interface ImageScaleNodeProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

const upscaleMethods = [
  { value: 'nearest-exact', label: 'nearest-exact' },
  { value: 'bilinear', label: 'bilinear' },
  { value: 'area', label: 'area' },
  { value: 'bicubic', label: 'bicubic' },
  { value: 'lanczos', label: 'lanczos' },
];

export default function ImageScale({ node, serverId, workflowId }: ImageScaleNodeProps) {
  const { t } = useTranslation();
  const updateNodeInput = useWorkflowStore((state) => state.updateNodeInput);

  const cropOptions = [
    { value: 'disabled', label: t('nodes.crop.disabled') },
    { value: 'center', label: t('nodes.crop.center') },
  ];
  const selectedCrop = cropOptions.find((option) => option.value === node.inputs.crop);

  return (
    <BaseNode node={node}>
      <SubItem title={t('nodes.fields.upscaleMethod')} node={node} dependencies={['upscale_method']}>
        <OptionSelector
          options={upscaleMethods}
          value={node.inputs.upscale_method}
          onChange={(value) => {
            updateNodeInput(workflowId, node.id, 'upscale_method', value);
          }}
        />
      </SubItem>
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
      <SubItem title={t('nodes.fields.crop')} node={node} dependencies={['crop']}>
        <SegmentedControl
          options={cropOptions.map((option) => option.label)}
          value={selectedCrop?.label ?? ''}
          onChange={(label) => {
            const next = cropOptions.find((option) => option.label === label);
            if (next) {
              updateNodeInput(workflowId, node.id, 'crop', next.value);
            }
          }}
        />
      </SubItem>
    </BaseNode>
  );
}
