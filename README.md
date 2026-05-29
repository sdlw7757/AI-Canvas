<div align="center">

# 🎨 AI Canvas

> **智能图片修复工具** — 基于 AI 的图片去水印、修复与增强

<p align="center">
  <img src="https://img.shields.io/badge/版本-1.0.0-blue?style=flat-square" alt="版本">
  <img src="https://img.shields.io/badge/框架-React%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react" alt="框架">
  <img src="https://img.shields.io/badge/模型-ONNX%20Runtime-005FFF?style=flat-square&logo=onnx" alt="模型">
  <img src="https://img.shields.io/badge/构建-Vite-646CFF?style=flat-square&logo=vite" alt="构建">
</p>

---

</div>

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🖱️ **智能涂抹** | 标记需要修复的区域，AI 自动补全 |
| 🎯 **精准修复** | 基于深度学习的高精度图片修复 |
| ⚡ **本地运行** | 纯浏览器端推理，图片不上传服务器 |
| 🔒 **隐私安全** | 所有计算在本地完成，数据不外泄 |
| 🎨 **毛玻璃界面** | 科技感毛玻璃风格，视觉体验舒适 |
| 🚀 **本地模型优先** | 自动缓存 ONNX 模型，离线也能使用 |

## 🖼️ 使用效果

<div align="center">

```
┌─────────────────────────────────────┐
│   上传图片  →  涂抹区域  →  一键修复   │
│                                     │
│   原始图片     ────→    修复后图片    │
└─────────────────────────────────────┘
```

</div>

## 🚀 快速开始

### 方式一：GitHub Pages 部署（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/你的用户名/你的仓库名.git

# 2. 推送到 GitHub
git add .
git commit -m "初始化 AI Canvas"
git push origin main

# 3. 仓库 Settings → Pages → 选择 main 分支 / (root) 目录 → Save
# 4. 完成！访问 https://你的用户名.github.io/仓库名/
```

### 方式二：本地运行

项目为静态文件，任意 HTTP 服务器均可运行：

```bash
# Python 方式
cd AI-Canvas
python -m http.server 8080
# 浏览器打开 http://localhost:8080

# 或者使用 Node.js
npx serve .
```

### 方式三：从源码构建（开发者）

```bash
cd inpaint-web-main

# 安装依赖（推荐使用国内镜像源）
npm install --registry=https://registry.npmmirror.com

# 构建项目
npm run fast-build

# 复制构建产物到上级 assets 目录（Windows）
Copy-Item -Path "dist\assets\*" -Destination "..\assets\" -Force

# 或（Linux/Mac）
cp -r dist/assets/* ../assets/
```

## 🏗️ 技术栈

<div align="center">

| 技术 | 用途 |
|-----|------|
| **React 18** | 用户界面框架 |
| **TypeScript** | 类型安全 |
| **Vite** | 构建工具 |
| **Tailwind CSS** | 样式框架 |
| **ONNX Runtime** | 浏览器端 AI 模型推理 |
| **COI Service Worker** | 跨域隔离支持 |

</div>

## 📁 项目结构

```
AI-Canvas/
├── index.html              # 入口页面
├── assets/                 # 构建后的 JS/CSS 文件
│   ├── index-CpmYIc8j.js  # 应用逻辑
│   └── index-vynsZj7F.css # 基础样式
├── migan_pipeline_v2.onnx  # 本地 ONNX 模型文件（~154MB）
├── tech-styles.css         # 毛玻璃科技风样式
├── custom-title.js         # 界面增强脚本
├── coi-serviceworker.js    # 跨域隔离服务工作者
├── inpaint-web-main/       # 源代码目录
│   ├── src/                # React/TypeScript 源码
│   ├── package.json        # 项目配置
│   └── ...                 # 其他源代码文件
├── examples/               # 示例图片
│   ├── bag.jpeg
│   ├── bird.jpeg
│   ├── car.jpeg
│   ├── dog.jpeg
│   ├── jacket.jpeg
│   ├── paris.jpeg
│   ├── shoe.jpeg
│   └── table.jpeg
└── README.md               # 项目说明
```

## 📖 使用指南

### 🎯 模型加载策略

本项目采用**三级缓存机制**，优先使用本地模型：

```
1️⃣ 浏览器 IndexedDB 缓存（最高优先级，毫秒级读取）
   ↓ (如果没有)
2️⃣ 本地文件 migan_pipeline_v2.onnx（自动预加载到缓存）
   ↓ (如果本地也没有)
3️⃣ 远程下载 HuggingFace 模型（需要联网）
```

**优势：**
- ✅ 首次访问后自动缓存，后续秒开
- ✅ 支持离线使用（无需联网）
- ✅ 隐私保护（模型不上传）

### 🖼️ 操作步骤

```
1️⃣  打开页面 → 点击上传或拖拽图片
2️⃣  使用画笔涂抹想要修复的区域
3️⃣  点击"开始修复"按钮
4️⃣  等待 AI 自动完成修复
5️⃣  下载修复后的图片
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## ⭐ 支持项目

<div align="center">

如果这个项目对你有帮助，欢迎通过以下方式支持：

<table>
  <tr>
    <td align="center" width="220">
      <img src="examples/wechat-qr.png" width="180" alt="微信赞赏码" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
      <br>
      <b>☕ 微信赞赏</b>
    </td>
    <td align="center" width="220">
      <img src="examples/alipay-qr.jpg" width="180" alt="支付宝赞赏码" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 180, 219, 0.4);">
      <br>
      <b>💎 支付宝赞赏</b>
    </td>
  </tr>
</table>

**也可以通过以下方式支持：**
- ⭐ 在 GitHub 上给本项目点 Star
- 🔄 分享给更多有需要的人
- 🐛 提交 Issue 反馈问题或建议

</div>

---

<div align="center">

### ⭐ Star History

<p align="center">
  <img src="https://api.star-history.com/svg?repos=sdlw7757/AI-Canvas&type=Date" alt="Star History Chart" width="600">
</p>

---

**Made with ❤️ by AI Canvas**

</div>
