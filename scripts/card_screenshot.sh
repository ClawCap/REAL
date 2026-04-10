#!/bin/bash
# REAL 分享卡片截图工具
# 将填充后的 share_card.html 渲染为 PNG 图片
#
# 用法: bash scripts/card_screenshot.sh <html文件> [输出路径]
# 示例: bash scripts/card_screenshot.sh real_share_card.html
#       bash scripts/card_screenshot.sh real_share_card.html my_real.png
#
# 依赖: npx playwright (运行 `npx playwright install chromium` 安装浏览器)

HTML_FILE="${1:?用法: bash card_screenshot.sh <html文件> [输出路径]}"
OUTPUT_FILE="${2:-${HTML_FILE%.html}.png}"

# 转绝对路径
HTML_FILE="$(cd "$(dirname "$HTML_FILE")" && pwd)/$(basename "$HTML_FILE")"
OUTPUT_FILE="$(cd "$(dirname "$OUTPUT_FILE")" 2>/dev/null && pwd)/$(basename "$OUTPUT_FILE")" 2>/dev/null || OUTPUT_FILE="$(pwd)/$(basename "$OUTPUT_FILE")"

if [ ! -f "$HTML_FILE" ]; then
  echo "❌ 文件不存在: $HTML_FILE"
  exit 1
fi

echo "📸 正在生成截图..."
npx playwright screenshot \
  --wait-for-selector ".card" \
  --full-page \
  "file://$HTML_FILE" \
  "$OUTPUT_FILE" 2>&1

if [ $? -eq 0 ] && [ -f "$OUTPUT_FILE" ]; then
  SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
  echo "✅ 已保存: $OUTPUT_FILE ($SIZE)"
else
  echo "❌ 截图失败"
  exit 1
fi
