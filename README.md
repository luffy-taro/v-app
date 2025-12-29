# The Archive

A curated collection of software/tech talks from YouTube. Community-contributed via pull requests.

## Features

- Browse and search video talks by title, speaker, or tags
- Filter by tags in the sidebar
- "Feeling Lucky" random video selection
- Video progress tracking (localStorage)
- Dark/light mode
- GitHub-powered comments via Giscus

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Giscus](https://giscus.app) - Comments via GitHub Discussions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Development

```bash
npm run dev
```

Open http://localhost:4321 in your browser.

### Build

```bash
# Validate data before building
npm run validate

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding Videos

Edit `data/talks.yaml` and add a new entry:

```yaml
- title: "Your Talk Title"
  speaker: "Speaker Name"
  url: https://www.youtube.com/watch?v=VIDEO_ID
  tags: [tag1, tag2, tag3]
  year: 2024
```

Run `npm run validate` to check for errors before committing.

### Validation Rules

- No duplicate YouTube URLs
- Required fields: title, speaker, url, tags
- URL must be a valid YouTube link

## Comments Setup (Giscus)

1. Enable [GitHub Discussions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository) on your repository

2. Go to [giscus.app](https://giscus.app) and configure:
   - Repository: your repo
   - Discussion Category: create one called "Video Discussions"
   - Copy the generated values

3. Add to your `.env` file:

```env
PUBLIC_GISCUS_REPO=owner/repo
PUBLIC_GISCUS_REPO_ID=R_xxxxx
PUBLIC_GISCUS_CATEGORY=Video Discussions
PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxx
```

## Deployment

### GitHub Pages

1. In your repo settings, enable GitHub Pages with GitHub Actions

2. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run validate
      - run: npm run build
        env:
          PUBLIC_GISCUS_REPO: ${{ vars.PUBLIC_GISCUS_REPO }}
          PUBLIC_GISCUS_REPO_ID: ${{ vars.PUBLIC_GISCUS_REPO_ID }}
          PUBLIC_GISCUS_CATEGORY: ${{ vars.PUBLIC_GISCUS_CATEGORY }}
          PUBLIC_GISCUS_CATEGORY_ID: ${{ vars.PUBLIC_GISCUS_CATEGORY_ID }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

3. Add Giscus variables in repo Settings → Secrets and variables → Actions → Variables

### Netlify

1. Connect your repo to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Site settings → Environment variables

### Vercel

1. Import your repo to Vercel
2. Framework preset: Astro
3. Add environment variables in Project settings → Environment Variables

## Project Structure

```
├── data/
│   └── talks.yaml          # Video data
├── scripts/
│   └── validate.ts         # Data validation
├── src/
│   ├── components/
│   │   ├── Sidebar.astro
│   │   └── VideoCard.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── types.ts
│   │   └── youtube.ts
│   ├── pages/
│   │   ├── index.astro     # Browse view
│   │   └── video/
│   │       └── [id].astro  # Video detail view
│   └── styles/
│       └── global.css
├── .env.example
├── astro.config.mjs
└── package.json
```

## Contributing

1. Fork the repository
2. Add your video to `data/talks.yaml`
3. Run `npm run validate` to check for errors
4. Submit a pull request

## License

MIT
