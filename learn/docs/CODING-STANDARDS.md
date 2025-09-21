# QHU-CTF Learn 模块 - 编码规范

**作者**: sunsky  
**版本**: 2.0.0  
**更新时间**: 2025/1/10  
**适用范围**: 前端开发、后端API、脚本工具

## 📋 目录

- [通用规范](#-通用规范)
- [HTML 规范](#-html-规范)
- [CSS 规范](#-css-规范)
- [JavaScript 规范](#-javascript-规范)
- [文件命名规范](#-文件命名规范)
- [注释规范](#-注释规范)
- [版本控制规范](#-版本控制规范)
- [代码审查规范](#-代码审查规范)

## 🌟 通用规范

### 基本原则

1. **可读性优先**: 代码应该易于理解和维护
2. **一致性**: 整个项目保持统一的编码风格
3. **简洁性**: 避免冗余代码，保持简洁明了
4. **安全性**: 始终考虑安全因素，防范常见漏洞
5. **性能**: 编写高效的代码，避免不必要的性能损耗

### 编码环境

```json
// .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.{js,html,css}]
indent_size = 2

[*.json]
indent_size = 2
```

### 项目结构规范

```
learn/
├── src/                    # 源代码目录
│   ├── assets/            # 静态资源
│   │   ├── css/          # 样式文件
│   │   ├── js/           # JavaScript文件
│   │   └── images/       # 图片资源
│   └── pages/            # 页面文件
│       ├── admin/        # 管理员页面
│       ├── core/         # 核心功能页面
│       └── info/         # 信息展示页面
├── tools/                 # 工具脚本
│   ├── build/            # 构建工具
│   ├── docs/             # 文档生成工具
│   └── test/             # 测试工具
├── docs/                  # 项目文档
├── reports/               # 报告文件
└── config/               # 配置文件
```

## 📄 HTML 规范

### 基本结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="页面描述">
    <meta name="keywords" content="关键词1,关键词2">
    <title>页面标题 - QHU-CTF</title>
    
    <!-- 样式文件 -->
    <link rel="stylesheet" href="../assets/css/common.css">
    <link rel="stylesheet" href="../assets/css/page-specific.css">
</head>
<body>
    <!-- 页面内容 -->
    <header class="header">
        <!-- 导航栏 -->
    </header>
    
    <main class="main-content">
        <!-- 主要内容 -->
    </main>
    
    <footer class="footer">
        <!-- 页脚 -->
    </footer>
    
    <!-- JavaScript文件 -->
    <script src="../assets/js/common.js"></script>
    <script src="../assets/js/page-specific.js"></script>
</body>
</html>
```

### HTML 编码规范

1. **标签和属性**: 使用小写字母
2. **属性值**: 始终使用双引号
3. **自闭合标签**: 在末尾添加空格和斜杠 `<img src="..." alt="..." />`
4. **缩进**: 使用2个空格缩进
5. **语义化**: 使用语义化的HTML标签

```html
<!-- ✅ 正确示例 -->
<article class="challenge-card">
    <header class="challenge-header">
        <h2 class="challenge-title">SQL注入基础</h2>
        <span class="challenge-category">Web</span>
    </header>
    <div class="challenge-content">
        <p class="challenge-description">
            这是一道关于SQL注入的基础题目...
        </p>
    </div>
    <footer class="challenge-footer">
        <button type="button" class="btn btn-primary">
            开始挑战
        </button>
    </footer>
</article>

<!-- ❌ 错误示例 -->
<div class="challenge">
    <div class="title">SQL注入基础</div>
    <div class="category">Web</div>
    <div class="desc">这是一道关于SQL注入的基础题目...</div>
    <div class="actions">
        <button onclick="startChallenge()">开始挑战</button>
    </div>
</div>
```

### 表单规范

```html
<form class="form" id="loginForm" novalidate>
    <div class="form-group">
        <label for="username" class="form-label">
            用户名 <span class="required">*</span>
        </label>
        <input 
            type="text" 
            id="username" 
            name="username" 
            class="form-input" 
            required 
            autocomplete="username"
            placeholder="请输入用户名"
            aria-describedby="username-error"
        />
        <div id="username-error" class="form-error" role="alert"></div>
    </div>
    
    <div class="form-group">
        <label for="password" class="form-label">
            密码 <span class="required">*</span>
        </label>
        <input 
            type="password" 
            id="password" 
            name="password" 
            class="form-input" 
            required 
            autocomplete="current-password"
            placeholder="请输入密码"
            aria-describedby="password-error"
        />
        <div id="password-error" class="form-error" role="alert"></div>
    </div>
    
    <button type="submit" class="btn btn-primary btn-block">
        登录
    </button>
</form>
```

## 🎨 CSS 规范

### 基本规范

1. **选择器**: 使用小写字母和连字符
2. **属性顺序**: 按照逻辑分组排列
3. **缩进**: 使用2个空格缩进
4. **分号**: 每个属性声明后都要加分号
5. **颜色值**: 使用小写字母，能简写的尽量简写

```css
/* ✅ 正确示例 */
.challenge-card {
  /* 定位 */
  position: relative;
  z-index: 1;
  
  /* 盒模型 */
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 20px;
  padding: 20px;
  
  /* 边框 */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  
  /* 背景 */
  background-color: #fff;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  
  /* 文字 */
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  
  /* 其他 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.challenge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
```

### BEM 命名规范

使用 BEM (Block Element Modifier) 命名方法：

```css
/* Block */
.challenge-card { }

/* Element */
.challenge-card__header { }
.challenge-card__title { }
.challenge-card__category { }
.challenge-card__content { }
.challenge-card__footer { }

/* Modifier */
.challenge-card--solved { }
.challenge-card--difficult { }
.challenge-card__title--large { }
```

### 响应式设计

```css
/* 移动优先设计 */
.container {
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
}

/* 平板设备 */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    padding: 0 20px;
  }
}

/* 桌面设备 */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 0 30px;
  }
}

/* 大屏设备 */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}
```

### CSS 变量规范

```css
:root {
  /* 颜色系统 */
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-primary-light: #66b3ff;
  
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-danger: #dc3545;
  --color-info: #17a2b8;
  
  /* 文字颜色 */
  --text-color-primary: #212529;
  --text-color-secondary: #6c757d;
  --text-color-muted: #868e96;
  
  /* 背景颜色 */
  --bg-color-primary: #ffffff;
  --bg-color-secondary: #f8f9fa;
  --bg-color-dark: #343a40;
  
  /* 间距系统 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  
  /* 字体系统 */
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-family-mono: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-xxl: 24px;
  
  /* 阴影系统 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
  
  /* 边框半径 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  
  /* 过渡动画 */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;
}

/* 深色主题 */
[data-theme="dark"] {
  --text-color-primary: #ffffff;
  --text-color-secondary: #adb5bd;
  --text-color-muted: #6c757d;
  
  --bg-color-primary: #212529;
  --bg-color-secondary: #343a40;
  --bg-color-dark: #495057;
}
```

## 💻 JavaScript 规范

### 基本规范

1. **使用 ES6+ 语法**
2. **使用 const 和 let，避免 var**
3. **使用模板字符串**
4. **使用箭头函数**
5. **使用解构赋值**

```javascript
// ✅ 正确示例
const API_BASE_URL = 'https://api.qhu-ctf.com/v1';

class ChallengeManager {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || API_BASE_URL;
    this.token = options.token || localStorage.getItem('authToken');
    this.challenges = new Map();
  }

  /**
   * 获取题目列表
   * @param {Object} filters - 过滤条件
   * @param {string} filters.category - 题目分类
   * @param {string} filters.difficulty - 难度等级
   * @returns {Promise<Array>} 题目列表
   */
  async getChallenges(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${this.apiUrl}/challenges?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || '获取题目列表失败');
      }

      // 缓存题目数据
      data.data.challenges.forEach(challenge => {
        this.challenges.set(challenge.challengeId, challenge);
      });

      return data.data.challenges;
    } catch (error) {
      console.error('获取题目列表失败:', error);
      throw error;
    }
  }

  /**
   * 提交答案
   * @param {string} challengeId - 题目ID
   * @param {string} flag - 答案
   * @returns {Promise<Object>} 提交结果
   */
  async submitFlag(challengeId, flag) {
    if (!challengeId || !flag) {
      throw new Error('题目ID和答案不能为空');
    }

    try {
      const response = await fetch(`${this.apiUrl}/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ flag: flag.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      // 更新本地缓存
      if (data.success && data.data.isCorrect) {
        const challenge = this.challenges.get(challengeId);
        if (challenge) {
          challenge.isSolved = true;
          challenge.solvedAt = data.data.solvedAt;
        }
      }

      return data;
    } catch (error) {
      console.error('提交答案失败:', error);
      throw error;
    }
  }
}

// 使用示例
const challengeManager = new ChallengeManager({
  apiUrl: API_BASE_URL,
  token: localStorage.getItem('authToken')
});

// 获取Web分类的题目
challengeManager.getChallenges({ category: 'web' })
  .then(challenges => {
    console.log('获取到题目:', challenges);
    renderChallenges(challenges);
  })
  .catch(error => {
    console.error('加载失败:', error);
    showErrorMessage('加载题目失败，请稍后重试');
  });
```

### 错误处理规范

```javascript
// 统一错误处理类
class APIError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
  }
}

// 网络请求封装
class APIClient {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new APIError(
          data.error?.message || '请求失败',
          data.error?.code || 'UNKNOWN_ERROR',
          response.status
        );
      }

      if (!data.success) {
        throw new APIError(
          data.error?.message || '操作失败',
          data.error?.code || 'OPERATION_FAILED',
          response.status
        );
      }

      return data.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // 网络错误或其他错误
      throw new APIError(
        '网络连接失败，请检查网络设置',
        'NETWORK_ERROR',
        0
      );
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}
```

### 事件处理规范

```javascript
// 事件处理器类
class EventHandler {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * 添加事件监听器
   * @param {string} event - 事件名称
   * @param {Function} handler - 处理函数
   * @param {Object} options - 选项
   */
  on(event, handler, options = {}) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push({ handler, options });
  }

  /**
   * 移除事件监听器
   * @param {string} event - 事件名称
   * @param {Function} handler - 处理函数
   */
  off(event, handler) {
    if (!this.listeners.has(event)) return;
    
    const handlers = this.listeners.get(event);
    const index = handlers.findIndex(item => item.handler === handler);
    
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * 触发事件
   * @param {string} event - 事件名称
   * @param {*} data - 事件数据
   */
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    
    const handlers = this.listeners.get(event);
    handlers.forEach(({ handler, options }) => {
      try {
        handler(data);
        
        // 如果是一次性监听器，执行后移除
        if (options.once) {
          this.off(event, handler);
        }
      } catch (error) {
        console.error(`事件处理器执行失败 [${event}]:`, error);
      }
    });
  }
}

// DOM 事件处理
class DOMEventManager {
  constructor() {
    this.boundEvents = new WeakMap();
  }

  /**
   * 绑定事件（自动防抖）
   * @param {Element} element - DOM元素
   * @param {string} event - 事件类型
   * @param {Function} handler - 处理函数
   * @param {Object} options - 选项
   */
  bind(element, event, handler, options = {}) {
    const { debounce = 0, throttle = 0 } = options;
    
    let processedHandler = handler;
    
    // 防抖处理
    if (debounce > 0) {
      processedHandler = this.debounce(handler, debounce);
    }
    
    // 节流处理
    if (throttle > 0) {
      processedHandler = this.throttle(handler, throttle);
    }
    
    element.addEventListener(event, processedHandler, options);
    
    // 记录绑定的事件，便于清理
    if (!this.boundEvents.has(element)) {
      this.boundEvents.set(element, []);
    }
    
    this.boundEvents.get(element).push({
      event,
      handler: processedHandler,
      originalHandler: handler
    });
  }

  /**
   * 解绑事件
   * @param {Element} element - DOM元素
   * @param {string} event - 事件类型
   * @param {Function} handler - 原始处理函数
   */
  unbind(element, event, handler) {
    const events = this.boundEvents.get(element);
    if (!events) return;
    
    const eventInfo = events.find(e => 
      e.event === event && e.originalHandler === handler
    );
    
    if (eventInfo) {
      element.removeEventListener(event, eventInfo.handler);
      
      const index = events.indexOf(eventInfo);
      events.splice(index, 1);
    }
  }

  /**
   * 清理元素的所有事件
   * @param {Element} element - DOM元素
   */
  cleanup(element) {
    const events = this.boundEvents.get(element);
    if (!events) return;
    
    events.forEach(({ event, handler }) => {
      element.removeEventListener(event, handler);
    });
    
    this.boundEvents.delete(element);
  }

  // 防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 节流函数
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}
```

## 📁 文件命名规范

### 目录命名

- 使用小写字母和连字符
- 使用复数形式（如果适用）
- 保持简洁明了

```
assets/
components/
pages/
utils/
services/
config/
docs/
tests/
```

### 文件命名

#### HTML 文件
```
index.html
login.html
register.html
challenge-list.html
user-profile.html
admin-dashboard.html
```

#### CSS 文件
```
common.css          # 通用样式
variables.css       # CSS变量
components.css      # 组件样式
layout.css         # 布局样式
themes.css         # 主题样式
responsive.css     # 响应式样式
```

#### JavaScript 文件
```
main.js            # 主入口文件
common.js          # 通用工具函数
api-client.js      # API客户端
event-manager.js   # 事件管理器
form-validator.js  # 表单验证
theme-switcher.js  # 主题切换
```

#### 配置文件
```
project.json       # 项目配置
build.config.json  # 构建配置
.editorconfig      # 编辑器配置
.gitignore         # Git忽略文件
package.json       # 依赖配置
```

## 📝 注释规范

### 文件头注释

```javascript
/**
 * QHU-CTF Learn 模块 - 题目管理器
 * 
 * 功能描述：
 * - 题目列表获取和展示
 * - 答案提交和验证
 * - 用户进度跟踪
 * 
 * @author sunsky
 * @version 2.0.0
 * @since 2025-01-10
 * @license MIT
 * 
 * 依赖项：
 * - fetch API (现代浏览器支持)
 * - localStorage (用户状态存储)
 * 
 * 使用示例：
 * const manager = new ChallengeManager({
 *   apiUrl: 'https://api.qhu-ctf.com/v1',
 *   token: 'your-auth-token'
 * });
 * 
 * TODO:
 * - [ ] 添加离线模式支持
 * - [ ] 实现题目缓存机制
 * - [ ] 优化错误处理逻辑
 */
```

### 函数注释

```javascript
/**
 * 提交题目答案
 * 
 * 此函数会向服务器提交用户的答案，并处理各种可能的响应情况。
 * 提交成功后会自动更新本地缓存和用户界面。
 * 
 * @param {string} challengeId - 题目唯一标识符
 * @param {string} flag - 用户提交的答案（会自动去除首尾空格）
 * @param {Object} [options={}] - 可选配置
 * @param {boolean} [options.showLoading=true] - 是否显示加载状态
 * @param {Function} [options.onSuccess] - 成功回调函数
 * @param {Function} [options.onError] - 错误回调函数
 * 
 * @returns {Promise<Object>} 提交结果对象
 * @returns {boolean} returns.isCorrect - 答案是否正确
 * @returns {number} returns.score - 获得的分数
 * @returns {number} returns.newTotalScore - 用户新的总分
 * @returns {number} returns.newRank - 用户新的排名
 * 
 * @throws {APIError} 当网络请求失败或服务器返回错误时抛出
 * @throws {Error} 当参数验证失败时抛出
 * 
 * @example
 * // 基本用法
 * try {
 *   const result = await challengeManager.submitFlag('ch001', 'flag{hello_world}');
 *   if (result.isCorrect) {
 *     console.log(`恭喜！获得 ${result.score} 分`);
 *   }
 * } catch (error) {
 *   console.error('提交失败:', error.message);
 * }
 * 
 * @example
 * // 带回调函数的用法
 * challengeManager.submitFlag('ch001', 'flag{hello_world}', {
 *   onSuccess: (result) => showSuccessMessage(`获得 ${result.score} 分！`),
 *   onError: (error) => showErrorMessage(error.message)
 * });
 * 
 * @since 2.0.0
 * @see {@link getChallenges} 获取题目列表
 * @see {@link https://api.qhu-ctf.com/docs#submit-flag} API文档
 */
async submitFlag(challengeId, flag, options = {}) {
  // 函数实现...
}
```

### 复杂逻辑注释

```javascript
// 实现题目难度评分算法
// 基于以下因素计算：
// 1. 解题人数占比（权重: 40%）
// 2. 平均解题时间（权重: 30%）
// 3. 提示使用率（权重: 20%）
// 4. 专家评分（权重: 10%）
function calculateDifficultyScore(challenge) {
  const {
    solvedCount,
    totalAttempts,
    averageSolveTime,
    hintUsageRate,
    expertRating
  } = challenge.stats;

  // 解题成功率（越低越难）
  const successRate = solvedCount / totalAttempts;
  const successRateScore = Math.max(0, (1 - successRate) * 100);

  // 平均解题时间评分（时间越长越难）
  // 使用对数函数避免极值影响
  const timeScore = Math.min(100, Math.log10(averageSolveTime / 60) * 25);

  // 提示使用率评分（使用率越高越难）
  const hintScore = hintUsageRate * 100;

  // 专家评分（1-10分制转换为0-100分制）
  const expertScore = (expertRating - 1) * (100 / 9);

  // 加权平均计算最终分数
  const finalScore = (
    successRateScore * 0.4 +
    timeScore * 0.3 +
    hintScore * 0.2 +
    expertScore * 0.1
  );

  return Math.round(finalScore);
}
```

### CSS 注释

```css
/* ==========================================================================
   QHU-CTF Learn 模块 - 通用样式
   
   包含以下组件样式：
   - 按钮组件 (.btn)
   - 表单组件 (.form)
   - 卡片组件 (.card)
   - 导航组件 (.nav)
   
   作者: sunsky
   版本: 2.0.0
   更新: 2025-01-10
   ========================================================================== */

/* 按钮组件
   ========================================================================== */

.btn {
  /* 基础样式 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid transparent;
  border-radius: var(--border-radius-md);
  
  /* 文字样式 */
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  
  /* 交互样式 */
  cursor: pointer;
  user-select: none;
  transition: var(--transition-base);
}

/* 按钮状态 */
.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 按钮变体 */
.btn--primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

.btn--primary:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

/* 响应式按钮 */
@media (max-width: 768px) {
  .btn {
    /* 移动端按钮更大的点击区域 */
    min-height: 44px;
    padding: var(--spacing-md) var(--spacing-lg);
  }
}
```

## 🔄 版本控制规范

### Git 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 类型 (type)
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

#### 范围 (scope)
- `auth`: 认证相关
- `challenge`: 题目相关
- `user`: 用户相关
- `admin`: 管理员相关
- `ui`: 用户界面
- `api`: API接口
- `config`: 配置文件

#### 示例

```bash
# 新功能
feat(challenge): 添加题目分类筛选功能

实现了按照Web、Crypto、PWN等分类筛选题目的功能，
包括前端筛选界面和后端API支持。

Closes #123

# 修复bug
fix(auth): 修复登录状态检查逻辑

修复了用户刷新页面后登录状态丢失的问题，
现在会正确检查localStorage中的token有效性。

Fixes #456

# 文档更新
docs(api): 更新API文档中的认证部分

添加了JWT token的使用说明和错误码对照表。

# 代码重构
refactor(ui): 重构题目卡片组件

将题目卡片组件拆分为更小的子组件，
提高了代码的可维护性和复用性。
```

### 分支管理策略

```
main                 # 主分支，用于生产环境
├── develop         # 开发分支，用于集成测试
├── feature/        # 功能分支
│   ├── feature/user-profile
│   ├── feature/challenge-system
│   └── feature/team-management
├── hotfix/         # 热修复分支
│   └── hotfix/login-bug
└── release/        # 发布分支
    └── release/v2.0.0
```

### 代码提交前检查清单

- [ ] 代码符合编码规范
- [ ] 所有测试通过
- [ ] 没有console.log等调试代码
- [ ] 注释完整且准确
- [ ] 提交信息格式正确
- [ ] 相关文档已更新

## 🔍 代码审查规范

### 审查清单

#### 功能性
- [ ] 代码实现了预期功能
- [ ] 边界条件处理正确
- [ ] 错误处理完善
- [ ] 性能表现良好

#### 安全性
- [ ] 输入验证充分
- [ ] 没有SQL注入风险
- [ ] 没有XSS漏洞
- [ ] 敏感信息处理安全

#### 可维护性
- [ ] 代码结构清晰
- [ ] 命名规范一致
- [ ] 注释完整准确
- [ ] 复用性良好

#### 兼容性
- [ ] 浏览器兼容性
- [ ] 响应式设计
- [ ] 无障碍访问
- [ ] 国际化支持

### 审查流程

1. **自审**: 提交前开发者自行审查
2. **同行审查**: 至少一名同事审查
3. **技术负责人审查**: 重要功能需技术负责人审查
4. **测试验证**: 通过所有自动化测试
5. **合并**: 审查通过后合并到目标分支

---

*本编码规范由 QHU-CTF Learn 模块维护，最后更新: 2025/1/10*