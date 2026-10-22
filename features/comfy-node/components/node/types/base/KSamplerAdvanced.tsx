import { SamplerSelector } from '@/components/common/selectors/sampler';
import { SchedulerSelector } from '@/components/common/selectors/scheduler';
import { NumberInput } from '@/components/self-ui/number-input';
import { NumberSlider } from '@/components/self-ui/slider';
import Switch from '@/components/self-ui/switch';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import BaseNode from '../../common/base-node';
import SeedControl from '../../common/seed-control';
import SubItem from '../../common/sub-item';

interface KSamplerAdvancedProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function KSamplerAdvanced({ node, workflowId }: KSamplerAdvancedProps) {
  const { t } = useTranslation();
  const updateNodeInput = useWorkflowStore((state) => state.updateNodeInput);

  return (
    <BaseNode node={node}>
      <SubItem
        title={t('nodes.sampling.addNoise')}
        rightComponent={
          <Switch
            size="sm"
            value={node.inputs.add_noise === 'enable'}
            onValueChange={(value: boolean) => {
              updateNodeInput(workflowId, node.id, 'add_noise', value ? 'enable' : 'disable');
            }}
          />
        }
      />
      <SeedControl node={node} workflowId={workflowId} inputKey="noise_seed" title={t('nodes.seed.noiseTitle')} />
      <SubItem title={t('nodes.fields.steps')}>
        <NumberSlider
          value={node.inputs.steps}
          minValue={1}
          maxValue={100}
          step={1}
          onChangeEnd={(value) => updateNodeInput(workflowId, node.id, 'steps', Number(value))}
          space={12}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.cfg')}>
        <NumberSlider
          value={node.inputs.cfg}
          minValue={1}
          maxValue={30}
          step={0.5}
          onChangeEnd={(value) => updateNodeInput(workflowId, node.id, 'cfg', Number(value))}
          space={12}
          decimalPlaces={1}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.sampler')}>
        <SamplerSelector
          value={node.inputs.sampler_name}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'sampler_name', value)}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.scheduler')}>
        <SchedulerSelector
          value={node.inputs.scheduler}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'scheduler', value)}
        />
      </SubItem>
      <SubItem title={t('nodes.sampling.startAtStep')}>
        <NumberInput
          value={node.inputs.start_at_step}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'start_at_step', Number(value))}
          minValue={0}
          maxValue={100}
          step={1}
          decimalPlaces={0}
          buttonSize={24}
          space={12}
        />
      </SubItem>
      <SubItem title={t('nodes.sampling.endAtStep')}>
        <NumberInput
          value={node.inputs.end_at_step}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'end_at_step', Number(value))}
          minValue={0}
          maxValue={10000}
          step={1}
          decimalPlaces={0}
          buttonSize={24}
          space={12}
        />
      </SubItem>
      <SubItem
        title={t('nodes.sampling.returnLeftoverNoise')}
        rightComponent={
          <Switch
            size="sm"
            value={node.inputs.return_with_leftover_noise === 'enable'}
            onValueChange={(value: boolean) =>
              updateNodeInput(workflowId, node.id, 'return_with_leftover_noise', value ? 'enable' : 'disable')
            }
          />
        }
      />
    </BaseNode>
  );
}
