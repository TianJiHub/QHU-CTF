# 🚀 快速开始指南

> 5分钟快速上手 QHU-CTF Learn Platform

## 📋 准备工作

### 系统要求
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **浏览器**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Node.js**: >= 14.0.0 (可选，用于开发)
- **Git**: 最新版本

### 检查环境
```bash
# 检查 Node.js 版本
node --version

# 检查 Git 版本
git --version

# 检查浏览器版本
# 在浏览器地址栏输入: chrome://version/ 或 about:version
```

## 🎯 方式一：直接使用（推荐新手）

### 1. 下载项目
```bash
# 方式1: 使用 Git 克隆
git clone https://github.com/your-repo/qhu-ctf-learn.git
cd qhu-ctf-learn/learn

# 方式2: 下载 ZIP 文件
# 访问 GitHub 页面，点击 "Code" -> "Download ZIP"
# 解压到本地目录
```

### 2. 启动服务
```bash
# 方式1: 使用 Python (推荐)
python -m http.server 8000

# 方式2: 使用 Node.js
npx http-server -p 8000

# 方式3: 使用 PHP
php -S localhost:8000
```

### 3. 访问应用
打开浏览器，访问：`http://localhost:8000`

### 4. 开始使用
- 首页：`http://localhost:8000/src/pages/core/index.html`
- 登录页：`http://localhost:8000/src/pages/core/login.html`
- 题目列表：`http://localhost:8000/src/pages/core/challenges.html`

## 🛠️ 方式二：开发模式（推荐开发者）

### 1. 安装依赖
```bash
# 进入项目目录
cd qhu-ctf-learn/learn

# 安装开发依赖
npm install

# 或使用 yarn
yarn install
```

### 2. 启动开发服务器
```bash
# 使用 npm
npm start

# 使用 yarn
yarn start

# 使用 live-server (需要全局安装)
npm install -g live-server
live-server --port=8000 --open=src/pages/core/
```

### 3. 开发工具配置
```bash
# 安装代码检查工具
npm install -g eslint prettier

# 配置 Git hooks (可选)
npm install -g husky lint-staged
```

## 📱 功能导览

### 🏠 主要页面

#### 核心功能页面
- **首页** (`src/pages/core/index.html`) - 平台首页和导航
- **登录页** (`src/pages/core/login.html`) - 用户登录界面
- **注册页** (`src/pages/core/register.html`) - 用户注册界面
- **题目列表** (`src/pages/core/challenges.html`) - CTF 题目浏览
- **排行榜** (`src/pages/core/leaderboard.html`) - 用户排名展示

#### 信息展示页面
- **关于我们** (`src/pages/info/about.html`) - 平台介绍
- **帮助中心** (`src/pages/info/help.html`) - 使用帮助
- **联系我们** (`src/pages/info/contact.html`) - 联系方式
- **隐私政策** (`src/pages/info/privacy.html`) - 隐私条款
- **服务条款** (`src/pages/info/terms.html`) - 使用条款
- **FAQ** (`src/pages/info/faq.html`) - 常见问题

#### 管理员页面
- **管理面板** (`src/pages/admin/dashboard.html`) - 管理总览
- **用户管理** (`src/pages/admin/users.html`) - 用户管理
- **题目管理** (`src/pages/admin/challenges.html`) - 题目管理
- **系统设置** (`src/pages/admin/settings.html`) - 系统配置

### 🎮 基本使用流程

#### 新用户注册
1. 访问注册页面：`/src/pages/core/register.html`
2. 填写用户信息（用户名、邮箱、密码）
3. 点击"注册"按钮
4. 验证邮箱（如果启用）
5. 登录系统

#### 开始学习
1. 登录系统：`/src/pages/core/login.html`
2. 浏览题目：`/src/pages/core/challenges.html`
3. 选择适合的题目类型：
   - **Web**: Web 安全相关题目
   - **Pwn**: 二进制漏洞利用
   - **Crypto**: 密码学题目
   - **Reverse**: 逆向工程
   - **Misc**: 杂项题目
4. 提交答案并获得分数
5. 查看排行榜：`/src/pages/core/leaderboard.html`

