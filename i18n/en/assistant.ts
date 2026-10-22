const assistant = {
  chat: {
    inputPlaceholder: 'Ask AI to adjust parameters...',
    emptyTitle: 'How can I help?',
    emptyDescription: 'Ask me to adjust prompts, tweak parameters,\nor optimize your workflow.',
    thinking: 'Thinking...',
    checkConfig: 'Check AI Configuration',
  },
  notConfigured: {
    title: 'AI Not Configured',
    description: 'Set up your API provider to use the AI Agent.',
    openSettings: 'Open Settings',
  },
  tool: {
    readWorkflow: 'Reading workflow',
    updatingParameter: 'Updating parameter',
    updatingParameters: 'Updating parameters',
    generating: 'Generating',
    undoing: 'Undoing',
  },
  promptEditor: {
    title: 'Edit Prompt',
    promptLabel: 'Prompt',
    promptPlaceholder: 'Enter your prompt here...',
    tagsLabel: 'Tags',
    noTags: 'No tags yet. Add one below.',
    stronger: 'Stronger',
    weaker: 'Weaker',
    editTagPlaceholder: 'Edit tag',
    addTagPlaceholder: 'Add a tag',
    add: 'Add',
    modeText: 'Text',
    modeTag: 'Tag',
  },
  catalogFetchFailed: 'models.dev returned HTTP {status}',
};

export type AssistantStrings = typeof assistant;
export default assistant;
