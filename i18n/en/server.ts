const server = {
  addTitle: 'Add Server',
  editTitle: 'Edit Server',
  nameLabel: 'Name',
  namePlaceholder: 'Server name',
  nameRequired: 'Name is required',
  nameTooLong: 'Name must be less than {count} characters',
  hostLabel: 'Host',
  hostPlaceholder: 'Host or IP address',
  portLabel: 'Port',
  portPlaceholder: 'Port number',
  tokenLabel: 'Authorization Token (Optional)',
  tokenPlaceholder: "Enter token (without 'Bearer')",
  useSSLLabel: 'Use SSL',
  sslAuto: 'Auto',
  sslAlways: 'Always',
  sslNever: 'Never',
  addButton: 'Add',
  edit: 'Edit',
  deleteTitle: 'Delete Server',
  deleteDescription: 'Are you sure you want to delete this server? This action cannot be undone.',
  offline: 'Offline',
  modelCount: '{count} models',
  noModels: 'No models',
};

export type ServerStrings = typeof server;
export default server;
