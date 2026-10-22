import type { TranslationKey } from '@/i18n';

/**
 * Input options for ComfyUI-MiniMaxH3-Easy.
 *
 * Values mirror the constants in the extension's `nodes.py` exactly — the
 * server validates against these ids, not against the labels shown here.
 */

export interface Option {
  value: string;
  /** i18n key for the visible label; unset when the label is the raw value. */
  labelKey?: TranslationKey;
  /** i18n key for the secondary line; unset when there is none. */
  descriptionKey?: TranslationKey;
}

export const MODE_OPTIONS: Option[] = [
  {
    value: 'image',
    labelKey: 'nodes.minimax.option.modeImage',
    descriptionKey: 'nodes.minimax.option.modeImageDescription',
  },
  {
    value: 'reference',
    labelKey: 'nodes.minimax.option.modeReference',
    descriptionKey: 'nodes.minimax.option.modeReferenceDescription',
  },
];

export const RESOLUTION_OPTIONS: Option[] = [
  { value: '360P' },
  { value: '416P' },
  { value: '480P' },
  { value: '540P' },
  { value: '640P' },
  { value: '720P' },
  { value: '768P' },
  { value: '832P' },
  { value: '928P' },
  { value: '1024P' },
  { value: '1080P' },
  { value: 'custom', labelKey: 'nodes.common.custom' },
];

export const ASPECT_RATIO_OPTIONS: Option[] = [
  { value: '1:1', descriptionKey: 'nodes.minimax.option.aspectSquare' },
  { value: '2:3', descriptionKey: 'nodes.minimax.option.aspectPhotoPortrait' },
  { value: '3:2', descriptionKey: 'nodes.minimax.option.aspectPhoto' },
  { value: '3:4', descriptionKey: 'nodes.minimax.option.aspectStandardPortrait' },
  { value: '4:3', descriptionKey: 'nodes.minimax.option.aspectStandard' },
  { value: '9:16', descriptionKey: 'nodes.minimax.option.aspectWidescreenPortrait' },
  { value: '16:9', descriptionKey: 'nodes.minimax.option.aspectWidescreen' },
  { value: '21:9', descriptionKey: 'nodes.minimax.option.aspectUltrawide' },
];

export const KEYFRAME_ROLE_OPTIONS: Option[] = [
  {
    value: 'first',
    labelKey: 'nodes.minimax.option.keyframeFirst',
    descriptionKey: 'nodes.minimax.option.keyframeFirstDescription',
  },
  {
    value: 'last',
    labelKey: 'nodes.minimax.option.keyframeLast',
    descriptionKey: 'nodes.minimax.option.keyframeLastDescription',
  },
];

export const REF_IMAGE_SIZE_OPTIONS: Option[] = [
  { value: 'match', labelKey: 'nodes.minimax.option.refSizeMatch' },
  {
    value: '1k',
    labelKey: 'nodes.minimax.option.refSize1k',
    descriptionKey: 'nodes.minimax.option.refSize1kDescription',
  },
  {
    value: '1.5k',
    labelKey: 'nodes.minimax.option.refSize15k',
    descriptionKey: 'nodes.minimax.option.refSize15kDescription',
  },
  {
    value: '2k',
    labelKey: 'nodes.minimax.option.refSize2k',
    descriptionKey: 'nodes.minimax.option.refSize2kDescription',
  },
  { value: 'original', labelKey: 'nodes.minimax.option.refSizeOriginal' },
];

export const REFERENCE_MENTION_OPTIONS: Option[] = [
  { value: 'index', labelKey: 'nodes.minimax.option.mentionByIndex' },
  { value: 'filename', labelKey: 'nodes.minimax.option.mentionByFilename' },
];

/**
 * Scene guides come from the extension's `prompt_guides/manifest.json`, so a
 * newer install may offer more than these. `withCurrentValue` keeps whatever
 * the workflow already holds selectable rather than silently dropping it.
 */
export const SCENE_GUIDE_OPTIONS: Option[] = [
  { value: 'none', labelKey: 'nodes.minimax.option.sceneNone' },
  { value: '3d_animation_short', labelKey: 'nodes.minimax.option.scene3dAnimationShort' },
  { value: 'brand_promo', labelKey: 'nodes.minimax.option.sceneBrandPromo' },
  { value: 'coop_game_intro', labelKey: 'nodes.minimax.option.sceneCoopGameIntro' },
  { value: 'handdrawn_live', labelKey: 'nodes.minimax.option.sceneHanddrawnLive' },
  { value: 'minimalist_product_ad', labelKey: 'nodes.minimax.option.sceneMinimalistProductAd' },
  { value: 'music_video_subtitle', labelKey: 'nodes.minimax.option.sceneMusicVideoSubtitle' },
  { value: 'paper_collage', labelKey: 'nodes.minimax.option.scenePaperCollage' },
  { value: 'papercraft_stop_motion', labelKey: 'nodes.minimax.option.scenePapercraftStopMotion' },
];

/**
 * Ensure the workflow's current value is always selectable.
 *
 * Guards against two cases: a server whose extension offers options we don't
 * know about, and a workflow carrying a stale value the server would reject —
 * both stay visible so the user can see and correct what is set.
 */
export function withCurrentValue(options: Option[], value: unknown): Option[] {
  if (typeof value !== 'string' || !value) return options;
  if (options.some((option) => option.value === value)) return options;
  return [...options, { value, descriptionKey: 'nodes.common.notOfferedByServer' }];
}

export const SECONDS_MIN = 0.2;
export const SECONDS_MAX = 30;
export const FPS_MIN = 1;
export const FPS_MAX = 120;
export const DIMENSION_MIN = 32;
export const DIMENSION_MAX = 16384;
export const DIMENSION_STEP = 32;

export const MAX_IMAGES = 9;
export const MAX_VIDEOS = 3;
export const MAX_AUDIOS = 3;
