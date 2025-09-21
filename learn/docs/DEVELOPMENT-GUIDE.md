# QHU-CTF Learn 模块 - 开发指南

**作者**: sunsky  
**版本**: 2.0.0  
**更新时间**: 2025/9/19  
**适用范围**: 开发人员、维护人员

## 📖 目录

- [环境配置](#-环境配置)
- [开发流程](#-开发流程)
- [工具使用](#-工具使用)
- [代码规范](#-代码规范)
- [测试指南](#-测试指南)
- [部署流程](#-部署流程)
- [常见问题](#-常见问题)

## 🛠️ 环境配置

### 系统要求
- **操作系统**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- **Node.js**: >= 14.0.0 (推荐 16.x 或 18.x)
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **编辑器**: VS Code (推荐), WebStorm, Sublime Text

### 开发环境搭建

#### 1. 克隆项目
```bash
git clone [项目地址]
cd QHU-CTF/learn
```

#### 2. 安装 Node.js 依赖（如果有）
```bash
# 检查 Node.js 版本
node --version
npm --version

# 如果项目有 package.json
npm install
```

#### 3. 验证环境
```bash
# 运行环境检查
node tools/test/check-interactions.js

# 应该看到类似输出：
# ✅ 环境检查通过
# ✅ 所有页面文件存在
# ✅ 样式文件完整
```

## 🔄 开发流程

### 标准开发流程

#### 1. 功能开发前准备
```bash
# 1. 创建功能分支
git checkout -b feature/new-feature-name

# 2. 检查当前项目状态
node tools/test/check-interactions.js

# 3. 备份重要文件（可选）
cp -r src/ backup/src-$(date +%Y%m%d)/
```

#### 2. 开发阶段
```bash
# 开发过程中定期运行检查
node tools/test/check-interactions.js

# 应用样式更新
node tools/build/apply-styles.js

# 更新项目信息
node tools/build/update-project-info.js
```

#### 3. 开发完成后
```bash
# 1. 运行完整测试
node tools/test/check-interactions.js

# 2. 优化脚本代码
node tools/build/optimize-scripts.js

# 3. 批量更新所有页面
node tools/build/batch-update.js

# 4. 更新文档
node tools/docs/update-docs.js

# 5. 提交代码
git add .
git commit -m "feat: 添加新功能 - 功能描述"
git push origin feature/new-feature-name
```

### 快速开发模式

对于小型修改，可以使用快速模式：

```bash
# 一键应用所有更新
npm run build  # 或 node tools/build/batch-update.js

# 一键检查所有功能
npm run test   # 或 node tools/test/check-interactions.js
```

## 🧰 工具使用

### 1. 样式应用工具 (apply-styles.js)

**功能**: 自动将 CSS 样式应用到所有 HTML 页面

```bash
# 基本使用
node tools/build/apply-styles.js

# 查看详细日志
node tools/build/apply-styles.js --verbose

# 只应用特定样式
node tools/build/apply-styles.js --style=theme
```

**配置选项**:
```javascript
// 在 build.config.json 中配置
{
  "styles": {
    "common": true,      // 应用通用样式
    "responsive": true,  // 应用响应式样式
    "theme": true       // 应用主题样式
  }
}
```

### 2. 交互检查工具 (check-interactions.js)

**功能**: 检查所有页面的交互功能和链接有效性

```bash
# 完整检查
node tools/test/check-interactions.js

# 只检查特定页面类型
node tools/test/check-interactions.js --pages=core

# 生成详细报告
node tools/test/check-interactions.js --report=detailed
```

**检查项目**:
- 页面文件存在性
- CSS/JS 文件引用
- 内部链接有效性
- 表单元素完整性
- 导航栏一致性

### 3. 批量更新工具 (batch-update.js)

**功能**: 批量更新页面内容、导航栏、项目信息

```bash
# 更新所有内容
node tools/build/batch-update.js

# 只更新导航栏
node tools/build/batch-update.js --component=navbar

# 只更新项目信息
node tools/build/batch-update.js --component=project-info
```

### 4. 脚本优化工具 (optimize-scripts.js)

**功能**: 优化现有脚本，添加错误处理、日志记录等

```bash
# 优化所有脚本
node tools/build/optimize-scripts.js

# 查看优化报告
cat reports/script-optimization-report.json
```

### 5. 文档更新工具 (update-docs.js)

**功能**: 自动更新项目文档和 README

```bash
# 更新所有文档
node tools/docs/update-docs.js

# 只更新 README
node tools/docs/update-docs.js --doc=readme

# 生成新的结构文档
node tools/docs/update-docs.js --doc=structure
```

## 📝 代码规范

### HTML 规范

#### 1. 文档结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题 - QHU-CTF</title>
    <!-- CSS 引用 -->
    <link rel="stylesheet" href="../assets/css/common-styles.css">
    <link rel="stylesheet" href="../assets/css/responsive.css">
    <link rel="stylesheet" href="../assets/css/theme.css">
</head>
<body>
    <!-- 页面内容 -->
    
    <!-- JS 引用 -->
    <script src="../assets/js/common-scripts.js"></script>
</body>
</html>
```

#### 2. 命名规范
- **ID**: 使用 camelCase，如 `userProfile`
- **Class**: 使用 kebab-case，如 `nav-item`
- **文件名**: 使用 kebab-case，如 `admin-users.html`

#### 3. 语义化标签
```html
<!-- 推荐 -->
<nav class="main-nav">
    <ul class="nav-list">
        <li class="nav-item"><a href="index.html">首页</a></li>
    </ul>
</nav>

<main class="content">
    <section class="hero-section">
        <h1>页面标题</h1>
    </section>
</main>

<!-- 避免 -->
<div class="nav">
    <div class="nav-item">首页</div>
</div>
```

### CSS 规范

#### 1. 选择器命名
```css
/* 组件命名 */
.nav-bar { }
.nav-bar__item { }
.nav-bar__item--active { }

/* 工具类命名 */
.text-center { }
.mb-4 { }
.btn-primary { }

/* 状态类命名 */
.is-active { }
.is-hidden { }
.has-error { }
```

#### 2. 属性顺序
```css
.example {
    /* 定位 */
    position: relative;
    top: 0;
    left: 0;
    
    /* 盒模型 */
    display: block;
    width: 100%;
    height: auto;
    margin: 0;
    padding: 10px;
    
    /* 视觉 */
    background: #fff;
    border: 1px solid #ccc;
    color: #333;
    font-size: 14px;
    
    /* 其他 */
    transition: all 0.3s ease;
}
```

### JavaScript 规范

#### 1. 变量命名
```javascript
// 常量：大写下划线
const API_BASE_URL = 'https://api.example.com';

// 变量：camelCase
const userName = 'admin';
const isLoggedIn = true;

// 函数：camelCase，动词开头
function getUserInfo() { }
function validateForm() { }

// 类：PascalCase
class UserManager { }
```

#### 2. 函数规范
```javascript
/**
 * 获取用户信息
 * @param {string} userId - 用户ID
 * @param {Object} options - 选项配置
 * @returns {Promise<Object>} 用户信息
 */
async function getUserInfo(userId, options = {}) {
    try {
        // 参数验证
        if (!userId) {
            throw new Error('用户ID不能为空');
        }
        
        // 业务逻辑
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        
        return userData;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
    }
}
```

## 🧪 测试指南

### 功能测试

#### 1. 页面加载测试
```bash
# 检查所有页面是否正常加载
node tools/test/check-interactions.js

# 检查特定页面
node tools/test/check-interactions.js --page=login.html
```

#### 2. 样式测试
```bash
# 检查样式是否正确应用
node tools/build/apply-styles.js --test-mode

# 检查响应式设计
# 在浏览器中使用开发者工具测试不同屏幕尺寸
```

#### 3. 交互测试
```bash
# 检查表单交互
node tools/test/check-interactions.js --component=forms

# 检查导航交互
node tools/test/check-interactions.js --component=navigation
```

### 性能测试

#### 1. 页面加载速度
```javascript
// 在浏览器控制台中运行
console.time('页面加载时间');
window.addEventListener('load', () => {
    console.timeEnd('页面加载时间');
});
```

#### 2. 资源优化检查
```bash
# 检查 CSS 文件大小
ls -la src/assets/css/

# 检查 JS 文件大小
ls -la src/assets/js/
```

### 兼容性测试

#### 浏览器兼容性
- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

#### 设备兼容性
- **桌面**: 1920x1080, 1366x768 ✅
- **平板**: 768x1024, 1024x768 ✅
- **手机**: 375x667, 414x896 ✅

## 🚀 部署流程

### 开发环境部署

#### 1. 本地开发服务器
```bash
# 使用 Python 简单服务器
cd src/pages/core/
python -m http.server 8000

# 或使用 Node.js 服务器
npx http-server src/pages/core/ -p 8000

# 访问 http://localhost:8000
```

#### 2. 实时预览
```bash
# 使用 Live Server (VS Code 插件)
# 右键 HTML 文件 -> Open with Live Server
```

### 生产环境部署

#### 1. 构建优化
```bash
# 运行完整构建流程
node tools/build/batch-update.js
node tools/build/optimize-scripts.js
node tools/docs/update-docs.js

# 检查构建结果
node tools/test/check-interactions.js
```

#### 2. 文件压缩
```bash
# 压缩 CSS 文件
npx cleancss -o dist/css/styles.min.css src/assets/css/*.css

# 压缩 JS 文件
npx uglifyjs src/assets/js/*.js -o dist/js/scripts.min.js
```

#### 3. 部署到服务器
```bash
# 使用 rsync 同步文件
rsync -avz --delete src/ user@server:/var/www/qhu-ctf/learn/

# 或使用 SCP
scp -r src/ user@server:/var/www/qhu-ctf/learn/
```

## ❓ 常见问题

### Q1: 样式没有正确应用怎么办？

**A**: 
```bash
# 1. 检查样式文件路径
node tools/test/check-interactions.js

# 2. 重新应用样式
node tools/build/apply-styles.js

# 3. 清除浏览器缓存
# Ctrl+F5 或 Cmd+Shift+R
```

### Q2: 页面链接跳转失败？

**A**:
```bash
# 1. 检查链接有效性
node tools/test/check-interactions.js

# 2. 修复链接问题
node tools/test/fix-interactions.js

# 3. 重新检查
node tools/test/check-interactions.js
```

### Q3: 工具脚本执行失败？

**A**:
```bash
# 1. 检查 Node.js 版本
node --version  # 应该 >= 14.0.0

# 2. 检查文件权限
ls -la tools/build/

# 3. 查看详细错误日志
node tools/build/apply-styles.js 2>&1 | tee error.log
```

### Q4: 如何添加新页面？

**A**:
1. 在相应目录创建 HTML 文件
2. 运行样式应用工具：`node tools/build/apply-styles.js`
3. 更新导航栏：`node tools/build/batch-update.js`
4. 检查功能：`node tools/test/check-interactions.js`

### Q5: 如何修改主题样式？

**A**:
1. 编辑 `src/assets/css/theme.css`
2. 应用样式：`node tools/build/apply-styles.js`
3. 测试深浅主题切换功能

## 📚 参考资源

### 官方文档
- [HTML5 规范](https://html.spec.whatwg.org/)
- [CSS3 规范](https://www.w3.org/Style/CSS/)
- [JavaScript ES6+ 规范](https://tc39.es/ecma262/)

### 开发工具
- [VS Code](https://code.visualstudio.com/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Node.js](https://nodejs.org/)

### 在线资源
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/)
- [W3C Validator](https://validator.w3.org/)

## 📞 技术支持

如遇到问题或需要帮助：

1. **查看日志文件**: `reports/*.log`
2. **运行诊断工具**: `node tools/test/check-interactions.js`
3. **联系开发团队**: [待补充联系方式]

---

*本指南由 QHU-CTF Learn 模块维护，最后更新: 2025/1/10*