import { OptionSelector } from '@/components/common/selectors/option-selector';
import { NumberSlider } from '@/components/self-ui/slider';
import Switch from '@/components/self-ui/switch';
import { Input, InputField } from '@/components/ui/input';
import { useWorkflowStore } from '@/features/workflow/stores/workflow-store';
import { Node } from '@/features/workflow/types';
import { useTranslation } from '@/i18n';
import BaseNode from '../../common/base-node';
import SubItem from '../../common/sub-item';

interface VHS_VideoCombineProps {
  node: Node;
  serverId: string;
  workflowId: string;
}

export default function VHS_VideoCombine({ node, workflowId }: VHS_VideoCombineProps) {
  const { t } = useTranslation();
  const updateNodeInput = useWorkflowStore((state) => state.updateNodeInput);

  const formatOptions = [
    { label: 'video/h264-mp4', value: 'video/h264-mp4' },
    { label: 'video/h265-mp4', value: 'video/h265-mp4' },
    { label: 'video/ProRes', value: 'video/ProRes' },
    { label: 'video/av1-webm', value: 'video/av1-webm' },
    { label: 'video/ffmpeg-gif', value: 'video/ffmpeg-gif' },
    { label: 'image/gif', value: 'image/gif' },
    { label: 'image/webp', value: 'image/webp' },
    { label: 'video/8bit-png', value: 'video/8bit-png' },
    { label: 'video/16bit-png', value: 'video/16bit-png' },
    { label: 'video/ffv1-mkv', value: 'video/ffv1-mkv' },
    { label: 'video/nvenc_h264-mp4', value: 'video/nvenc_h264-mp4' },
    { label: 'video/webm', value: 'video/webm' },
    { label: 'video/nvenc_av1-mp4', value: 'video/nvenc_av1-mp4' },
    { label: 'video/nvenc_hevc-mp4', value: 'video/nvenc_hevc-mp4' },
  ];

  const pixFmtOptions = [
    { label: 'yuv420p', value: 'yuv420p' },
    { label: 'yuv420p10le', value: 'yuv420p10le' },
  ];

  return (
    <BaseNode node={node}>
      <SubItem title={t('nodes.fields.frameRate')}>
        <NumberSlider
          value={node.inputs.frame_rate}
          minValue={1}
          maxValue={120}
          step={1}
          onChangeEnd={(value) => updateNodeInput(workflowId, node.id, 'frame_rate', Number(value))}
          space={12}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.loopCount')}>
        <Input className="flex-1 rounded-md border-0 bg-background-50" variant="outline" size="sm">
          <InputField
            placeholder={t('nodes.fields.loopCount')}
            keyboardType="numeric"
            value={node.inputs.loop_count?.toString()}
            onChangeText={(text) => updateNodeInput(workflowId, node.id, 'loop_count', Number(text))}
          />
        </Input>
      </SubItem>
      <SubItem title={t('nodes.fields.filenamePrefix')}>
        <Input className="flex-1 rounded-md border-0 bg-background-50" variant="outline" size="sm">
          <InputField
            placeholder={t('nodes.fields.filenamePrefix')}
            value={node.inputs.filename_prefix}
            onChangeText={(text) => updateNodeInput(workflowId, node.id, 'filename_prefix', text)}
          />
        </Input>
      </SubItem>
      <SubItem title={t('nodes.fields.format')}>
        <OptionSelector
          value={node.inputs.format}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'format', value)}
          options={formatOptions}
          title={t('nodes.selectors.format')}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.pixelFormat')}>
        <OptionSelector
          value={node.inputs.pix_fmt}
          onChange={(value) => updateNodeInput(workflowId, node.id, 'pix_fmt', value)}
          options={pixFmtOptions}
          title={t('nodes.selectors.pixelFormat')}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.crf')}>
        <NumberSlider
          value={node.inputs.crf}
          minValue={0}
          maxValue={51}
          step={1}
          onChangeEnd={(value) => updateNodeInput(workflowId, node.id, 'crf', Number(value))}
          space={12}
        />
      </SubItem>
      <SubItem title={t('nodes.fields.saveOutput')} rightComponent={
        <Switch
          size="sm"
          value={node.inputs.save_output}
          onValueChange={(value) => updateNodeInput(workflowId, node.id, 'save_output', value)}
        />
      }>
      </SubItem>
      <SubItem title={t('nodes.fields.pingPong')} rightComponent={
        <Switch
          size="sm"
          value={node.inputs.pingpong}
          onValueChange={(value) => updateNodeInput(workflowId, node.id, 'pingpong', value)}
        />
      }>
      </SubItem>
      <SubItem title={t('nodes.fields.saveMetadata')} rightComponent={
        <Switch
          size="sm"
          value={node.inputs.save_metadata}
          onValueChange={(value) => updateNodeInput(workflowId, node.id, 'save_metadata', value)}
        />
      }>
      </SubItem>
      <SubItem title={t('nodes.fields.trimToAudio')} rightComponent={
        <Switch
          size="sm"
          value={node.inputs.trim_to_audio}
          onValueChange={(value) => updateNodeInput(workflowId, node.id, 'trim_to_audio', value)}
        />
      }>
      </SubItem>
    </BaseNode>
  );
}
