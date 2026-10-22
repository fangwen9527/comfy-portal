import type { ServerStrings } from '../en/server';

const server: ServerStrings = {
  addTitle: '添加服务器',
  editTitle: '编辑服务器',
  nameLabel: '名称',
  namePlaceholder: '服务器名称',
  nameRequired: '请输入名称',
  nameTooLong: '名称不能超过 {count} 个字符',
  hostLabel: '主机',
  hostPlaceholder: '主机名或 IP 地址',
  portLabel: '端口',
  portPlaceholder: '端口号',
  tokenLabel: '授权 Token（可选）',
  tokenPlaceholder: "输入 Token（不含 'Bearer'）",
  useSSLLabel: '使用 SSL',
  sslAuto: '自动',
  sslAlways: '始终',
  sslNever: '从不',
  addButton: '添加',
  edit: '编辑',
  deleteTitle: '删除服务器',
  deleteDescription: '确定要删除该服务器吗？此操作无法撤销。',
  offline: '离线',
  modelCount: '{count} 个模型',
  noModels: '无模型',
};

export default server;
