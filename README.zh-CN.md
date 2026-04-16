[中文](README.zh-CN.md) | [English](README.md)

<div align="center">

<img src="docs/screenshots/cover.png" alt="The News — 报纸风格 AI 资讯阅读器" width="100%" />

# news-ui

**把你的 AI 信息 skill 变成一份每天等你打开的报纸。**

</div>

---

## ✨ 快速体验

**方式一：通过 Claude Code 启动（推荐）**

```bash
git clone https://github.com/jmtom-io/news-ui ~/.claude/skills/news-ui
bash ~/.claude/skills/news-ui/install.sh
```

安装完成后，在 Claude Code 中输入：

```
/news-ui
```

**方式二：手动启动**

```bash
cd ~/.claude/skills/news-ui/ui && npm run dev
```

浏览器打开 `http://localhost:3000`

---

## 🤔 适合谁用

- 装了信息资讯类 skill（follow-builders、ai-daily 等），想要一个好看的阅读界面
- 希望把推文、播客、文章统一汇聚成一份"报纸"来读
- 想要留存历史记录、按日期或来源检索内容

---

## 📋 功能一览

1. **报纸排版**：推文、播客、文章，统一以报纸卡片形式呈现
2. **多来源聚合**：同时接入多个信息 skill，内容合并展示
3. **中英双语**：支持纯中文、纯英文、中英对照三种模式
4. **侧边栏筛选**：按日期或来源一键切换
5. **全文搜索**：跨历史记录搜索关键词
6. **本地优先**：所有数据存在本机 `~/.news-ui/history/`，不上传任何服务器
7. **开箱即用**：只需 Node.js，无需任何额外配置
8. **自动更新**：每次运行已连接的信息 skill，news-ui 自动刷新内容

---

## 🚀 安装与启动

**前置要求：** Node.js

```bash
# 克隆仓库
git clone https://github.com/jmtom-io/news-ui ~/.claude/skills/news-ui

# 运行安装脚本（自动安装依赖并注册 skill）
bash ~/.claude/skills/news-ui/install.sh
```

安装完成后，在 Claude Code 中输入 `/news-ui` 即可启动。

首次启动会进入引导流程，告诉 Claude 你安装了哪些信息 skill，Claude 会自动完成适配。

---

## 🔌 接入你的资讯 Skill

news-ui 使用"拉取模型"——Claude 作为适配层，读取各 skill 的数据格式并转换写入。

每次运行信息 skill 后，Claude 会自动将内容写入：

```
~/.news-ui/history/YYYY-MM-DD-{skill-name}.json
```

**如果你是 skill 开发者**，也可以让 skill 直接写入上述路径，按以下 Schema 输出即可自动显示在 news-ui 中。

---

## 📐 数据 Schema

**文件名格式：** `YYYY-MM-DD-{your-skill-name}.json`

```json
{
  "date": "2026-04-14",
  "source": "your-skill-name",
  "language": "bilingual",
  "items": [
    {
      "type": "tweet",
      "author": "作者名",
      "role": "职位或所属机构",
      "title": null,
      "content_en": "English summary.",
      "content_zh": "中文摘要。",
      "url": "https://x.com/...",
      "published_at": null
    },
    {
      "type": "podcast",
      "author": "播客名称",
      "role": null,
      "title": "单集标题",
      "content_en": "English summary.",
      "content_zh": "中文摘要。",
      "url": "https://...",
      "published_at": "2026-04-09T13:25:11.000Z"
    },
    {
      "type": "article",
      "author": "媒体或作者名",
      "role": null,
      "title": "文章标题",
      "content_en": "English summary.",
      "content_zh": "中文摘要。",
      "url": "https://...",
      "published_at": "2026-04-14T08:00:00.000Z"
    }
  ]
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `date` | string | 是 | `YYYY-MM-DD`，用于 UI 中的分组展示 |
| `source` | string | 是 | Skill 名称，显示在侧边栏 |
| `language` | string | 是 | `"en"`、`"zh"` 或 `"bilingual"` |
| `type` | string | 是 | `"tweet"`、`"podcast"` 或 `"article"` |
| `author` | string | 是 | 人名或媒体名 |
| `role` | string\|null | 否 | 职位或所属机构，显示在作者名下方 |
| `title` | string\|null | 否 | `podcast` 和 `article` 必填，`tweet` 填 `null` |
| `content_en` | string | 是 | 英文摘要 |
| `content_zh` | string\|null | 否 | 中文摘要，非双语模式填 `null` |
| `url` | string | 是 | 原始内容链接 |
| `published_at` | string\|null | 否 | ISO 8601 时间，无发布时间填 `null` |

> 注意：`content_zh` 中的双引号需转义为 `\"`，避免 JSON 解析失败。

---

## 📁 项目结构

```
news-ui/
├── ui/                  # React + Vite 前端
│   ├── src/
│   │   ├── App.tsx      # 主组件（报纸布局、侧边栏、搜索）
│   │   └── ...
│   └── vite.config.ts   # 开发服务器 + /api/digests 接口
├── SKILL.md             # Claude Code skill 定义
├── install.sh           # 一键安装脚本
└── README.zh-CN.md
```

---

## ⭐ Star History

如果这个项目对你有帮助，欢迎 Star！

[![Star History Chart](https://api.star-history.com/svg?repos=jmtom-io/news-ui&type=Date)](https://star-history.com/#jmtom-io/news-ui&Date)
