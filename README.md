[中文](README.zh-CN.md) | [English](README.md)

<div align="center">

<img src="docs/screenshots/cover.png" alt="The News — Newspaper-style AI digest reader" width="100%" />

# news-ui

**Turn your AI information skills into a newspaper you look forward to reading every day.**

</div>

---

## ✨ Quick Start

**Option 1: Via Claude Code (recommended)**

```bash
git clone https://github.com/jmtom-io/news-ui ~/.claude/skills/news-ui
bash ~/.claude/skills/news-ui/install.sh
```

Then type in Claude Code:

```
/news-ui
```

**Option 2: Manual**

```bash
cd ~/.claude/skills/news-ui/ui && npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🤔 Who is this for?

- You have information skills installed (follow-builders, ai-daily, etc.) and want a beautiful reading UI
- You want to unify tweets, podcasts, and articles into one newspaper-style feed
- You want to keep a searchable history of your daily AI digests

---

## 📋 Features

1. **Newspaper layout**: Tweets, podcasts, and articles presented as clean newspaper cards
2. **Multi-source aggregation**: Connect multiple information skills, content merged into one feed
3. **Bilingual support**: English only, Chinese only, or side-by-side bilingual
4. **Sidebar filters**: Switch by date or source with one click
5. **Full-text search**: Search across all historical content
6. **Local-first**: All data stored at `~/.news-ui/history/` — nothing sent to any server
7. **Zero config**: Just Node.js, no additional setup needed
8. **Auto-update**: Every time a connected skill runs, news-ui refreshes automatically

---

## 🚀 Installation

**Prerequisites:** Node.js

```bash
# Clone the repo
git clone https://github.com/jmtom-io/news-ui ~/.claude/skills/news-ui

# Run the install script (installs dependencies and registers the skill)
bash ~/.claude/skills/news-ui/install.sh
```

After installation, type `/news-ui` in Claude Code to launch.

On first launch, an onboarding flow will guide you through connecting your information skills — just tell Claude which skills you have installed.

---

## 🔌 Connecting Your Skills

news-ui uses a pull model — Claude acts as the adapter layer, reading each skill's data format and writing to the standard schema.

After each information skill run, Claude automatically writes content to:

```
~/.news-ui/history/YYYY-MM-DD-{skill-name}.json
```

**If you're a skill developer**, you can also write directly to that path using the schema below — your content will appear in news-ui automatically.

---

## 📐 Data Schema

**Filename format:** `YYYY-MM-DD-{your-skill-name}.json`

```json
{
  "date": "2026-04-14",
  "source": "your-skill-name",
  "language": "bilingual",
  "items": [
    {
      "type": "tweet",
      "author": "Author Name",
      "role": "Job title or affiliation",
      "title": null,
      "content_en": "English summary.",
      "content_zh": "中文摘要。",
      "url": "https://x.com/...",
      "published_at": null
    },
    {
      "type": "podcast",
      "author": "Show Name",
      "role": null,
      "title": "Episode title",
      "content_en": "English summary.",
      "content_zh": "中文摘要。",
      "url": "https://...",
      "published_at": "2026-04-09T13:25:11.000Z"
    },
    {
      "type": "article",
      "author": "Publication Name",
      "role": null,
      "title": "Article title",
      "content_en": "English summary.",
      "content_zh": "中文摘要。",
      "url": "https://...",
      "published_at": "2026-04-14T08:00:00.000Z"
    }
  ]
}
```

**Field reference:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `date` | string | Yes | `YYYY-MM-DD`, used for grouping in the UI |
| `source` | string | Yes | Your skill name, shown in the sidebar |
| `language` | string | Yes | `"en"`, `"zh"`, or `"bilingual"` |
| `type` | string | Yes | `"tweet"`, `"podcast"`, or `"article"` |
| `author` | string | Yes | Person or publication name |
| `role` | string\|null | No | Job title or affiliation, shown below author name |
| `title` | string\|null | No | Required for `podcast` and `article`, `null` for `tweet` |
| `content_en` | string | Yes | English summary |
| `content_zh` | string\|null | No | Chinese summary, `null` if not bilingual |
| `url` | string | Yes | Link to the original content |
| `published_at` | string\|null | No | ISO 8601 datetime if available, otherwise `null` |

> Note: Double quotes inside `content_zh` strings must be escaped as `\"` to avoid JSON parse errors.

---

## 📁 Project Structure

```
news-ui/
├── ui/                  # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx      # Main component (newspaper layout, sidebar, search)
│   │   └── ...
│   └── vite.config.ts   # Dev server + /api/digests endpoint
├── SKILL.md             # Claude Code skill definition
├── install.sh           # One-command install script
└── README.md
```

---

## ⭐ Star History

If you find this useful, a star goes a long way!

[![Star History Chart](https://api.star-history.com/svg?repos=jmtom-io/news-ui&type=Date)](https://star-history.com/#jmtom-io/news-ui&Date)
