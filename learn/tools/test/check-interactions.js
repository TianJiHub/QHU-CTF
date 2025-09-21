/**
 * check-interactions - QHU-CTF Learn 模块
 * 作者: sunsky
 * 功能: 检查所有页面的交互和跳转功能，确保用户体验流畅
 * 更新时间: 2025/9/19
 * 版本: 2.0.0
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// 配置文件路径
const CONFIG_FILE = path.join(__dirname, '../../build.config.json');

/**
 * 加载配置文件
 */
function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        }
        return getDefaultConfig();
    } catch (error) {
        console.warn('⚠️  配置文件加载失败，使用默认配置:', error.message);
        return getDefaultConfig();
    }
}

/**
 * 获取默认配置
 */
function getDefaultConfig() {
    return {
        input: "src/",
        output: "dist/",
        assets: {
            css: "src/assets/css/",
            js: "src/assets/js/",
            images: "src/assets/images/"
        },
        pages: {
            core: "src/pages/core/",
            admin: "src/pages/admin/",
            info: "src/pages/info/"
        }
    };
}

/**
 * 日志记录器
 */
class Logger {
    constructor(scriptName) {
        this.scriptName = scriptName;
        this.startTime = performance.now();
        this.logFile = path.join(__dirname, '../../reports', `${scriptName}-${new Date().toISOString().split('T')[0]}.log`);
        
        // 确保日志目录存在
        const logDir = path.dirname(this.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }
    
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            script: this.scriptName,
            message,
            data
        };
        
        // 控制台输出
        const emoji = {
            'INFO': 'ℹ️',
            'SUCCESS': '✅',
            'WARNING': '⚠️',
            'ERROR': '❌',
            'DEBUG': '🔍'
        };
        
        console.log(`${emoji[level] || '📝'} ${message}`);
        if (data) {
            console.log('   详情:', data);
        }
        
        // 文件日志
        try {
            fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.warn('日志写入失败:', error.message);
        }
    }
    
    info(message, data) { this.log('INFO', message, data); }
    success(message, data) { this.log('SUCCESS', message, data); }
    warning(message, data) { this.log('WARNING', message, data); }
    error(message, data) { this.log('ERROR', message, data); }
    debug(message, data) { this.log('DEBUG', message, data); }
    
    getExecutionTime() {
        return ((performance.now() - this.startTime) / 1000).toFixed(2);
    }
}

/**
 * 进度指示器
 */
class ProgressIndicator {
    constructor(total, description = '处理中') {
        this.total = total;
        this.current = 0;
        this.description = description;
        this.startTime = Date.now();
    }
    
    update(increment = 1, currentItem = '') {
        this.current += increment;
        const percentage = Math.round((this.current / this.total) * 100);
        const elapsed = (Date.now() - this.startTime) / 1000;
        const eta = this.current > 0 ? (elapsed / this.current) * (this.total - this.current) : 0;
        
        const progressBar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
        
        process.stdout.write(`\r📊 ${this.description}: [${progressBar}] ${percentage}% (${this.current}/${this.total}) ETA: ${eta.toFixed(1)}s ${currentItem}`);
        
        if (this.current >= this.total) {
            console.log(`\n✅ 完成! 总耗时: ${elapsed.toFixed(2)}s`);
        }
    }
}

/**
 * 错误处理装饰器
 */
function withErrorHandling(fn, logger) {
    return async function(...args) {
        try {
            return await fn.apply(this, args);
        } catch (error) {
            logger.error(`函数 ${fn.name} 执行失败`, {
                error: error.message,
                stack: error.stack,
                args: args
            });
            throw error;
        }
    };
}

/**
 * 文件操作工具
 */
class FileUtils {
    static ensureDir(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    
    static copyFile(source, target) {
        FileUtils.ensureDir(path.dirname(target));
        fs.copyFileSync(source, target);
    }
    
    static readJsonFile(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            throw new Error(`读取JSON文件失败: ${filePath} - ${error.message}`);
        }
    }
    
