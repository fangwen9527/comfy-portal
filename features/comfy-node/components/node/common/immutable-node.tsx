import { Text } from '@/components/ui/text';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import BaseNode from './base-node';

interface ImmutableNodeProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function ImmutableNode({ node, serverId, workflowId }: ImmutableNodeProps) {
  const { t } = useTranslation();

  return (
    <BaseNode node={node}>
      <Text size="sm" className="text-typography-500">
        {t('nodes.common.immutableNode')}
      </Text>
    </BaseNode>
  );
}
