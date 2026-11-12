# 计算机网络 · 交互式课程站点

以谢希仁《计算机网络》章节体系为主线的 6 章完整课程：场景化理论讲解、
交互自测、Wireshark 真实抓包分析（含课程专属抓包样本）、Cisco Packet
Tracer 组网实验、浏览器交互组件（编码波形绘制器、信道极限计算器）。

## 在线访问

部署到 GitHub Pages 后：`https://<用户名>.github.io/<仓库名>/`

## 部署步骤

```bash
# 1. 在 github.com 新建空仓库（不要初始化 README），然后在本目录：
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main

# 2. 仓库 Settings → Pages → Build and deployment → Source 选 "GitHub Actions"

# 3. 等待 Actions 工作流变绿（约 1 分钟）后访问上面网址
```

之后每次 `git push` 自动重新部署。

## 目录结构

```
├── index.html                        # 课程首页（6 章导航）
├── lessons/001~006                   # 6 章课程
├── reference/glossary.html           # 全程术语表
├── assets/
│   ├── course.css / quiz.js
│   ├── wave-widget.js                # 编码波形绘制器
│   ├── channel-limits.js             # 信道极限计算器
│   └── captures/sample-mixed.pcapng  # 真实抓包样本（Wireshark 打开分析）
├── learning-records/                 # 学习档案
└── .github/workflows/deploy.yml      # GitHub Pages 部署工作流
```
