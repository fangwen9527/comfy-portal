import type { GenerationStrings } from '../en/generation';

const generation: GenerationStrings = {
  action: {
    generate: '生成',
    saving: '保存中…',
    select: '选择',
    selectAll: '全选',
    deselectAll: '取消全选',
    share: '分享',
    deleteSelected: '删除所选',
  },
  selection: {
    count: '已选择 {count} 项',
  },
  status: {
    ready: '就绪',
    generating: '生成中',
    generatingPercent: '生成中… {percent}%',
    downloading: '下载中 {percent}%',
  },
  media: {
    image: '图片',
    video: '视频',
    saveMedia: '保存媒体',
    setAsThumbnail: '设为工作流缩略图',
  },
  preview: {
    emptyTitle: '暂无媒体',
    emptyDescription: '生成图片后即可在这里预览结果。',
    longPressHint: '长按打开菜单',
    mediaAlt: '生成的媒体',
  },
  history: {
    title: '历史记录',
    deleteTitle: '删除媒体',
    deleteSelectedTitle: '删除所选媒体',
    deleteDescription: '确定要删除这一项吗？此操作无法撤销。',
    deleteSelectedDescription: '确定要删除 {count} 项吗？此操作无法撤销。',
  },
  queue: {
    title: '队列',
    clearAll: '全部清除',
    empty: '队列为空',
    running: '运行中',
    pending: '等待中',
  },
  toast: {
    deleteFailed: { title: '删除失败', message: '删除媒体失败' },
    saveFailed: { title: '保存失败', message: '部分媒体保存失败' },
    saved: {
      title: '已保存',
      toGallery: '已将 {count} 项保存到相册',
      toPhotos: '已将 {count} 项保存到相册',
      toPhotosOne: '已将 1 项保存到相册',
    },
    permissionRequired: { title: '需要权限', message: '请允许访问以保存媒体' },
    permissionNeeded: { title: '需要权限', message: '请授予保存媒体的权限。' },
    sharingUnavailable: { title: '无法分享', message: '当前设备不支持分享' },
    sharingNotAvailable: { title: '无法分享', message: '当前设备不支持分享' },
    sharingFirstItem: { title: '仅分享第一项', message: '不支持分享多个项目' },
    mediaSaved: '媒体已保存到相册',
    mediaSaveFailed: '保存媒体失败',
    thumbnailUpdated: '缩略图已更新',
    thumbnailFailed: '设置缩略图失败',
    downloadStarted: '已开始下载媒体',
    downloadFailed: '下载媒体失败',
    serverNotFound: { title: '出错了', message: '找不到服务器' },
    generationFailed: '生成失败',
    noMediaGenerated: '没有生成任何媒体。',
    unexpectedError: '发生了未知错误。',
    generationLost: { title: '生成已丢失', message: '服务器上已找不到这次生成。' },
    serverGenerationFailed: '服务器端生成失败。',
    unknownError: '未知错误',
  },
};

export default generation;
