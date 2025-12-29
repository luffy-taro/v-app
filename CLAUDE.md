# CLAUDE.md

This file provides guidance for AI agents working on this codebase.

## Project Overview

**v/** is a curated collection of tech talks from YouTube, built as a static site with Astro.

## Tech Stack

- **Astro** - Static site generator (SSG mode)
- **Tailwind CSS v4** - Styling with `@theme` CSS variables
- **TypeScript** - Type checking
- **js-yaml** - YAML parsing for talk data

## Project Structure

```
├── data/
│   └── talks.yaml          # Video data (title, speaker, url, tags, year)
├── src/
│   ├── components/
│   │   ├── Sidebar.astro   # Navigation, tags, feeling lucky
│   │   └── VideoCard.astro # Video thumbnail cards
│   ├── layouts/
│   │   └── Layout.astro    # Base HTML layout
│   ├── lib/
│   │   ├── types.ts        # TypeScript interfaces
│   │   └── youtube.ts      # YouTube URL/thumbnail helpers
│   ├── pages/
│   │   ├── index.astro     # Browse view with grid/list toggle
│   │   └── video/[id].astro # Video detail with player + comments
│   └── styles/
│       └── global.css      # Tailwind config, dark mode, list view
├── public/                 # Static assets
└── scripts/
    └── validate.ts         # Data validation script
```

## Key Conventions

### Styling
- Uses Tailwind CSS v4 with `@custom-variant dark` for class-based dark mode
- Color palette is stone-based (defined in `global.css` under `@theme`)
- Dark mode classes: `dark:bg-*`, `dark:text-*`, etc.

### Data
- All video data lives in `data/talks.yaml`
- Required fields: `title`, `speaker`, `url`, `tags`
- Optional: `year`
- Run `npm run validate` before committing data changes

### Client-Side Features
- Dark mode preference stored in `localStorage.darkMode`
- Video progress/duration stored in `localStorage.videoMetadata`
- View preference (grid/list) in `localStorage.videoView`
- Sort preference in `localStorage.videoSortDirection`
- Tag filtering uses URL params (`/?tag=tagname`)

### Comments
- Uses Giscus (GitHub Discussions)
- Configured via environment variables (`PUBLIC_GISCUS_*`)
- Theme switches with dark mode toggle

## Common Tasks

### Adding a video
Edit `data/talks.yaml`:
```yaml
- title: "Talk Title"
  speaker: "Speaker Name"
  url: https://www.youtube.com/watch?v=VIDEO_ID
  tags: [tag1, tag2]
  year: 2024
```

### Running locally
```bash
npm install
npm run dev      # http://localhost:4321
```

### Building
```bash
npm run validate  # Check data integrity
npm run build     # Generate static site to dist/
```

## Environment Variables

For Giscus comments (optional):
```
PUBLIC_GISCUS_REPO=owner/repo
PUBLIC_GISCUS_REPO_ID=R_xxxxx
PUBLIC_GISCUS_CATEGORY=Video Discussions
PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxx
```

## Notes

- This is a static site - no server-side rendering
- YouTube IFrame API is loaded client-side for video playback
- All filtering/sorting happens client-side via JavaScript
- Material Symbols icons are loaded from Google Fonts