    static writeJsonFile(filePath, data) {
        FileUtils.ensureDir(path.dirname(filePath));
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
    
    static getFileList(directory, extension = null) {
        if (!fs.existsSync(directory)) {
            return [];
        }
        
        const files = fs.readdirSync(directory);
        return extension 
            ? files.filter(file => file.endsWith(extension))
            : files;
    }
}

// 需要检查的HTML文件列表
const htmlFiles = [
    'index.html',
    'login.html', 
    'register.html',
    'challenges.html',
    'challenge-detail.html',
    'scoreboard.html',
    'profile.html',
    'admin.html',
    'help.html',
    'privacy.html',
    'terms.html',
    'logout.html',
    'forgot-password.html',
    'submit-flag.html',
    'not-implemented.html'
];

// 页面功能配置
const pageConfigs = {
    'index.html': {
        name: '首页',
        requiredLinks: ['challenges.html', 'login.html', 'register.html', 'scoreboard.html'],
        requiredElements: ['.hero-section', '.features', '.navbar'],
        interactions: ['主题切换', '导航菜单']
    },
    'login.html': {
        name: '登录页面',
        requiredLinks: ['register.html', 'forgot-password.html', 'index.html'],
        requiredElements: ['#loginForm', 'input[type="email"]', 'input[type="password"]'],
        interactions: ['登录表单', '记住我', '忘记密码链接']
    },
    'register.html': {
        name: '注册页面',
        requiredLinks: ['login.html', 'terms.html', 'privacy.html'],
        requiredElements: ['#registerForm', 'input[type="email"]', 'input[type="password"]'],
        interactions: ['注册表单', '密码确认', '同意条款']
    },
    'challenges.html': {
        name: '题目列表',
        requiredLinks: ['challenge-detail.html', 'submit-flag.html'],
        requiredElements: ['.challenge-card', '.difficulty-badge', '.points'],
        interactions: ['题目筛选', '难度过滤', '题目详情']
    },
    'challenge-detail.html': {
        name: '题目详情',
        requiredLinks: ['challenges.html', 'submit-flag.html'],
        requiredElements: ['.challenge-content', '.challenge-info', '#flagForm'],
        interactions: ['提交Flag', '返回列表', '下载附件']
    },
    'scoreboard.html': {
        name: '排行榜',
        requiredLinks: ['profile.html'],
        requiredElements: ['.scoreboard-table', '.rank-item'],
        interactions: ['排名查看', '用户详情']
    },
    'profile.html': {
        name: '个人资料',
        requiredLinks: ['challenges.html', 'logout.html'],
        requiredElements: ['.profile-info', '.solved-challenges'],
        interactions: ['资料编辑', '密码修改', '解题记录']
    },
    'admin.html': {
        name: '管理后台',
        requiredLinks: ['challenges.html', 'logout.html'],
        requiredElements: ['.admin-panel', '.user-management'],
        interactions: ['用户管理', '题目管理', '系统设置']
    },
    'help.html': {
        name: '帮助页面',
        requiredLinks: ['index.html', 'challenges.html'],
        requiredElements: ['.help-content', '.faq-section'],
        interactions: ['FAQ展开', '搜索功能']
    },
    'privacy.html': {
        name: '隐私政策',
        requiredLinks: ['index.html', 'terms.html'],
        requiredElements: ['.privacy-content'],
        interactions: ['内容展示']
    },
    'terms.html': {
        name: '服务条款',
        requiredLinks: ['index.html', 'privacy.html'],
        requiredElements: ['.terms-content'],
        interactions: ['内容展示']
    },
    'logout.html': {
        name: '退出登录',
        requiredLinks: ['index.html', 'login.html'],
        requiredElements: ['.logout-message'],
        interactions: ['自动跳转', '手动返回']
    },
    'forgot-password.html': {
        name: '忘记密码',
        requiredLinks: ['login.html', 'index.html'],
        requiredElements: ['#forgotForm', 'input[type="email"]'],
        interactions: ['重置表单', '返回登录']
    },
    'submit-flag.html': {
        name: '提交Flag',
        requiredLinks: ['challenges.html', 'challenge-detail.html'],
        requiredElements: ['#flagForm', 'input[name="flag"]'],
        interactions: ['Flag提交', '返回题目']
    },
    'not-implemented.html': {
        name: '功能开发中',
        requiredLinks: ['index.html'],
        requiredElements: ['.not-implemented-message'],
        interactions: ['返回首页']
    }
};

// 检查结果统计
let checkResults = {
    totalFiles: 0,
    checkedFiles: 0,
    passedFiles: 0,
    failedFiles: 0,
    issues: []
};

/**
 * 检查HTML文件中的链接
 * @param {string} content - 文件内容
 * @param {Array} requiredLinks - 必需的链接
 * @param {string} filename - 文件名
 */
function checkLinks(content, requiredLinks, filename) {
    const issues = [];
    const linkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
    const foundLinks = [];
    let match;

    // 提取所有链接
    while ((match = linkPattern.exec(content)) !== null) {
        foundLinks.push(match[1]);
    }

    // 检查必需的链接
    requiredLinks.forEach(requiredLink => {
        const found = foundLinks.some(link => 
            link.includes(requiredLink) || 
            link === requiredLink ||
            link === `./${requiredLink}`
        );
        
        if (!found) {
            issues.push(`缺少必需链接: ${requiredLink}`);
        }
    });

    // 检查链接是否指向存在的文件
    foundLinks.forEach(link => {
        // 跳过外部链接和特殊链接
        if (link.startsWith('http') || link.startsWith('#') || link.startsWith('javascript:') || link.startsWith('mailto:')) {
            return;
        }

        // 处理相对路径
        let targetFile = link;
        if (link.startsWith('./')) {
            targetFile = link.substring(2);
        }

        // 检查文件是否存在
        const targetPath = path.join(__dirname, targetFile);
        if (!fs.existsSync(targetPath)) {
            issues.push(`链接指向不存在的文件: ${link}`);
        }
    });

    return issues;
}

/**
 * 检查HTML文件中的必需元素
 * @param {string} content - 文件内容
 * @param {Array} requiredElements - 必需的元素选择器
 */
function checkElements(content, requiredElements) {
    const issues = [];

    requiredElements.forEach(selector => {
        let found = false;

        if (selector.startsWith('#')) {
            // ID选择器
            const id = selector.substring(1);
            const idPattern = new RegExp(`id=["']${id}["']`, 'i');
            found = idPattern.test(content);
        } else if (selector.startsWith('.')) {
            // 类选择器
            const className = selector.substring(1);
            const classPattern = new RegExp(`class=["'][^"']*\\b${className}\\b[^"']*["']`, 'i');
            found = classPattern.test(content);
        } else if (selector.includes('[')) {
            // 属性选择器
            const attrMatch = selector.match(/(\w+)\[([^=]+)=["']([^"']+)["']\]/);
            if (attrMatch) {
                const [, tag, attr, value] = attrMatch;
                const attrPattern = new RegExp(`<${tag}[^>]*${attr}=["']${value}["'][^>]*>`, 'i');
                found = attrPattern.test(content);
            }
        } else {
            // 标签选择器
            const tagPattern = new RegExp(`<${selector}[^>]*>`, 'i');
            found = tagPattern.test(content);
        }

        if (!found) {
            issues.push(`缺少必需元素: ${selector}`);
        }
    });

    return issues;
}

/**
 * 检查表单功能
 * @param {string} content - 文件内容
 */
function checkForms(content) {
    const issues = [];
    const formPattern = /<form[^>]*>/gi;
    const forms = content.match(formPattern) || [];

    forms.forEach((form, index) => {
        // 检查表单是否有action属性
        if (!form.includes('action=')) {
            issues.push(`表单 ${index + 1} 缺少action属性`);
        }

        // 检查表单是否有method属性
        if (!form.includes('method=')) {
            issues.push(`表单 ${index + 1} 缺少method属性`);
        }
    });

    return issues;
}

/**
 * 检查JavaScript功能
 * @param {string} content - 文件内容
 */
function checkJavaScript(content) {
    const issues = [];
    
    // 检查是否包含必要的JavaScript功能
    const jsChecks = [
        {
            pattern: /theme.*toggle|toggle.*theme/i,
            name: '主题切换功能',
            required: true
        },
        {
            pattern: /navbar.*toggle|toggle.*navbar/i,
            name: '导航栏切换功能',
            required: true
        },
        {
            pattern: /form.*submit|submit.*form/i,
            name: '表单提交功能',
            required: false
        }
    ];

    jsChecks.forEach(check => {
        if (check.required && !check.pattern.test(content)) {
            issues.push(`缺少${check.name}`);
        }
    });

    return issues;
}

/**
 * 检查单个HTML文件
 * @param {string} filePath - 文件路径
 */
function checkSingleFile(filePath) {
    const filename = path.basename(filePath);
    const config = pageConfigs[filename];
    
    if (!config) {
        console.log(`⚠️  未配置检查规则: ${filename}`);
        return { passed: false, issues: ['未配置检查规则'] };
    }

    try {
        if (!fs.existsSync(filePath)) {
            console.log(`❌ 文件不存在: ${filename}`);
            return { passed: false, issues: ['文件不存在'] };
        }

        const content = fs.readFileSync(filePath, 'utf8');
        let allIssues = [];

        console.log(`📄 检查文件: ${config.name} (${filename})`);

        // 检查链接
        const linkIssues = checkLinks(content, config.requiredLinks, filename);
        allIssues = allIssues.concat(linkIssues);

        // 检查必需元素
        const elementIssues = checkElements(content, config.requiredElements);
        allIssues = allIssues.concat(elementIssues);

        // 检查表单
        const formIssues = checkForms(content);
        allIssues = allIssues.concat(formIssues);

        // 检查JavaScript功能
        const jsIssues = checkJavaScript(content);
        allIssues = allIssues.concat(jsIssues);

        // 检查基础HTML结构
        const basicChecks = [
            { pattern: /<html[^>]*>/i, name: 'HTML标签' },
            { pattern: /<head[^>]*>/i, name: 'HEAD标签' },
            { pattern: /<body[^>]*>/i, name: 'BODY标签' },
            { pattern: /<title[^>]*>/i, name: 'TITLE标签' },
            { pattern: /<meta[^>]*charset/i, name: '字符编码' },
            { pattern: /<meta[^>]*viewport/i, name: '视口设置' }
        ];

        basicChecks.forEach(check => {
            if (!check.pattern.test(content)) {
                allIssues.push(`缺少${check.name}`);
            }
        });

        // 输出检查结果
        if (allIssues.length === 0) {
            console.log(`✅ 检查通过: ${config.name}`);
            console.log(`   - 链接检查: 通过`);
            console.log(`   - 元素检查: 通过`);
            console.log(`   - 表单检查: 通过`);
            console.log(`   - 功能检查: 通过`);
            return { passed: true, issues: [] };
        } else {
            console.log(`❌ 检查失败: ${config.name}`);
            allIssues.forEach(issue => {
                console.log(`   - ${issue}`);
            });
            return { passed: false, issues: allIssues };
        }

    } catch (error) {
        console.error(`❌ 处理文件 ${filename} 时出错:`, error.message);
        return { passed: false, issues: [`处理文件时出错: ${error.message}`] };
    }
}

/**
 * 批量检查所有HTML文件
 */
function checkAllInteractions() {
    console.log('🔍 开始检查页面交互和跳转功能...\n');
    console.log('📋 检查配置:');
    console.log(`  - 检查文件数: ${htmlFiles.length}`);
    console.log(`  - 检查项目: 链接、元素、表单、JavaScript功能`);
    console.log(`  - 基础结构: HTML标签、字符编码、视口设置\n`);
    
    checkResults.totalFiles = htmlFiles.length;
    
    htmlFiles.forEach(filename => {
        const filePath = path.join(__dirname, filename);
        const result = checkSingleFile(filePath);
        
        checkResults.checkedFiles++;
        
        if (result.passed) {
            checkResults.passedFiles++;
        } else {
            checkResults.failedFiles++;
            checkResults.issues.push({
                file: filename,
                issues: result.issues
            });
        }
        
        console.log(''); // 空行分隔
    });
    
    // 输出总结报告
    console.log('📊 检查完成统计:');
    console.log('━'.repeat(50));
    console.log(`总文件数: ${checkResults.totalFiles}`);
    console.log(`已检查: ${checkResults.checkedFiles}`);
    console.log(`通过检查: ${checkResults.passedFiles}`);
    console.log(`存在问题: ${checkResults.failedFiles}`);
    console.log('━'.repeat(50));
    
    if (checkResults.failedFiles > 0) {
        console.log('\n❌ 存在问题的文件:');
        checkResults.issues.forEach(item => {
            console.log(`\n📄 ${item.file}:`);
            item.issues.forEach(issue => {
                console.log(`   - ${issue}`);
            });
        });
        
        console.log('\n🔧 建议修复措施:');
        console.log('1. 检查并修复缺失的链接');
        console.log('2. 添加缺失的HTML元素');
        console.log('3. 完善表单的action和method属性');
        console.log('4. 确保JavaScript功能正常工作');
        console.log('5. 验证所有链接指向的文件存在');
    } else {
        console.log('\n🎉 所有文件检查通过！');
        console.log('✨ 页面交互和跳转功能运行正常');
    }
    
    // 生成检查报告
    const reportPath = path.join(__dirname, 'interaction-check-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(checkResults, null, 2), 'utf8');
    console.log(`\n📋 详细报告已保存: ${reportPath}`);
    
    return checkResults;
}
    checkSingleFile,
    checkAllInteractions,
    pageConfigs,
    checkResults
module.exports = {
    checkSingleFile,
    checkAllInteractions,
    pageConfigs,
    checkResults
};
/**
 * 主执行函数
 */
async function main() {
    const logger = new Logger('check-interactions');
    logger.info('🚀 check-interactions 开始执行...');
    
    try {
        const config = loadConfig();
        logger.debug('配置加载完成', config);
        
        // 在这里添加具体的执行逻辑
        await executeMainLogic(config, logger);
        
        logger.success(`✅ check-interactions 执行完成! 耗时: ${logger.getExecutionTime()}s`);
        
    } catch (error) {
        logger.error('❌ 执行失败', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
}

/**
 * 具体执行逻辑（需要在各个脚本中实现）
 */
async function executeMainLogic(config, logger) {
    // 子类需要实现此方法
    throw new Error('executeMainLogic 方法需要在具体脚本中实现');
}

// 执行脚本
if (require.main === module) {
    main();
}

module.exports = {
    loadConfig,
    Logger,
    ProgressIndicator,
    withErrorHandling,
    FileUtils,
    executeMainLogic
};