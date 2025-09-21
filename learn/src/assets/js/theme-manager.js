/**
 * 统一主题管理器
 * Author: sunsky
 * 功能：提供统一的主题切换和管理功能
 * 使用方法：在页面中引入此文件，调用 ThemeManager.init() 即可
 */

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggleButton = null;
        this.initialized = false;
    }

    /**
     * 初始化主题管理器
     * 自动检测主题切换按钮并绑定事件
     */
    init() {
        if (this.initialized) return;
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._initialize());
        } else {
            this._initialize();
        }
    }

    /**
     * 内部初始化方法
     */
    _initialize() {
        // 查找主题切换按钮 - 支持多种选择器
        this.themeToggleButton = document.querySelector('.theme-toggle') || 
                                 document.getElementById('themeToggle') ||
                                 document.querySelector('[data-theme-toggle]') ||
                                 document.querySelector('.navbar-theme-toggle');
        
        if (!this.themeToggleButton) {
            console.warn('ThemeManager: 未找到主题切换按钮，将创建一个默认按钮');
            this._createDefaultToggleButton();
        }

        // 应用保存的主题
        this.applyTheme(this.currentTheme);
        
        // 绑定点击事件
        if (this.themeToggleButton) {
            this.themeToggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
        
        // 监听键盘快捷键 (Ctrl+Shift+T)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        this.initialized = true;
        console.log('ThemeManager: 初始化完成，当前主题:', this.currentTheme);
    }

    /**
     * 创建默认的主题切换按钮
     */
    _createDefaultToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', '切换主题');
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: var(--bg-secondary, #f8f9fa);
            color: var(--text-primary, #333);
            border: 2px solid var(--border-primary, #dee2e6);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(button);
        this.themeToggleButton = button;
        console.log('ThemeManager: 已创建默认主题切换按钮');
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * 设置指定主题
     * @param {string} theme - 主题名称 ('light' 或 'dark')
     */
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.error('ThemeManager: 无效的主题名称:', theme);
            return;
        }

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
        
        // 触发主题变更事件
        this._dispatchThemeChangeEvent(theme);
    }

    /**
     * 应用主题样式
     * @param {string} theme - 主题名称
     */
    applyTheme(theme) {
        const body = document.body;
        
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            this._updateToggleButton('☀️', '切换到浅色主题');
        } else {
            body.classList.remove('dark-theme');
            this._updateToggleButton('🌙', '切换到深色主题');
        }
    }

    /**
     * 更新切换按钮
     * @param {string} icon - 按钮图标
     * @param {string} title - 按钮提示文本
     */
    _updateToggleButton(icon, title) {
        // 更新所有可能的主题切换按钮
        const buttons = document.querySelectorAll('.theme-toggle, #themeToggle, [data-theme-toggle], .navbar-theme-toggle');
        
        buttons.forEach(button => {
            if (button) {
                button.textContent = icon;
                button.title = title;
                button.setAttribute('aria-label', title);
            }
        });
        
        // 确保主要按钮也被更新
        if (this.themeToggleButton) {
            this.themeToggleButton.textContent = icon;
            this.themeToggleButton.title = title;
            this.themeToggleButton.setAttribute('aria-label', title);
        }
    }

    /**
     * 保存主题设置到本地存储
     * @param {string} theme - 主题名称
     */
    saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.warn('ThemeManager: 无法保存主题设置到本地存储:', error);
        }
    }

    /**
     * 获取当前主题
     * @returns {string} 当前主题名称
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * 检查是否为深色主题
     * @returns {boolean} 是否为深色主题
     */
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    /**
     * 触发主题变更事件
     * @param {string} theme - 新主题名称
     */
    _dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: theme,
                isDark: theme === 'dark'
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * 监听主题变更事件
     * @param {Function} callback - 回调函数
     */
    onThemeChange(callback) {
        document.addEventListener('themechange', callback);
    }

    /**
     * 移除主题变更事件监听器
     * @param {Function} callback - 回调函数
     */
    offThemeChange(callback) {
        document.removeEventListener('themechange', callback);
    }

    /**
     * 重置主题为默认值
     */
    resetTheme() {
        this.setTheme('light');
    }

    /**
     * 销毁主题管理器
     */
    destroy() {
        if (this.themeToggleButton) {
            this.themeToggleButton.removeEventListener('click', this.toggleTheme);
        }
        this.initialized = false;
    }
}

// 创建全局实例
window.themeManager = new ThemeManager();

// 自动初始化（可选，也可以手动调用）
window.themeManager.init();

// 兼容旧版本的全局函数
window.toggleTheme = function() {
    window.themeManager.toggleTheme();
};

// 导出模块（如果支持ES6模块）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}