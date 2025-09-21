# QHU-CTF Learn 模块 - 项目结构文档

**作者**: sunsky  
**版本**: 2.0.0  
**更新时间**: 2025/9/19  
**项目状态**: 生产就绪

## 📋 项目概述

QHU-CTF Learn 模块是 QHU-CTF 竞赛平台的学习子系统，提供完整的前端页面、样式系统、交互脚本和开发工具。本模块采用现代化的目录结构，遵循最佳实践，确保代码的可维护性和扩展性。

## 🏗️ 目录结构

```
learn/
├── 📁 src/                          # 源代码目录
│   ├── 📁 assets/                   # 静态资源
│   │   ├── 📁 css/                  # 样式文件
│   │   │   ├── common-styles.css    # 通用样式
│   │   │   ├── responsive.css       # 响应式样式
│   │   │   └── theme.css           # 主题样式
│   │   ├── 📁 js/                   # JavaScript 脚本
│   │   │   └── common-scripts.js    # 通用脚本
│   │   └── 📁 images/               # 图片资源（预留）
│   └── 📁 pages/                    # 页面文件
│       ├── 📁 admin/                # 管理页面
│       │   ├── admin.html           # 管理主页
│       │   ├── admin-users.html     # 用户管理
│       │   ├── admin-challenges.html # 题目管理
│       │   └── admin-settings.html  # 系统设置
│       ├── 📁 core/                 # 核心功能页面
│       │   ├── index.html           # 首页
│       │   ├── login.html           # 登录页
│       │   ├── register.html        # 注册页
│       │   ├── challenges.html      # 题目列表
│       │   └── leaderboard.html     # 排行榜
│       └── 📁 info/                 # 信息页面
│           ├── about.html           # 关于页面
│           ├── help.html            # 帮助页面
│           ├── profile.html         # 个人资料
│           ├── team.html            # 团队页面
│           ├── contact.html         # 联系我们
│           └── rules.html           # 比赛规则
├── 📁 tools/                        # 开发工具
│   ├── 📁 build/                    # 构建工具
│   │   ├── apply-styles.js          # 样式应用工具
│   │   ├── batch-update.js          # 批量更新工具
│   │   ├── optimize-scripts.js      # 脚本优化工具
│   │   └── update-project-info.js   # 项目信息更新
│   ├── 📁 test/                     # 测试工具
│   │   ├── check-interactions.js    # 交互检查工具
│   │   └── fix-interactions.js      # 交互修复工具
│   └── 📁 docs/                     # 文档工具
│       └── update-docs.js           # 文档更新工具
├── 📁 docs/                         # 项目文档
│   ├── PROJECT-STRUCTURE.md         # 项目结构文档（本文件）
│   ├── DEVELOPMENT-GUIDE.md         # 开发指南
│   ├── API-REFERENCE.md             # API 参考
│   └── DEPLOYMENT.md                # 部署指南
├── 📁 reports/                      # 报告文件
│   ├── interaction-check-report.json # 交互检查报告
│   ├── script-optimization-report.json # 脚本优化报告
│   └── *.log                        # 各种日志文件
├── 📄 build.config.json             # 构建配置
├── 📄 project.json                  # 项目配置
├── 📄 README.md                     # 项目说明
└── 📄 *.js                          # 根目录工具脚本
```

## 📂 目录详细说明

### 🎨 src/ - 源代码目录

