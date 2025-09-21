/**
 * 项目结构重组脚本 - QHU-CTF Learn 模块
 * 作者: sunsky
 * 功能: 按照最佳实践重新组织项目目录结构
 * 更新时间: 2025/1/10
 */

const fs = require('fs');
const path = require('path');

// 新的目录结构配置
const newStructure = {
    // 页面文件分类
    pages: {
        core: ['index.html', 'login.html', 'register.html', 'challenges.html', 'profile.html'],
        admin: ['admin.html', 'challenge-detail.html', 'submit-flag.html', 'scoreboard.html'],
        info: ['help.html', 'privacy.html', 'terms.html', 'logout.html', 'forgot-password.html', 'not-implemented.html']
    },
    
    // 资源文件分类
    assets: {
        styles: ['common-styles.css', 'responsive-styles.css', 'theme-system.css', 'styles.css'],
        scripts: ['common-scripts.js']
    },
    
    // 工具和脚本
    tools: {
        build: ['apply-styles.js', 'batch-update.js', 'update-project-info.js'],
        test: ['check-interactions.js', 'fix-interactions.js'],
        docs: ['update-docs.js']
    },
    
    // 文档和报告
    docs: ['README.md', 'project-summary.md'],
    reports: ['interaction-check-report.json']
};

// 目标目录结构
const targetStructure = {
    'src/': {
        'pages/': {
            'core/': [],
            'admin/': [],
            'info/': []
        },
        'assets/': {
            'css/': [],
            'js/': [],
            'images/': []
        }
    },
    'tools/': {
        'build/': [],
        'test/': [],
        'docs/': []
    },
    'docs/': [],
    'reports/': [],
    'dist/': {}
};

/**
 * 创建目录结构
 */
function createDirectoryStructure() {
    console.log('🏗️  开始创建新的目录结构...');
    
    function createDirs(structure, basePath = '.') {
        for (const [dirName, content] of Object.entries(structure)) {
            const dirPath = path.join(basePath, dirName);
            
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`✅ 创建目录: ${dirPath}`);
            }
            
            if (typeof content === 'object' && !Array.isArray(content)) {
                createDirs(content, dirPath);
            }
        }
    }
    
    createDirs(targetStructure);
}

/**
 * 移动文件到新结构
 */
function moveFilesToNewStructure() {
    console.log('📦 开始移动文件到新结构...');
    
    // 移动核心页面
    newStructure.pages.core.forEach(file => {
        moveFile(file, `src/pages/core/${file}`);
    });
    
    // 移动管理页面
    newStructure.pages.admin.forEach(file => {
        moveFile(file, `src/pages/admin/${file}`);
    });
    
    // 移动信息页面
    newStructure.pages.info.forEach(file => {
        moveFile(file, `src/pages/info/${file}`);
    });
    
    // 移动样式文件
    newStructure.assets.styles.forEach(file => {
        moveFile(file, `src/assets/css/${file}`);
    });
    
    // 移动脚本文件
    newStructure.assets.scripts.forEach(file => {
        moveFile(file, `src/assets/js/${file}`);
    });
    
    // 移动构建工具
    newStructure.tools.build.forEach(file => {
        moveFile(file, `tools/build/${file}`);
    });
    
    // 移动测试工具
    newStructure.tools.test.forEach(file => {
        moveFile(file, `tools/test/${file}`);
    });
    
    // 移动文档工具
    newStructure.tools.docs.forEach(file => {
        moveFile(file, `tools/docs/${file}`);
    });
    
    // 移动文档
    newStructure.docs.forEach(file => {
        moveFile(file, `docs/${file}`);
    });
    
    // 移动报告
    newStructure.reports.forEach(file => {
        moveFile(file, `reports/${file}`);
    });
}

/**
 * 移动单个文件
 */
function moveFile(source, target) {
    if (fs.existsSync(source)) {
        const targetDir = path.dirname(target);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        fs.renameSync(source, target);
        console.log(`📄 移动文件: ${source} → ${target}`);
    } else {
        console.log(`⚠️  文件不存在: ${source}`);
    }
}

/**
 * 更新文件中的路径引用
 */
