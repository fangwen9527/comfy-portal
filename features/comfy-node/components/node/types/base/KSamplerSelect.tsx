import { SamplerSelector } from '@/components/common/selectors/sampler';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import BaseNode from '../../common/base-node';
import SubItem from '../../common/sub-item';

interface KSamplerSelectProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function KSamplerSelect({ node, serverId, workflowId }: KSamplerSelectProps) {
  const { t } = useTranslation();
  const updateNodeInput = useWorkflowStore((state) => state.updateNodeInput);
  return (
    <BaseNode node={node}>
      <SubItem title={t('nodes.fields.sampler')}>
        <SamplerSelector
          value={node.inputs.sampler_name}
          onChange={(value) => {
            updateNodeInput(workflowId, node.id, 'sampler_name', value);
          }}
        />
      </SubItem>
    </BaseNode>
  );
}
