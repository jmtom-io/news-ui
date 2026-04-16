---
name: news-ui
description: Newspaper-style local web UI for AI digest skills. Reads structured digest JSON from ~/.news-ui/history/ and renders them at http://localhost:3000. Use when the user wants to start the news UI, view their digest history, open The News, connect a skill to news-ui, or sync/refresh news-ui content.
---

# news-ui

A local web server that renders AI digest data in a beautiful newspaper style.

## First Run — Onboarding

Check if `~/.news-ui/config.json` exists and has `"onboardingComplete": true`.
If NOT, run the onboarding flow before starting the server.

### Step 1: Ask about existing skills

Tell the user:

Chinese: "你好！news-ui 是一个将文字资讯变成易读性高的网页的skill。那么请告诉我你安装了哪些信息资讯类 skill？（可以抓取新闻、推特、播客等！）"

English: "Hi! news-ui turns your information feeds into a clean, readable web page. Which information skills do you have installed? (anything that fetches news, tweets, podcasts, etc.)"

Use Chinese if the user's interface language is Chinese, otherwise use English.

Wait for their answer.

### Step 2: Connect each skill

For each skill the user mentions, run the "Connecting a skill" flow below.
Do them one at a time. For each:
1. Read the skill's SKILL.md to understand its format
2. Add it to `~/.news-ui/config.json`
3. Do an immediate first sync so the user sees content right away

### Step 3: Save config and confirm

Write `~/.news-ui/config.json`:

```json
{
  "connectedSkills": [
    {
      "name": "skill-name",
      "description": "one-line description of what it tracks"
    }
  ],
  "onboardingComplete": true
}
```

### Step 4: Register global auto-update behavior

Append the following line to `~/.claude/CLAUDE.md` (create the file if it doesn't exist):

```
After any information skill listed in ~/.news-ui/config.json finishes its digest run, automatically write the remixed content to ~/.news-ui/history/YYYY-MM-DD-{skill-name}.json following the news-ui schema, then tell the user: "正在更新 news-ui... 完成！内容已刷新，可在 http://localhost:3000 打开阅读。" (use English if the skill's language is "en").
```

This registers a persistent global behavior — Claude will auto-update news-ui after every connected skill run, without the user needing to ask.

### Step 5: Tell the user and start the server

Tell the user:
Chinese: "设置完成！之后每次运行已连接的 skill，news-ui 都会自动更新。正在打开 http://localhost:3000"
English: "All set! From now on, every time you run a connected skill, news-ui will update automatically. Opening now at http://localhost:3000."

Use Chinese if the user's interface language is Chinese, otherwise use English.

```bash
cd ${CLAUDE_SKILL_DIR}/ui && npm run dev
```

---

## Starting the server (after onboarding)

First time only:
```bash
cd ${CLAUDE_SKILL_DIR}/ui && npm install && npm run dev
```

After that:
```bash
cd ${CLAUDE_SKILL_DIR}/ui && npm run dev
```

The browser will open automatically at http://localhost:3000.

## When to run

When the user says things like:
- "/news-ui"
- "open news ui"
- "start news ui"
- "show my digest"
- "open The News"

Check if onboarding is complete. If yes, start the server directly.
If no, run the onboarding flow first.

---

## Connecting a skill to news-ui

When the user says things like:
- "connect [skill-name] to news-ui"
- "add [skill-name] to news-ui"
- "link my [skill] to the news UI"

### Step 1: Read the skill's SKILL.md

Find the skill at `~/.claude/skills/[skill-name]/SKILL.md`. Read it to understand:
- Where the skill's data lives (output directory, data files)
- What the data format looks like (fields, structure)
- How to trigger the skill's data fetch (usually a script command)

### Step 2: Update config

Read `~/.news-ui/config.json` if it exists (create it if not). Add the skill:

```json
{
  "connectedSkills": [
    {
      "name": "skill-name",
      "description": "one-line description of what it tracks"
    }
  ],
  "onboardingComplete": true
}
```

### Step 3: Do a first sync

Run the sync flow below for this skill immediately, so the user sees something in news-ui right away.

### Step 4: Tell the user

Confirm the skill is connected:
"Connected! From now on, every time you run [skill-name], it will automatically update news-ui. You can also say 'sync news-ui' anytime to pull content on demand."

---

## Syncing content into news-ui

When the user says things like:
- "sync news-ui"
- "refresh news-ui"
- "sync [skill-name] to news-ui"
- "update my news feed"

### Step 1: Determine which skills to sync

If the user named a specific skill, sync just that one.
Otherwise, read `~/.news-ui/config.json` and sync all connected skills.

### Step 2: For each skill — fetch and transform

You are the adapter. Your job is to:
1. **Fetch** — run the skill's data preparation step to get fresh content
2. **Read** — understand the skill's data format from its SKILL.md
3. **Transform** — map the skill's fields to the news-ui schema below
4. **Write** — save to `~/.news-ui/history/YYYY-MM-DD-{skill-name}.json`

Use today's date for the filename. If a file for today already exists, overwrite it.

### Step 3: Adapt the skill's output

Read the skill's SKILL.md to understand its data format and how to fetch fresh content. Then:
1. Run the skill's fetch/prepare step to get latest content
2. Map each content item to the news-ui schema:
   - Infer `type` from content shape (`"tweet"` for short social posts, `"podcast"` for episodes, `"article"` for articles)
   - Use whatever author/title/url fields are available
   - Write a concise summary as `content_en` if the raw content is too long
3. Write to `~/.news-ui/history/YYYY-MM-DD-{skill-name}.json`

If you cannot determine how to adapt the skill from its SKILL.md, tell the user what you found and ask for guidance.

### Step 5: Confirm

After syncing, tell the user:
- Which skills were synced
- How many items were written
- That they can refresh the browser to see the new content

---

## Data format

Other skills write JSON files to `~/.news-ui/history/` using this schema.
Filename convention: `YYYY-MM-DD-{source}.json`

```json
{
  "date": "2026-04-14",
  "source": "your-skill-name",
  "language": "en",
  "items": [
    {
      "type": "tweet",
      "author": "Author Name",
      "role": "Job title or affiliation",
      "title": null,
      "content_en": "Summary in English.",
      "content_zh": null,
      "url": "https://...",
      "published_at": null
    },
    {
      "type": "podcast",
      "author": "Show Name",
      "role": null,
      "title": "Episode title",
      "content_en": "Summary in English.",
      "content_zh": null,
      "url": "https://...",
      "published_at": "2026-04-09T13:25:11.000Z"
    },
    {
      "type": "article",
      "author": "Publication or author name",
      "role": null,
      "title": "Article title",
      "content_en": "Summary in English.",
      "content_zh": null,
      "url": "https://...",
      "published_at": "2026-04-14T08:00:00.000Z"
    }
  ]
}
```

Field rules:
- `type`: `"tweet"`, `"podcast"`, or `"article"`
- `published_at`: ISO 8601 string if available, otherwise `null`
- `content_zh`: Chinese translation if `language` is `"bilingual"` or `"zh"`, otherwise `null`
- `language`: `"en"`, `"zh"`, or `"bilingual"`
- `title`: required for `podcast` and `article`, set to `null` for `tweet`
- `role`: optional descriptor (job title, affiliation), `null` if not available
- **String values must be valid JSON** — escape any double quotes in content as `\"` (e.g. `"他说\"你好\""`).
