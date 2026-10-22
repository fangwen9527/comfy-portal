import type { Translations } from '../en';
import app from './app';
import assistant from './assistant';
import common from './common';
import generation from './generation';
import nodes from './nodes';
import server from './server';
import settings from './settings';
import workflow from './workflow';

/**
 * Declared as `Translations` so a key missing here — or an extra one — fails
 * the type check instead of silently falling back to English.
 */
const zhCN: Translations = {
  common,
  settings,
  app,
  server,
  workflow,
  nodes,
  generation,
  assistant,
};

export default zhCN;
