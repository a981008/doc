# DHX Blog

本项目主要翻译 AI / Agent 相关技术文章，基于 VitePress 构建。

## 开始使用

```bash
npm install
npm run dev      # 开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览构建结果
```

## 目录结构

```
.
├── README.md
├── package.json
├── lab/
    └── *.ipynb
└── docs/
    ├── index.md -> ../README.md
    ├── *.md
    └── .vitepress/
        └── config.js
```

## 添加文章

在 `docs/` 目录下添加 `.md` 文件即可自动：
- 出现在侧边栏导航
- 生成对应路由 `/{filename}`

## 部署

推送到 `main` 分支后会自动部署到 GitHub Pages：
https://a981008.github.io/doc/
