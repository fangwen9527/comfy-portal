import type { AssistantStrings } from '../en/assistant';

const assistant: AssistantStrings = {
  chat: {
    inputPlaceholder: '让 AI 帮你调整参数…',
    emptyTitle: '我能帮你做什么？',
    emptyDescription: '我可以帮你调整提示词、微调参数，\n或优化工作流。',
    thinking: '思考中…',
    checkConfig: '检查 AI 配置',
  },
  notConfigured: {
    title: 'AI 未配置',
    description: '配置 API 服务商后即可使用 AI 助手。',
    openSettings: '打开设置',
  },
  tool: {
    readWorkflow: '正在读取工作流',
    updatingParameter: '正在更新参数',
    updatingParameters: '正在更新多个参数',
    generating: '正在生成',
    undoing: '正在撤销',
  },
  promptEditor: {
    title: '编辑提示词',
    promptLabel: '提示词',
    promptPlaceholder: '在这里输入提示词…',
    tagsLabel: '标签',
    noTags: '还没有标签，在下方添加一个。',
    stronger: '增强',
    weaker: '减弱',
    editTagPlaceholder: '编辑标签',
    addTagPlaceholder: '添加标签',
    add: '添加',
    modeText: '文本',
    modeTag: '标签',
  },
  catalogFetchFailed: 'models.dev 返回 HTTP {status}',
};

export default assistant;
