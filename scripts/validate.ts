import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

interface Talk {
  title: string;
  author?: string;
  url: string;
  tags: string[];
  year?: number;
}

const YOUTUBE_URL_REGEX = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : null;
}

function validate(): void {
  const dataDir = 'data';
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.yaml'));

  if (files.length === 0) {
    console.error('No YAML files found in data/ directory');
    process.exit(1);
  }

  const errors: string[] = [];
  const videoIds = new Map<string, string>();
  let totalTalks = 0;

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const talks = yaml.load(content) as Talk[];

    if (!Array.isArray(talks)) {
      errors.push(`${file}: not a valid array of talks`);
      continue;
    }

    talks.forEach((talk, index) => {
      totalTalks++;
      const prefix = `${file} - Talk ${index + 1} ("${talk.title}")`;

      // Required fields (author and year are optional)
      if (!talk.title) errors.push(`${prefix}: missing title`);
      if (!talk.url) errors.push(`${prefix}: missing url`);
      if (!talk.tags || talk.tags.length === 0) errors.push(`${prefix}: missing tags`);

      // Valid YouTube URL
      if (talk.url && !YOUTUBE_URL_REGEX.test(talk.url)) {
        errors.push(`${prefix}: invalid YouTube URL`);
      }

      // Duplicate check (across all files)
      if (talk.url) {
        const videoId = extractVideoId(talk.url);
        if (videoId) {
          if (videoIds.has(videoId)) {
            errors.push(`${prefix}: duplicate video ID "${videoId}" (already used by "${videoIds.get(videoId)}")`);
          } else {
            videoIds.set(videoId, `${file}: ${talk.title}`);
          }
        }
      }
    });
  }

  if (errors.length > 0) {
    console.error('Validation failed:\n');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`✓ Validated ${totalTalks} talks across ${files.length} file(s), no issues found.`);
}

validate();
