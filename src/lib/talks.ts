import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { Talk } from './types';

/**
 * Load all talks from YAML files in the data directory.
 * Supports both single file (talks.yaml) and multiple files (*.yaml).
 */
export function loadTalks(): Talk[] {
  const dataDir = 'data';
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.yaml'));

  const allTalks: Talk[] = [];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const talks = yaml.load(content) as Talk[];

    if (Array.isArray(talks)) {
      allTalks.push(...talks);
    }
  }

  return allTalks;
}
