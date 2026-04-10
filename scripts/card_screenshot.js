#!/usr/bin/env node
/**
 * REAL 分享卡片截图工具
 * 将填充后的 share_card.html 渲染为高清 PNG（只截 .card 元素）
 *
 * 用法: node scripts/card_screenshot.js <html文件> [输出路径]
 * 示例: node scripts/card_screenshot.js real_share_card.html
 *       node scripts/card_screenshot.js real_share_card.html my_real.png
 *
 * 首次运行需要: npx playwright install chromium
 */

const path = require('path');
const fs = require('fs');

async function screenshot(htmlPath, outputPath) {
  // 从全局 npx 缓存加载 playwright-core
  let chromium;
  const tryModules = ['playwright-core', 'playwright'];
  for (const mod of tryModules) {
    try { chromium = require(mod).chromium; break; } catch {}
  }

  // 如果全局没有，尝试用 npx 安装的路径
  if (!chromium) {
    try {
      const { execSync } = require('child_process');
      const npmRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
      chromium = require(path.join(npmRoot, 'playwright-core')).chromium;
    } catch {}
  }

  if (!chromium) {
    console.error('需要安装 playwright-core:');
    console.error('  npm install -g playwright-core');
    console.error('  npx playwright install chromium');
    process.exit(1);
  }

  const absoluteHtml = path.resolve(htmlPath);
  const absoluteOutput = path.resolve(outputPath || htmlPath.replace(/\.html?$/, '.png'));

  if (!fs.existsSync(absoluteHtml)) {
    console.error(`文件不存在: ${absoluteHtml}`);
    process.exit(1);
  }

  console.log('📸 正在生成截图...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 500, height: 1000 },
    deviceScaleFactor: 3,
  });

  await page.goto(`file://${absoluteHtml}`, { waitUntil: 'networkidle' });

  const card = await page.$('.card');
  if (card) {
    await card.screenshot({ path: absoluteOutput, type: 'png' });
  } else {
    await page.screenshot({ path: absoluteOutput, type: 'png', fullPage: true });
  }

  await browser.close();

  const sizeKB = (fs.statSync(absoluteOutput).size / 1024).toFixed(0);
  console.log(`✅ 已保存: ${absoluteOutput} (${sizeKB}KB)`);
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('用法: node card_screenshot.js <html文件> [输出路径]');
  process.exit(0);
}

screenshot(args[0], args[1]).catch(err => {
  console.error('❌ 截图失败:', err.message);
  process.exit(1);
});
