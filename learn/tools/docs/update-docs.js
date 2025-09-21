/**
 * update-docs - QHU-CTF Learn 模块
 * 作者: sunsky
 * 功能: 更新所有Markdown文档中的项目信息，保持信息同步
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

// 项目信息配置
const projectInfo = {
    author: 'sunsky',
    github: 'https://github.com/TianJiHub/QHU-CTF',
    qq: '1403757164',
    date: '2025/9/19',
    projectName: 'QHU-CTF竞赛平台',
    description: 'QHU-CTF网络安全竞赛平台，专注于CTF竞赛组织和网络安全教育'
};

// 需要更新的文档文件列表
const docFiles = [
    // learn目录下的文档
    'S:\\SunskyFiles\\Projects\\Security\\QHU-CTF\\learn\\README.md',
    'S:\\SunskyFiles\\Projects\\Security\\QHU-CTF\\learn\\project-summary.md',
    
    // docs目录下的文档
    'S:\\SunskyFiles\\Projects\\Security\\QHU-CTF\\docs\\项目介绍.md',
    'S:\\SunskyFiles\\Projects\\Security\\QHU-CTF\\docs\\技术栈介绍.md',
    
    // 根目录可能的文档
    'S:\\SunskyFiles\\Projects\\Security\\QHU-CTF\\README.md',
    
    // .trae目录下的规则文档
    'S:\\SunskyFiles\\Projects\\Security\\QHU-CTF\\.trae\\rules\\project_rules.md'
];

// 文档更新规则
const updateRules = [
    // 作者信息更新
    {
        pattern: /(\*\*?开发者\*\*?[：:\s]*)[^\n\r]+/g,
        replacement: `$1${projectInfo.author}`
    },
    {
        pattern: /(\*\*?作者\*\*?[：:\s]*)[^\n\r]+/g,
        replacement: `$1${projectInfo.author}`
    },
    {
        pattern: /(Author[：:\s]*)[^\n\r]+/g,
        replacement: `$1${projectInfo.author}`
    },
    
    // GitHub地址更新
    {
        pattern: /(\*\*?项目地址\*\*?[：:\s]*)[^\n\r]+/g,
        replacement: `$1${projectInfo.github}`
    },
    {
        pattern: /(\*\*?GitHub\*\*?[：:\s]*)[^\n\r]+/g,
        replacement: `$1${projectInfo.github}`
    },
    {
        pattern: /(repository-url)/g,
        replacement: projectInfo.github
    },
    
    // 联系方式更新
    {
        pattern: /(\*\*?联系方式\*\*?[：:\s]*)[^\n\r]+/g,
        replacement: `$1QQ: ${projectInfo.qq}`
    },
    {
        pattern: /(\*\*?QQ\*\*?[：:\s]*)[^\n\r]+/g,
        replacement: `$1${projectInfo.qq}`
    },
    {
        pattern: /(QQ[：:\s]*)\d+/g,
        replacement: `$1${projectInfo.qq}`
    },
    
    // 更新时间
    {
        pattern: /(\*\*?更新时间\*\*?[：:\s]*)[^\n\r]+/g,
        replacement: `$1${projectInfo.date}`
    },
    {
        pattern: /(\*\*?最后更新\*\*?[：:\s]*)[^\n\r]+/g,
        replacement: `$1${projectInfo.date}`
    },
    {
        pattern: /(Date[：:\s]*)[^\n\r]+/g,
        replacement: `$1${projectInfo.date}`
    },
    
    // 项目名称
    {
        pattern: /(# ).*CTF[^\n\r]*/g,
        replacement: `$1${projectInfo.projectName}`
    }
];

// 更新单个文档文件
function updateDocFile(filePath) {
    try {
        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  文件不存在: ${path.basename(filePath)}`);
            return false;
        }

        // 读取文件内容
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // 应用所有更新规则
        updateRules.forEach(rule => {
            content = content.replace(rule.pattern, rule.replacement);
        });

        // 检查是否有变更
        if (content !== originalContent) {
            // 写入更新后的内容
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ 已更新: ${path.basename(filePath)}`);
            return true;
        } else {
            console.log(`📝 无需更新: ${path.basename(filePath)}`);
            return true;
        }

    } catch (error) {
        console.error(`❌ 更新失败 ${path.basename(filePath)}: ${error.message}`);
        return false;
    }
}

