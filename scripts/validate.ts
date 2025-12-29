import fs from 'node:fs';
import yaml from 'js-yaml';

interface Talk {
  title: string;
  speaker: string;
  url: string;
  tags: string[];
  year: number;
}

const YOUTUBE_URL_REGEX = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : null;
}

function validate(): void {
  const talksFile = fs.readFileSync('data/talks.yaml', 'utf8');
  const talks = yaml.load(talksFile) as Talk[];

  const errors: string[] = [];
  const videoIds = new Map<string, string>();

  talks.forEach((talk, index) => {
    const prefix = `Talk ${index + 1} ("${talk.title}")`;

    // Required fields
    if (!talk.title) errors.push(`${prefix}: missing title`);
    if (!talk.speaker) errors.push(`${prefix}: missing speaker`);
    if (!talk.url) errors.push(`${prefix}: missing url`);
    if (!talk.tags || talk.tags.length === 0) errors.push(`${prefix}: missing tags`);

    // Valid YouTube URL
    if (talk.url && !YOUTUBE_URL_REGEX.test(talk.url)) {
      errors.push(`${prefix}: invalid YouTube URL`);
    }

    // Duplicate check
    if (talk.url) {
      const videoId = extractVideoId(talk.url);
      if (videoId) {
        if (videoIds.has(videoId)) {
          errors.push(`${prefix}: duplicate video ID "${videoId}" (already used by "${videoIds.get(videoId)}")`);
        } else {
          videoIds.set(videoId, talk.title);
        }
      }
    }
  });

  if (errors.length > 0) {
    console.error('Validation failed:\n');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`✓ Validated ${talks.length} talks, no issues found.`);
}

validate();
