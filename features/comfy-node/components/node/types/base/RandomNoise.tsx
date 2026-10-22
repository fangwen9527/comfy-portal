import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import BaseNode from '../../common/base-node';
import SeedControl from '../../common/seed-control';

interface RandomNoiseProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function RandomNoise({ node, workflowId }: RandomNoiseProps) {
  const { t } = useTranslation();

  return (
    <BaseNode node={node}>
      <SeedControl node={node} workflowId={workflowId} inputKey="noise_seed" title={t('nodes.seed.noiseTitle')} />
    </BaseNode>
  );
}
