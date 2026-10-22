import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import { Info } from 'lucide-react-native';
import { View } from 'react-native';
import BaseNode from '../../common/base-node';
import SubItem from '../../common/sub-item';
interface SaveImageProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function SaveImage({ node, serverId, workflowId }: SaveImageProps) {
  const { t } = useTranslation();
  const updateNodeInput = useWorkflowStore((state) => state.updateNodeInput);
  return (
    <BaseNode node={node}>
      <SubItem title={t('nodes.fields.filenamePrefix')}>
        <Input className="w-full rounded-lg border-0 bg-background-50">
          <InputField
            placeholder={t('nodes.saveImage.placeholder')}
            className="w-full border-0 bg-background-50 text-sm"
            value={node.inputs?.filename_prefix || ''}
            onChangeText={(value) => updateNodeInput(workflowId, node.id, 'filename_prefix', value)}
          />
        </Input>
        <View className="mt-2 flex-row items-start gap-2">
          <Icon as={Info} size="xs" className="mt-[1px] text-typography-500" />
          <Text size="sm" className="flex-1 text-xs text-typography-500">
            {t('nodes.saveImage.hint')}
          </Text>
        </View>
      </SubItem>
    </BaseNode>
  );
}
