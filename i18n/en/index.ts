import app from './app';
import assistant from './assistant';
import common from './common';
import generation from './generation';
import nodes from './nodes';
import server from './server';
import settings from './settings';
import workflow from './workflow';

const en = {
  common,
  settings,
  app,
  server,
  workflow,
  nodes,
  generation,
  assistant,
};

export type Translations = typeof en;
export default en;
