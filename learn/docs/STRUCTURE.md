# QHU-CTF Learn 模块 - 项目结构说明

## 📁 目录结构

```
learn/
├── src/                    # 源代码目录
│   ├── pages/             # 页面文件
│   │   ├── core/          # 核心功能页面
│   │   ├── admin/         # 管理功能页面
│   │   └── info/          # 信息展示页面
│   └── assets/            # 静态资源
│       ├── css/           # 样式文件
│       ├── js/            # JavaScript文件
│       └── images/        # 图片资源
├── tools/                 # 开发工具
│   ├── build/             # 构建工具
│   ├── test/              # 测试工具
│   └── docs/              # 文档工具
├── docs/                  # 项目文档
├── reports/               # 测试报告
├── dist/                  # 构建输出
├── project.json           # 项目配置
└── build.config.json      # 构建配置
```

## 🎯 设计原则

1. **关注点分离**: 页面、样式、脚本、工具分别管理
2. **功能分组**: 按功能将页面分为核心、管理、信息三类
3. **工具分类**: 构建、测试、文档工具独立管理
4. **配置驱动**: 使用配置文件管理项目设置

## 📋 文件分类

### 页面文件 (src/pages/)
- **core/**: 核心功能页面 (首页、登录、注册、题目、个人中心)
- **admin/**: 管理功能页面 (管理面板、题目详情、提交、排行榜)
- **info/**: 信息展示页面 (帮助、隐私、条款、登出等)

### 静态资源 (src/assets/)
- **css/**: 所有样式文件
- **js/**: JavaScript脚本文件
- **images/**: 图片资源文件

### 开发工具 (tools/)
- **build/**: 构建和部署相关工具
- **test/**: 测试和验证工具
- **docs/**: 文档生成和更新工具

## 🚀 使用方法

### 开发模式
```bash
# 应用样式
npm run build

# 运行测试
npm run test

# 更新文档
npm run update-docs
```

### 构建部署
```bash
# 构建到dist目录
node tools/build/apply-styles.js
```

---
**更新时间**: 2025/9/19
**作者**: sunsky
