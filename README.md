<div align="center">

# 🎨 AI Canvas

> **智能图片修复工具** — 基于 AI 的图片去水印、修复与增强

<p align="center">
  <img src="https://img.shields.io/badge/版本-1.0.0-blue?style=flat-square" alt="版本">
  <img src="https://img.shields.io/badge/框架-React%20%2B%20TypeScript-61DAFB?style=flat-square"&logo=react" alt="框架">
  <img src="https://img.shields.io/badge/模型-ONNX%20Runtime-005FFF?style=flat-square"&logo=onnx" alt="模型">
  <img src="https://img.shields.io/badge/构建-Vite-646CFF?style=flat-square&logo=vite" alt="构建">
</段>

---


</div>

##✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🖱️ **智能涂抹** | 标记需要修复的区域，AI 自动补全 |
| 🎯 **精准修复** | 基于深度学习的高精度图片修复 |
| ⚡ **本地运行** | 纯浏览器端推理，图片不上传服务器 |
| 🔒 **隐私安全** | 所有计算在本地完成，数据不外泄 |
| 🎨 **毛玻璃界面** | 科技感毛玻璃风格，视觉体验舒适 |
| 🚀 **本地模型优先** | 自动缓存 ONNX 模型，离线也能使用 |

## 🚀 Demo 演示
✅ **在线演示地址：** [https://5257.cc.cd/](https://5257.cc.cd/)
## 🖼️ 使用效果



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
git 添加所有更改的文件
git commit -m "初始化 AI Canvas"
git 推送 origin main

# 3. 仓库 设置 → 页面 → 选择 main 分支 / (root) 目录 → 保存
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
# 1. 进入源码目录
cd AI-Canvas

# 2. 安装依赖（推荐使用国内镜像源）
npm install --registry=https://registry.npmmirror.com

# 3. 构建项目
npm run fast-build
```

构建完成后，需要手动更新部署文件：

```bash
# 4. 复制新构建产物到上级 assets 目录（Windows PowerShell）
Copy-Item -Path "dist\assets\*" -Destination "..\assets\" -Force

# 或（Linux/Mac）
cp -r dist/assets/* ../assets/

# 5. 删除旧的构建文件（Windows PowerShell）
Remove-Item "..\assets\index-BS1F7oDB.js" -ErrorAction SilentlyContinue
Remove-Item "..\assets\index-MjUF6Gs6.css" -ErrorAction SilentlyContinue

# 或（Linux/Mac）
rm -f ../assets/index-BS1F7oDB.js ../assets/index-MjUF6Gs6.css

# 6. 更新 index.html 中的资源引用
# 将 index.html 中的 JS/CSS 文件名替换为 dist/assets/ 下的新文件名
# 例如：index-CpmYIc8j.js → 新的文件名
```

### 方式四：Cloudflare Pages + R2 部署（⚡ 高性能推荐）

> **全球 CDN 加速，首次加载 1-3 秒！**

#### 📋 架构概览

```
用户浏览器
    ↓
Cloudflare Pages (静态网站)
    ↓ (首次加载)
Cloudflare Worker (API 网关)
    ↓
Cloudflare R2 (对象存储) ← 存放 ONNX 模型
    ↓
Cache API (全球边缘缓存)
    ↓
用户浏览器 IndexedDB (永久缓存)
```

#### 🚀 部署步骤

**1️⃣ 创建 Cloudflare 账号并安装工具**

```bash
# 访问 https://dash.cloudflare.com/sign-up 注册账号

# 安装 wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

**2️⃣ 配置 R2 对象存储**

```bash
# 创建 R2 存储桶
wrangler r2 bucket create ai-canvas-models

# 上传模型文件 (~27MB)
wrangler r2 object put ai-canvas-models/migan_pipeline_v2.onnx --file=migan_pipeline_v2.onnx
```

或通过 Dashboard 操作：
1. 左侧菜单 → **R2 对象存储**
2. 点击 **创建存储桶** → 名称：`ai-canvas-models` → 选择 **APAC (亚太)** 区域
3. 上传 `migan_pipeline_v2.onnx` 文件
4. 设置 → **公开访问** → 启用（可选）

**3️⃣ 部署 Worker（API 网关）**

项目已包含 [worker.js](worker.js) 和 [wrangler.toml](wrangler.toml)，直接执行：

```bash
# 部署 Worker
wrangler deploy
```

Worker 会自动绑定到 R2 存储桶，URL 格式：
```
https://ai-canvas-model-proxy.<your-subdomain>.workers.dev
```

**4️⃣ 连接 GitHub 到 Cloudflare Pages**

1. Cloudflare Dashboard → **Workers & Pages**
2. 点击 **创建** → **Pages** → **连接到 Git**
3. 选择 GitHub 仓库：`sdlw7757/AI-Canvas`
4. 配置构建设置：
   - **框架预设**: None
   - **构建命令**: （留空）
   - **构建输出目录**: `/` 或 `.`
5. 点击 **保存并部署**

**5️⃣ 更新前端配置**

编辑 [custom-title.js](custom-title.js) 第 9 行，将 `your-subdomain` 替换为实际的 Workers 子域名：

```javascript
url: 'https://ai-canvas-model-proxy.your-subdomain.workers.dev/migan_pipeline_v2.onnx',
```

**6️⃣ 提交并推送**

```bash
git add .
git commit -m "feat: Add Cloudflare R2/Worker support"
git push origin master
```

Cloudflare Pages 会自动重新部署。

---

#### ✅ 性能优化效果

| 指标 | 传统方式 | Cloudflare 方式 |
|------|---------|----------------|
| **首次加载速度** | 5-15 秒 | **1-3 秒** ⚡ |
| **全球覆盖** | 单点服务器 | **300+ 边缘节点** |
| **缓存策略** | 仅浏览器 | **边缘 + 浏览器双层** |
| **可用性** | 99.9% | **99.99%+** |

#### 💰 成本估算（完全免费 💚）

| 服务 | 免费额度 | 你的预估用量 | 是否够用 |
|------|---------|-------------|----------|
| **R2 存储** | 10 GB/月 | ~27 MB | ✅ 够用 |
| **R2 Class A 操作** | 1000 万次/月 | < 100 次 | ✅ 够用 |
| **Workers 请求** | 10 万次/天 | < 1 万次/天 | ✅ 够用 |
| **Pages 构建** | 500 次/月 | < 50 次/月 | ✅ 够用 |

#### 🔧 高级配置（可选）

**自定义域名** - 编辑 [wrangler.toml](wrangler.toml)：
```toml
[routes]
pattern = "model.yourdomain.com"
custom_domain = true
```

**CDN 缓存调优** - 编辑 [worker.js](worker.js)：
```javascript
'Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000',
// 缓存 7 天 + 后台刷新 30 天
```

#### 🐛 故障排查

<details>
<summary>🔧 常见问题与解决方法</summary>

**问题 1: Worker 返回 404**
- **原因**: R2 中没有上传模型文件
- **解决**: 
  ```bash
  wrangler r2 object list ai-canvas-models
  wrangler r2 object put ai-canvas-models/migan_pipeline_v2.onnx --file=migan_pipeline_v2.onnx
  ```

**问题 2: CORS 错误**
- **解决**: Worker 已设置 `Access-Control-Allow-Origin: *`，检查浏览器控制台具体错误信息。

**问题 3: 模型下载慢**
- **可能原因**: 用户网络慢 / Worker 未启用缓存 / R2 存储桶位置偏远
- **解决**: 
  - 检查响应头 `X-Cache: HIT` (缓存命中) vs `MISS` (未命中)
  - 确保 R2 存储桶选择 **APAC (亚太)** 区域

</details>

#### 📞 相关资源

- Cloudflare 文档: https://developers.cloudflare.com/
- R2 文档: https://developers.cloudflare.com/r2/
- Workers 文档: https://developers.cloudflare.com/workers/

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
├── migan_pipeline_v2.onnx  # 本地 ONNX 模型文件（~27MB）
├── tech-styles.css         # 毛玻璃科技风样式
├── custom-title.js         # 界面增强脚本（多源模型加载）
├── coi-serviceworker.js    # 跨域隔离服务工作者
├── worker.js               # Cloudflare Worker (R2 API 网关 + 缓存)
├── wrangler.toml           # Cloudflare Worker 配置
├── AI-Canvas/              # 源代码目录
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
