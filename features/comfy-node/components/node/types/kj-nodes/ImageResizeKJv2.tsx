import { OptionSelector } from '@/components/common/selectors/option-selector';
import { Input, InputField } from '@/components/ui/input';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import BaseNode from '../../common/base-node';
import SubItem from '../../common/sub-item';

interface ImageResizeKJv2Props {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function ImageResizeKJv2({ node, workflowId }: ImageResizeKJv2Props) {
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
      <SubItem title={t('nodes.fields.upscaleMethod')}>
        <OptionSelector
          value={node.inputs.upscale_method}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'upscale_method', value)}
          options={upscaleMethods}
          title={t('nodes.selectors.upscaleMethod')}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.keepProportion')}>
        <OptionSelector
          value={node.inputs.keep_proportion}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'keep_proportion', value)}
          options={[
            { label: 'stretch', value: 'stretch' },
            { label: 'resize', value: 'resize' },
            { label: 'pad', value: 'pad' },
            { label: 'pad_edge', value: 'pad_edge' },
            { label: 'pad_edge_pixel', value: 'pad_edge_pixel' },
            { label: 'crop', value: 'crop' },
            { label: 'pillarbox_blur', value: 'pillarbox_blur' },
            { label: 'total_pixels', value: 'total_pixels' },
          ]}
          title={t('nodes.selectors.keepProportion')}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.divisibleBy')}>
        <Input className="flex-1 rounded-md border-0 bg-background-50" variant="outline" size="sm">
          <InputField
            placeholder={t('nodes.fields.divisibleBy')}
            keyboardType="numeric"
            value={node.inputs.divisible_by?.toString()}
            onChangeText={(text) => updateNodeInput(workflowId, node.id, 'divisible_by', Number(text))}
          />
        </Input>
      </SubItem>
      <SubItem title={t('nodes.fields.cropPosition')}>
        <OptionSelector
          value={node.inputs.crop_position}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'crop_position', value)}
          options={[
            { label: 'center', value: 'center' },
            { label: 'top', value: 'top' },
            { label: 'bottom', value: 'bottom' },
            { label: 'left', value: 'left' },
            { label: 'right', value: 'right' },
          ]}
          title={t('nodes.selectors.cropPosition')}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.device')}>
        <OptionSelector
          value={node.inputs.device}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'device', value)}
          options={[
            { label: 'cpu', value: 'cpu' },
            { label: 'gpu', value: 'gpu' },
          ]}
          title={t('nodes.selectors.device')}
        />
      </SubItem>
    </BaseNode>
  );
}
