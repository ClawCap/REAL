# ClawCap 统一数据层设计

## 核心思路

所有 ClawCap Skill 共享一个本地数据目录。按**人**组织，不按 Skill 组织。

## 目录结构

```
clawcap-data/
├── self/                          ← 自己的数据（默认）
│   ├── douyin.json
│   ├── xiaohongshu.json
│   ├── weibo.json
│   ├── douban.json
│   ├── bilibili.json
│   └── metadata.json
├── {nickname_or_id}/              ← 别人的数据（相亲照妖镜/月老/导师）
│   ├── douyin.json
│   ├── ...
│   └── metadata.json
└── reports/                       ← 各 Skill 生成的报告
    ├── mirror_2026-04-10.md
    ├── epitaph_2026-04-10.md
    ├── real_2026-04-10.md
    ├── date_report_{nickname}.md
    ├── match_{A}_{B}_2026-04-10.md
    └── mentor_{name}.md
```

## 数据复用规则

1. 采集前先检查 `clawcap-data/self/metadata.json` 是否存在
2. 如果存在且采集时间 < 7天 → 直接复用，不重新采集
3. 如果存在但 > 7天 → 提示用户"上次采集是X天前，要重新采集还是用旧数据？"
4. 如果不存在 → 正常采集
5. 单平台刷新：只重跑指定平台，其他复用