// 创建根目录README文件（如果不存在）
function createRootReadme() {
    const readmePath = 'S:\\SunskyFiles\\Projects\\Security\\QHU-CTF\\README.md';
    
    if (!fs.existsSync(readmePath)) {
        const readmeContent = `# ${projectInfo.projectName}

## 🎯 项目简介

${projectInfo.description}

## 🚀 快速开始

### 开发环境启动

\`\`\`bash
# 克隆项目
git clone ${projectInfo.github}
cd QHU-CTF

# 启动开发环境
docker-compose up -d

# 访问应用
# 前端：http://localhost:3000
# 后端API：http://localhost:5000
\`\`\`

### 学习版本（纯HTML）

\`\`\`bash
# 进入学习目录
cd learn

# 启动本地服务器
python -m http.server 8080

# 访问：http://localhost:8080
\`\`\`

## 📁 项目结构

\`\`\`
QHU-CTF/
├── frontend/          # Vue.js前端应用
├── backend/           # Flask后端API
├── learn/             # HTML学习版本
├── docs/              # 项目文档
├── config/            # 配置文件
└── tests/             # 测试文件
\`\`\`

## 🛠️ 技术栈

- **前端**: Vue 3 + Vite + TailwindCSS
- **后端**: Flask + SQLAlchemy + JWT
- **数据库**: PostgreSQL + Redis
- **部署**: Docker + Nginx

## 📚 文档

- [项目介绍](./docs/项目介绍.md) - 详细的功能介绍和架构设计
- [技术栈介绍](./docs/技术栈介绍.md) - 技术选型和开发规范
- [学习版本说明](./learn/README.md) - HTML版本的使用指南

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- **开发者**: ${projectInfo.author}
- **项目地址**: ${projectInfo.github}
- **联系方式**: QQ: ${projectInfo.qq}
- **更新时间**: ${projectInfo.date}

---

*致力于推动网络安全教育和技术发展，欢迎社区贡献和反馈。*
`;

        try {
            fs.writeFileSync(readmePath, readmeContent, 'utf8');
            console.log('✅ 已创建: README.md');
            return true;
        } catch (error) {
            console.error(`❌ 创建README失败: ${error.message}`);
            return false;
        }
    } else {
        console.log('📝 README.md已存在，将进行更新');
        return true;
    }
}

// 批量更新所有文档
function updateAllDocs() {
    console.log('🚀 开始更新workspace中的所有文档...\n');
    
    let updatedCount = 0;
    let errorCount = 0;
    let totalCount = 0;

    // 创建根目录README（如果需要）
    createRootReadme();

    // 更新所有文档文件
    docFiles.forEach(filePath => {
        totalCount++;
        const success = updateDocFile(filePath);
        if (success) {
            updatedCount++;
        } else {
            errorCount++;
        }
    });

    // 输出统计信息
    console.log('\n📊 文档更新统计:');
    console.log(`✅ 成功处理: ${updatedCount} 个文档`);
    console.log(`❌ 处理失败: ${errorCount} 个文档`);
    console.log(`📁 总计文档: ${totalCount} 个文档`);
    
    if (errorCount === 0) {
        console.log('\n🎉 所有文档更新完成！项目信息已同步。');
    } else {
        console.log('\n⚠️  部分文档更新失败，请检查错误信息。');
    }
}

// 执行更新



    updateAllDocs,
    updateDocFile,
    projectInfo
};
/**
 * 主执行函数
 */
async function main() {
    const logger = new Logger('update-docs');
    logger.info('🚀 update-docs 开始执行...');
    
    try {
        const config = loadConfig();
        logger.debug('配置加载完成', config);
        
        // 在这里添加具体的执行逻辑
        await executeMainLogic(config, logger);
        
        logger.success(`✅ update-docs 执行完成! 耗时: ${logger.getExecutionTime()}s`);
        
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