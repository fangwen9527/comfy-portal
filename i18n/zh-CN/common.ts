import type { CommonStrings } from '../en/common';

const common: CommonStrings = {
  action: {
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    retry: '重试',
    done: '完成',
  },
  nav: {
    server: '服务器',
    servers: '服务器',
    setting: '设置',
    settings: '设置',
  },
  webview: {
    slowLoadingTitle: '网络较慢',
    slowLoadingDescription: '你可以继续等待，或在浏览器中打开此页面。',
    loadFailedTitle: '页面加载失败',
    checkNetwork: '请检查网络连接后重试。',
    openInBrowser: '在浏览器中打开',
    pleaseWait: '请稍候。',
  },
  selector: {
    selectModel: '选择模型',
    chooseModel: '选择一个模型',
    notInstalled: '服务器上未安装',
    notInSyncedList: '来自工作流 · 不在已同步列表中',
    selectType: '选择 {type}',
    searchType: '搜索 {type}…',
    modelStrength: '模型强度',
    clipStrength: 'Clip 强度',
    removeLora: '移除 LoRA',
    selectOption: '选择选项',
    selectSampler: '选择采样器',
    selectScheduler: '选择调度器',
  },
  tabToggle: {
    switchToNodes: '切换到节点',
    switchToAssistant: '切换到 AI 助手',
  },
  quickAction: {
    noActions: '尚未配置快捷操作',
    noActionsHint: '请先在 Load Image 节点中创建一个',
    targetMissing: '快捷操作的目标已不存在',
    targetMissingHint: '请在 Load Image 节点中重新配置',
  },
  validation: {
    hostRequired: '请填写主机地址',
    hostInvalid: '主机地址或 IP 无效',
    ipInvalid: 'IP 地址无效',
    portRequired: '请填写端口',
    portNumber: '端口必须是数字',
    portRange: '端口必须在 {min} 到 {max} 之间',
  },
  error: {
    serverNotFound: '找不到服务器',
    listWorkflowsHttp: '获取工作流列表失败：{status} {detail}',
    invalidMediaUrl: '媒体 URL 无效',
    listWorkflowsFailed: '获取工作流列表失败：服务器返回错误',
    workflowDataMissing: '响应中缺少转换后的工作流数据',
    queueFailed: '获取队列失败',
    historyFailed: '获取历史记录失败',
    generationTimedOut: '生成超时（10 分钟无响应）',
    generationInterrupted: '生成已中断',
    wsNotConnected: 'WebSocket 未连接',
    unknown: '未知错误',
  },
};

export default common;
