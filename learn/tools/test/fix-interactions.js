/**
 * fix-interactions - QHU-CTF Learn 模块
 * 作者: sunsky
 * 功能: 修复交互检查中发现的问题，完善页面功能
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

// 需要修复的HTML文件列表
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

/**
 * 修复外部链接问题
 * @param {string} content - 文件内容
 */
function fixExternalLinks(content) {
    // 修复带参数的not-implemented.html链接
    content = content.replace(/not-implemented\.html\?[^"']*/g, 'not-implemented.html');
    
    // 修复QQ链接
    content = content.replace(/tencent:\/\/message\/\?uin=1403757164/g, '#');
    
    // 修复其他带参数的链接
    content = content.replace(/challenge-detail\.html\?[^"']*/g, 'challenge-detail.html');
    content = content.replace(/discussion\.html\?[^"']*/g, 'not-implemented.html');
    content = content.replace(/writeups\.html\?[^"']*/g, 'not-implemented.html');
    
    return content;
}

/**
 * 添加缺失的HTML元素
 * @param {string} content - 文件内容
 * @param {string} filename - 文件名
 */
function addMissingElements(content, filename) {
    switch (filename) {
        case 'index.html':
            // 添加features部分
            if (!content.includes('class="features"')) {
                const featuresSection = `
        <!-- 特色功能 -->
        <section class="features">
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <div class="feature-card">
                            <h3>多样化题目</h3>
                            <p>涵盖Web安全、逆向工程、密码学等多个领域</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="feature-card">
                            <h3>实时排行</h3>
                            <p>实时更新的排行榜，激发竞争热情</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="feature-card">
                            <h3>学习交流</h3>
                            <p>与其他安全爱好者交流学习心得</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
                
                // 在hero-section后插入
                content = content.replace(
                    /(<\/section>\s*<!--[^>]*hero[^>]*-->)/i,
                    '$1' + featuresSection
                );
            }
            break;
            
        case 'login.html':
            // 修复email输入框类型
            content = content.replace(
                /input[^>]*name=["']username["'][^>]*type=["']text["']/g,
                'input name="username" type="email"'
            );
            content = content.replace(
                /type=["']text["'][^>]*name=["']username["']/g,
                'type="email" name="username"'
            );
            break;
            
        case 'register.html':
            // 添加注册表单ID
            content = content.replace(
                /<form([^>]*class=["'][^"']*register[^"']*["'][^>]*)>/i,
                '<form id="registerForm"$1>'
            );
            break;
            
        case 'privacy.html':
            // 添加隐私内容容器
            if (!content.includes('class="privacy-content"')) {
                const privacyContent = `
        <div class="privacy-content">
            <div class="container">
                <h2>隐私政策</h2>
                <p>我们重视您的隐私保护...</p>
            </div>
        </div>`;
                
                content = content.replace(
                    /(<main[^>]*>)/i,
                    '$1' + privacyContent
                );
            }
            break;
            
        case 'logout.html':
            // 添加退出消息
            if (!content.includes('class="logout-message"')) {
                const logoutMessage = `
        <div class="logout-message">
            <div class="container text-center">
                <h2>退出成功</h2>
                <p>您已成功退出登录，感谢使用！</p>
                <a href="index.html" class="btn btn-primary">返回首页</a>
            </div>
        </div>`;
                
                content = content.replace(
                    /(<main[^>]*>)/i,
                    '$1' + logoutMessage
                );
            }
            break;
            
        case 'forgot-password.html':
            // 添加忘记密码表单
            if (!content.includes('id="forgotForm"')) {
                const forgotForm = `
        <form id="forgotForm" class="forgot-form" action="#" method="post">
            <div class="form-group">
                <label for="email">邮箱地址</label>
                <input type="email" id="email" name="email" required>
            </div>
            <button type="submit" class="btn btn-primary">发送重置链接</button>
        </form>`;
                
                content = content.replace(
                    /(<main[^>]*>)/i,
                    '$1<div class="container">' + forgotForm + '</div>'
                );
            }
            break;
            
        case 'submit-flag.html':
            // 添加Flag提交表单
            if (!content.includes('id="flagForm"')) {
                const flagForm = `
        <form id="flagForm" class="flag-form" action="#" method="post">
            <div class="form-group">
                <label for="flag">Flag</label>
                <input type="text" id="flag" name="flag" placeholder="请输入Flag" required>
            </div>
            <button type="submit" class="btn btn-primary">提交Flag</button>
        </form>`;
                
                content = content.replace(
                    /(<main[^>]*>)/i,
                    '$1<div class="container">' + flagForm + '</div>'
                );
            }
            break;
            
        case 'not-implemented.html':
            // 添加开发中消息
            if (!content.includes('class="not-implemented-message"')) {
                const notImplementedMessage = `
        <div class="not-implemented-message">
            <div class="container text-center">
                <h2>功能开发中</h2>
                <p>该功能正在开发中，敬请期待！</p>
                <a href="index.html" class="btn btn-primary">返回首页</a>
            </div>
        </div>`;
                
                content = content.replace(
                    /(<main[^>]*>)/i,
                    '$1' + notImplementedMessage
                );
            }
            break;
    }
    
    return content;
}

/**
 * 修复表单属性
 * @param {string} content - 文件内容
 */
function fixFormAttributes(content) {
    // 为没有action的表单添加action="#"
    content = content.replace(
        /<form([^>]*(?!action=)[^>]*)>/gi,
        '<form$1 action="#">'
    );
    
    // 为没有method的表单添加method="post"
    content = content.replace(
        /<form([^>]*(?!method=)[^>]*)>/gi,
        '<form$1 method="post">'
    );
    
    return content;
}

/**
 * 添加JavaScript功能
 * @param {string} content - 文件内容
 */
function addJavaScriptFunctions(content) {
    // 检查是否已有JavaScript功能
    if (content.includes('navbar-toggle') && content.includes('theme-toggle')) {
        return content;
    }
    
    const jsCode = `
<script>
// 导航栏切换功能
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });
    }
    
    // 主题切换功能
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }
    
    // 恢复主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});
</script>`;
    
    // 在</body>前插入JavaScript代码
    content = content.replace(/(<\/body>)/i, jsCode + '\n$1');
    
    return content;
}

/**
 * 修复单个HTML文件
 * @param {string} filePath - 文件路径
 */
function fixSingleFile(filePath) {
    const filename = path.basename(filePath);
    
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  文件不存在: ${filename}`);
            return false;
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        console.log(`🔧 修复文件: ${filename}`);
        
        // 修复外部链接
        content = fixExternalLinks(content);
        
        // 添加缺失的HTML元素
        content = addMissingElements(content, filename);
        
        // 修复表单属性
        content = fixFormAttributes(content);
        
        // 添加JavaScript功能
        content = addJavaScriptFunctions(content);
        
        // 写回文件
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`✅ 修复完成: ${filename}`);
        return true;
        
    } catch (error) {
        console.error(`❌ 修复文件 ${filename} 时出错:`, error.message);
        return false;
    }
}

/**
 * 批量修复所有HTML文件
 */
function fixAllInteractions() {
    console.log('🔧 开始修复页面交互功能...\n');
    
    let fixedCount = 0;
    let failedCount = 0;
    
    htmlFiles.forEach(filename => {
        const filePath = path.join(__dirname, filename);
        
        if (fixSingleFile(filePath)) {
            fixedCount++;
        } else {
            failedCount++;
        }
        
        console.log(''); // 空行分隔
    });
    
    // 输出修复统计
    console.log('📊 修复完成统计:');
    console.log('━'.repeat(50));
    console.log(`总文件数: ${htmlFiles.length}`);
    console.log(`修复成功: ${fixedCount}`);
    console.log(`修复失败: ${failedCount}`);
    console.log('━'.repeat(50));
    
    if (fixedCount > 0) {
        console.log('\n✨ 修复内容包括:');
        console.log('1. 修复了带参数的链接问题');
        console.log('2. 添加了缺失的HTML元素');
        console.log('3. 完善了表单的action和method属性');
        console.log('4. 添加了导航栏和主题切换JavaScript功能');
        console.log('5. 修复了输入框类型问题');
        
        console.log('\n🎉 建议重新运行检查脚本验证修复效果');
    }
    
    return { fixed: fixedCount, failed: failedCount };
}
    fixSingleFile,
    fixAllInteractions
module.exports = {
    fixSingleFile,
    fixAllInteractions
};
/**
 * 主执行函数
 */
async function main() {
    const logger = new Logger('fix-interactions');
    logger.info('🚀 fix-interactions 开始执行...');
    
    try {
        const config = loadConfig();
        logger.debug('配置加载完成', config);
        
        // 在这里添加具体的执行逻辑
        await executeMainLogic(config, logger);
        
        logger.success(`✅ fix-interactions 执行完成! 耗时: ${logger.getExecutionTime()}s`);
        
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