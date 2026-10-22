import type { WorkflowStrings } from '../en/workflow';

const workflow: WorkflowStrings = {
  nameLabel: '名称',
  namePlaceholder: '输入工作流名称',
  nameRequired: '请输入名称',
  nameTooLong: '名称不能超过 {count} 个字符',
  thumbnailOptional: '缩略图（可选）',
  addThumbnail: '添加缩略图',
  thumbnailAlt: '工作流缩略图',
  presetThumbnailAlt: '{name} 缩略图',
  photoPermission: '需要相册权限才能选择图片，请在系统设置中开启。',
  saveImageFailed: '图片保存失败，请重试。',
  addButton: '添加',
  saveChanges: '保存修改',
  lastUsed: '上次使用：{date}',
  never: '暂无',
  filePath: '路径：{path}',
  deleteTitle: '删除工作流',
  deleteDescription: '确定要删除该工作流吗？此操作无法撤销。',
  addModal: {
    title: '从预设添加工作流',
    selectPreset: '选择预设',
    selectPresetRequired: '请先选择一个预设工作流',
    presets: {
      textToImage: {
        title: '文生图',
        description: '使用 Stable Diffusion 模型，根据文本描述生成图像的基础工作流。',
      },
      textToImageLora: {
        title: '文生图（带 LoRA）',
        description: '使用带 LoRA 的 Stable Diffusion 模型，根据文本描述生成图像的基础工作流。',
      },
      textToImageFluxDev: {
        title: '文生图（Flux Dev）',
        description: '使用 Flux Dev 模型根据文本描述生成图像，需要准备 Flux VAE 和文本编码器模型。',
      },
    },
  },
  editModal: {
    title: '编辑工作流',
  },
  importModal: {
    title: '导入工作流',
    defaultName: '新工作流',
    whereToGet: '在哪里获取工作流文件？',
    clickToChange: '点击更换文件',
    clickToSelect: '点击选择工作流文件',
    supportsJson: '支持 JSON 格式',
    importFromClipboard: '从剪贴板导入',
    importedFromClipboard: '已从剪贴板导入',
    importFailed: '导入失败',
    invalidJsonFile: '请确认文件是合法的工作流 JSON。',
    noClipboardText: '剪贴板中没有文本内容。',
    clipboardEmpty: '剪贴板为空。',
    invalidClipboardJson: '请确认剪贴板中是合法的工作流 JSON。',
    importRequired: '请先导入工作流',
  },
};

export default workflow;
