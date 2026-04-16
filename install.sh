#!/bin/bash

set -e

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HISTORY_DIR="$HOME/.news-ui/history"

echo "Installing news-ui... / 正在安装 news-ui..."

# Create data directory
mkdir -p "$HISTORY_DIR"
echo "✓ Created $HISTORY_DIR"

# Install dependencies
echo "Installing dependencies... / 正在安装依赖..."
cd "$SKILL_DIR/ui" && npm install
echo "✓ Dependencies installed / 依赖安装完成"

echo ""
echo "Done! / 安装完成！"
echo ""
echo "To start news-ui, run: / 手动启动："
echo "  cd $SKILL_DIR/ui && npm run dev"
echo ""
echo "Or type '/news-ui' in Claude Code. / 或在 Claude Code 中输入 /news-ui 启动。"