#### assets/ - 静态资源
- **css/**: 样式文件目录
  - `common-styles.css`: 通用样式，包含基础布局、字体、颜色等
  - `responsive.css`: 响应式样式，适配不同屏幕尺寸
  - `theme.css`: 主题样式，支持深浅主题切换
- **js/**: JavaScript 脚本目录
  - `common-scripts.js`: 通用脚本，包含导航、主题切换等功能
- **images/**: 图片资源目录（预留，用于存放图标、背景等）

#### pages/ - 页面文件
- **admin/**: 管理员页面
  - `admin.html`: 管理员主控制台
  - `admin-users.html`: 用户管理界面
  - `admin-challenges.html`: 题目管理界面
  - `admin-settings.html`: 系统设置界面
- **core/**: 核心功能页面
  - `index.html`: 平台首页
  - `login.html`: 用户登录页面
  - `register.html`: 用户注册页面
  - `challenges.html`: 题目列表页面
  - `leaderboard.html`: 排行榜页面
- **info/**: 信息展示页面
  - `about.html`: 关于平台页面
  - `help.html`: 帮助文档页面
  - `profile.html`: 用户个人资料页面
  - `team.html`: 团队信息页面
  - `contact.html`: 联系我们页面
  - `rules.html`: 比赛规则页面

### 🛠️ tools/ - 开发工具

#### build/ - 构建工具
- `apply-styles.js`: 自动应用样式到所有页面
- `batch-update.js`: 批量更新页面内容和结构
- `optimize-scripts.js`: 优化现有脚本，提高代码质量
- `update-project-info.js`: 更新项目信息和版本号

#### test/ - 测试工具
- `check-interactions.js`: 检查页面交互功能
- `fix-interactions.js`: 自动修复交互问题

#### docs/ - 文档工具
- `update-docs.js`: 自动更新项目文档

### 📚 docs/ - 项目文档
- `PROJECT-STRUCTURE.md`: 项目结构说明（本文件）
- `DEVELOPMENT-GUIDE.md`: 开发指南和最佳实践
- `API-REFERENCE.md`: API 接口参考文档
- `DEPLOYMENT.md`: 部署和运维指南

### 📊 reports/ - 报告文件
- `interaction-check-report.json`: 交互功能检查报告
- `script-optimization-report.json`: 脚本优化报告
- `*.log`: 各种操作的日志文件

## ⚙️ 配置文件

### build.config.json - 构建配置
```json
{
  "input": "src/",
  "output": "dist/",
  "assets": {
    "css": "src/assets/css/",
    "js": "src/assets/js/",
    "images": "src/assets/images/"
  },
  "pages": {
    "core": "src/pages/core/",
    "admin": "src/pages/admin/",
    "info": "src/pages/info/"
  },
  "optimization": {
    "minifyCSS": true,
    "minifyJS": true,
    "optimizeImages": true
  }
}
```

### project.json - 项目配置
```json
{
  "name": "QHU-CTF Learn Module",
  "version": "2.0.0",
  "description": "QHU-CTF 竞赛平台学习模块",
  "author": "sunsky",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/qhu-ctf/learn"
  },
  "scripts": {
    "build": "node tools/build/batch-update.js",
    "test": "node tools/test/check-interactions.js",
    "optimize": "node tools/build/optimize-scripts.js",
    "docs": "node tools/docs/update-docs.js"
  }
}
```

## 🚀 快速开始

### 1. 环境要求
- Node.js >= 14.0.0
- 现代浏览器（Chrome, Firefox, Safari, Edge）

### 2. 安装依赖
```bash
# 进入项目目录
cd learn/

# 如果有 package.json，安装依赖
npm install
```

### 3. 开发模式
```bash
# 应用样式到所有页面
node tools/build/apply-styles.js

# 检查页面交互功能
node tools/test/check-interactions.js

# 批量更新页面内容
node tools/build/batch-update.js
```

### 4. 生产构建
```bash
# 优化所有脚本
node tools/build/optimize-scripts.js

# 更新项目信息
node tools/build/update-project-info.js

# 生成文档
node tools/docs/update-docs.js
```

## 📋 文件命名规范

### HTML 文件
- 使用小写字母和连字符：`admin-users.html`
- 功能明确的命名：`challenges.html`、`leaderboard.html`

### CSS 文件
- 使用小写字母和连字符：`common-styles.css`
- 按功能分类：`responsive.css`、`theme.css`

### JavaScript 文件
- 使用小写字母和连字符：`common-scripts.js`
- 工具脚本使用动词开头：`update-docs.js`、`check-interactions.js`

### 目录命名
- 使用小写字母：`src/`、`tools/`、`docs/`
- 功能分组：`build/`、`test/`、`pages/`

## 🔧 开发工具使用

### 样式应用工具
```bash
node tools/build/apply-styles.js
```
自动将 CSS 样式应用到所有 HTML 页面。

### 交互检查工具
```bash
node tools/test/check-interactions.js
```
检查所有页面的交互功能，生成检查报告。

### 批量更新工具
```bash
node tools/build/batch-update.js
```
批量更新页面内容、导航栏、项目信息等。

### 脚本优化工具
```bash
node tools/build/optimize-scripts.js
```
优化现有脚本，添加错误处理、日志记录、进度指示等功能。

## 📈 项目统计

- **总页面数**: 18 个
- **样式文件**: 3 个
- **脚本文件**: 7 个
- **工具脚本**: 6 个
- **文档文件**: 4 个

## 🎯 下一步计划

1. **后端集成**: 连接后端 API，实现数据交互
2. **用户认证**: 完善登录注册功能
3. **题目系统**: 实现题目展示和提交功能
4. **实时排行榜**: 添加实时更新的排行榜
5. **团队功能**: 完善团队管理和协作功能

## 📞 技术支持

如有问题或建议，请联系：
- **作者**: sunsky
- **邮箱**: [待补充]
- **项目地址**: [待补充]

---

*本文档由 QHU-CTF Learn 模块自动生成，最后更新时间: 2025/1/10*