#### 团队协作
1. 创建或加入团队
2. 与队友协作解题
3. 分享解题思路和方法
4. 参与团队排名竞争

## 🔧 自定义配置

### 修改配置文件

#### 项目配置 (`project.json`)
```json
{
  "name": "QHU-CTF Learn Platform",
  "version": "2.0.0",
  "description": "CTF 学习平台",
  "author": "sunsky",
  "homepage": "http://localhost:8000",
  "repository": "https://github.com/your-repo/qhu-ctf-learn"
}
```

#### 构建配置 (`build.config.json`)
```json
{
  "build": {
    "source": "src/",
    "output": "dist/",
    "assets": "src/assets/",
    "optimize": true,
    "minify": false
  },
  "server": {
    "port": 8000,
    "host": "localhost",
    "open": true
  }
}
```

### 自定义样式
```css
/* 在 src/assets/css/custom.css 中添加自定义样式 */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
}
```

### 添加新页面
1. 在 `src/pages/` 对应目录下创建 HTML 文件
2. 引入必要的 CSS 和 JS 文件
3. 更新导航菜单
4. 测试页面功能

## 🚨 常见问题解决

### 问题1: 服务器启动失败
```bash
# 错误: Port 8000 is already in use
# 解决方案1: 更换端口
python -m http.server 8080

# 解决方案2: 查找并关闭占用端口的进程
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

### 问题2: 页面样式异常
```bash
# 检查文件路径是否正确
# 确保 CSS 文件路径正确引用
# 检查浏览器控制台是否有错误信息
```

### 问题3: JavaScript 功能不工作
```bash
# 检查浏览器控制台错误信息
# 确保 JavaScript 文件正确加载
# 检查文件路径和语法错误
```

### 问题4: 跨域问题
```bash
# 使用本地服务器而不是直接打开 HTML 文件
# 确保所有资源通过 HTTP/HTTPS 协议访问
```

## 📈 性能优化建议

### 开发环境优化
1. **使用现代浏览器**：Chrome DevTools 进行调试
2. **启用缓存**：配置浏览器缓存策略
3. **压缩资源**：使用构建工具压缩 CSS/JS
4. **图片优化**：使用适当格式和尺寸的图片

### 生产环境优化
1. **启用 Gzip 压缩**
2. **配置 CDN 加速**
3. **使用缓存策略**
4. **监控性能指标**

## 🔐 安全注意事项

### 开发安全
- 不要在代码中硬编码敏感信息
- 使用 HTTPS 协议（生产环境）
- 定期更新依赖包
- 进行安全代码审查

### 部署安全
- 配置适当的 CORS 策略
- 启用安全头部（CSP、HSTS 等）
- 定期备份数据
- 监控安全日志

## 📞 获取帮助

### 文档资源
- [项目结构说明](PROJECT-STRUCTURE.md)
- [开发指南](DEVELOPMENT-GUIDE.md)
- [API 参考](API-REFERENCE.md)
- [编码规范](CODING-STANDARDS.md)

### 社区支持
- **GitHub Issues**: 报告问题和建议
- **讨论区**: 技术交流和经验分享
- **QQ群**: 123456789
- **微信群**: 扫码加入

### 联系方式
- **邮箱**: support@qhu-ctf.com
- **项目维护者**: sunsky
- **技术支持**: 工作日 9:00-18:00

## 🎉 下一步

恭喜！你已经成功启动了 QHU-CTF Learn Platform。现在你可以：

1. **🎯 开始学习**: 浏览题目并开始解题
2. **👥 加入团队**: 与其他学习者协作
3. **📚 查看文档**: 深入了解平台功能
4. **🛠️ 参与开发**: 为项目贡献代码
5. **💬 加入社区**: 与其他用户交流经验

### 推荐学习路径
1. **新手入门**: Web 安全基础 → 简单的 Web 题目
2. **进阶学习**: 密码学基础 → Crypto 题目
3. **高级挑战**: 二进制分析 → Pwn 题目
4. **综合应用**: 参与 CTF 竞赛

---

**🎊 祝你学习愉快！如有问题，随时查阅文档或联系我们。**