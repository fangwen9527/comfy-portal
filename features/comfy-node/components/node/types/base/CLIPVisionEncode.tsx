import { SegmentedControl } from '@/components/self-ui/segmented-control';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import BaseNode from '../../common/base-node';
import SubItem from '../../common/sub-item';

interface CLIPVisionEncodeProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function CLIPVisionEncode({ node, workflowId }: CLIPVisionEncodeProps) {
  const { t } = useTranslation();
  const updateNodeInput = useWorkflowStore((state) => state.updateNodeInput);

  const cropOptions = [
    { value: 'none', label: t('nodes.crop.none') },
    { value: 'center', label: t('nodes.crop.center') },
  ];
  const selectedCrop = cropOptions.find((option) => option.value === node.inputs.crop);

  return (
    <BaseNode node={node}>
      <SubItem title={t('nodes.fields.crop')}>
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