function updatePathReferences() {
    console.log('🔗 更新文件中的路径引用...');
    
    // 路径映射规则
    const pathMappings = {
        // CSS文件路径更新
        'common-styles.css': '../assets/css/common-styles.css',
        'responsive-styles.css': '../assets/css/responsive-styles.css',
        'theme-system.css': '../assets/css/theme-system.css',
        'styles.css': '../assets/css/styles.css',
        
        // JS文件路径更新
        'common-scripts.js': '../assets/js/common-scripts.js',
        
        // 页面间链接更新
        'index.html': '../core/index.html',
        'login.html': '../core/login.html',
        'register.html': '../core/register.html',
        'challenges.html': '../core/challenges.html',
        'profile.html': '../core/profile.html',
        'admin.html': '../admin/admin.html',
        'help.html': '../info/help.html'
    };
    
    // 更新所有HTML文件中的路径引用
    updateHtmlFiles('src/pages/core', pathMappings);
    updateHtmlFiles('src/pages/admin', pathMappings);
    updateHtmlFiles('src/pages/info', pathMappings);
}

/**
 * 更新HTML文件中的路径
 */
function updateHtmlFiles(directory, pathMappings) {
    if (!fs.existsSync(directory)) return;
    
    const files = fs.readdirSync(directory).filter(file => file.endsWith('.html'));
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 更新CSS和JS引用路径
        for (const [oldPath, newPath] of Object.entries(pathMappings)) {
            const regex = new RegExp(`(href|src)=["']${oldPath}["']`, 'g');
            content = content.replace(regex, `$1="${newPath}"`);
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`🔄 更新路径引用: ${filePath}`);
    });
}

/**
 * 创建新的配置文件
 */
function createConfigFiles() {
    console.log('⚙️  创建配置文件...');
    
    // 创建项目配置文件
    const projectConfig = {
        name: "QHU-CTF Learn Module",
        version: "2.0.0",
        description: "QHU-CTF 竞赛平台学习模块",
        author: "sunsky",
        structure: {
            src: "源代码目录",
            tools: "开发工具目录", 
            docs: "文档目录",
            reports: "报告目录",
            dist: "构建输出目录"
        },
        scripts: {
            build: "node tools/build/apply-styles.js",
            test: "node tools/test/check-interactions.js",
            "update-docs": "node tools/docs/update-docs.js"
        }
    };
    
    fs.writeFileSync('project.json', JSON.stringify(projectConfig, null, 2));
    console.log('✅ 创建项目配置: project.json');
    
    // 创建构建配置
    const buildConfig = {
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
    
    fs.writeFileSync('build.config.json', JSON.stringify(buildConfig, null, 2));
    console.log('✅ 创建构建配置: build.config.json');
}

/**
 * 生成新结构说明文档
 */
function generateStructureDoc() {
    const structureDoc = `# QHU-CTF Learn 模块 - 项目结构说明

## 📁 目录结构

\`\`\`
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
\`\`\`

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
\`\`\`bash
# 应用样式
npm run build

# 运行测试
npm run test

# 更新文档
npm run update-docs
\`\`\`

### 构建部署
\`\`\`bash
# 构建到dist目录
node tools/build/apply-styles.js
\`\`\`

---
**更新时间**: ${new Date().toLocaleDateString('zh-CN')}
**作者**: sunsky
`;

    fs.writeFileSync('docs/STRUCTURE.md', structureDoc);
    console.log('✅ 生成结构文档: docs/STRUCTURE.md');
}

/**
 * 主执行函数
 */
function main() {
    console.log('🎯 QHU-CTF Learn 模块结构重组开始...\n');
    
    try {
        // 1. 创建新目录结构
        createDirectoryStructure();
        
        // 2. 移动文件到新结构
        moveFilesToNewStructure();
        
        // 3. 更新路径引用
        updatePathReferences();
        
        // 4. 创建配置文件
        createConfigFiles();
        
        // 5. 生成结构文档
        generateStructureDoc();
        
        console.log('\n✅ 项目结构重组完成!');
        console.log('📊 重组统计:');
        console.log(`   - 页面文件: ${Object.values(newStructure.pages).flat().length} 个`);
        console.log(`   - 样式文件: ${newStructure.assets.styles.length} 个`);
        console.log(`   - 脚本文件: ${newStructure.assets.scripts.length} 个`);
        console.log(`   - 工具文件: ${Object.values(newStructure.tools).flat().length} 个`);
        console.log(`   - 文档文件: ${newStructure.docs.length} 个`);
        console.log('\n📖 查看 docs/STRUCTURE.md 了解新结构详情');
        
    } catch (error) {
        console.error('❌ 重组过程中出现错误:', error.message);
        process.exit(1);
    }
}

// 执行重组
if (require.main === module) {
    main();
}

module.exports = {
    createDirectoryStructure,
    moveFilesToNewStructure,
    updatePathReferences,
    createConfigFiles,
    generateStructureDoc
};