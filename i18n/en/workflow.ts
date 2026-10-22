const workflow = {
  nameLabel: 'Name',
  namePlaceholder: 'Enter workflow name',
  nameRequired: 'Name is required',
  nameTooLong: 'Name must be less than {count} characters',
  thumbnailOptional: 'Thumbnail (Optional)',
  addThumbnail: 'Add thumbnail',
  thumbnailAlt: 'Workflow thumbnail',
  presetThumbnailAlt: '{name} thumbnail',
  photoPermission: 'Sorry, we need camera roll permissions to make this work!',
  saveImageFailed: 'Failed to save image. Please try again.',
  addButton: 'Add',
  saveChanges: 'Save Changes',
  lastUsed: 'Last used: {date}',
  never: 'Never',
  filePath: 'Path: {path}',
  deleteTitle: 'Delete Workflow',
  deleteDescription: 'Are you sure you want to delete this workflow? This action cannot be undone.',
  addModal: {
    title: 'Add Workflow from Preset',
    selectPreset: 'Select Preset',
    selectPresetRequired: 'Please select a preset workflow',
    presets: {
      textToImage: {
        title: 'Text to Image',
        description: 'A basic workflow for generating images from text descriptions using Stable Diffusion models.',
      },
      textToImageLora: {
        title: 'Text to Image (With lora)',
        description:
          'A basic workflow for generating images from text descriptions using Stable Diffusion models with lora.',
      },
      textToImageFluxDev: {
        title: 'Text to Image (Flux Dev)',
        description:
          'Generate images from text descriptions using Flux Dev model, Flux VAE and text encoder models required.',
      },
    },
  },
  editModal: {
    title: 'Edit Workflow',
  },
  importModal: {
    title: 'Import Workflow',
    defaultName: 'New Workflow',
    whereToGet: 'Where to get my workflow file?',
    clickToChange: 'Click to change file',
    clickToSelect: 'Click to select workflow file',
    supportsJson: 'Supports JSON format',
    importFromClipboard: 'Import from Clipboard',
    importedFromClipboard: 'Imported from Clipboard',
    importFailed: 'Import Failed',
    invalidJsonFile: 'Please make sure it is a valid workflow JSON file.',
    noClipboardText: 'No text content found in clipboard.',
    clipboardEmpty: 'Clipboard is empty.',
    invalidClipboardJson: 'Please make sure you have copied a valid workflow JSON.',
    importRequired: 'Please import a workflow first',
  },
};

export type WorkflowStrings = typeof workflow;
export default workflow;
