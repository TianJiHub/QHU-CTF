/**
 * 批量更新所有HTML文件的导航栏
 * Author: sunsky
 * 功能：统一所有页面的导航栏结构，确保响应式设计和主题切换功能
 */

const fs = require('fs');
const path = require('path');

// 统一导航栏HTML模板
const navbarTemplate = `    <!-- 导航栏 -->
    <nav class="navbar" role="navigation" aria-label="主导航">
        <div class="nav-container">
            <a href="index.html" class="nav-brand" aria-label="QHUCTF首页">🛡️ QHUCTF</a>
            <button class="nav-toggle" onclick="toggleNav()" aria-label="切换导航菜单" aria-expanded="false">☰</button>
            <ul class="nav-menu" id="navMenu" role="menubar">
                <li role="none"><a href="index.html" class="nav-link" role="menuitem">首页</a></li>
                <li role="none"><a href="challenges.html" class="nav-link" role="menuitem">题目</a></li>
                <li role="none"><a href="scoreboard.html" class="nav-link" role="menuitem">排行榜</a></li>
                <li role="none"><a href="not-implemented.html?feature=team" class="nav-link" role="menuitem">团队</a></li>
                <li role="none"><a href="not-implemented.html?feature=user" class="nav-link" role="menuitem">用户</a></li>
                <li role="none"><a href="login.html" class="nav-link" role="menuitem">登录</a></li>
                <li role="none"><button class="theme-toggle" id="themeToggle" title="切换主题" aria-label="切换深浅主题">🌙</button></li>
            </ul>
        </div>
    </nav>`;

// 需要更新的HTML文件列表
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

// 导航栏正则表达式（匹配现有的导航栏结构）
const navbarRegex = /<!--\s*导航栏\s*-->[\s\S]*?<\/nav>|<nav[^>]*class="navbar"[^>]*>[\s\S]*?<\/nav>/g;

/**
 * 更新单个HTML文件的导航栏
 * @param {string} filePath - 文件路径
 */
function updateNavbarInFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  文件不存在: ${filePath}`);
            return false;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        
        // 检查是否已有导航栏
        if (navbarRegex.test(content)) {
            // 替换现有导航栏
            content = content.replace(navbarRegex, navbarTemplate);
            console.log(`✅ 已更新导航栏: ${path.basename(filePath)}`);
        } else {
            // 查找插入位置（在body标签后或main标签前）
            const bodyMatch = content.match(/<body[^>]*>/);
            const mainMatch = content.match(/<main[^>]*>/);
            
            if (bodyMatch) {
                const insertIndex = bodyMatch.index + bodyMatch[0].length;
                content = content.slice(0, insertIndex) + '\n\n' + navbarTemplate + '\n' + content.slice(insertIndex);
                console.log(`✅ 已插入导航栏: ${path.basename(filePath)}`);
            } else if (mainMatch) {
                const insertIndex = mainMatch.index;
                content = content.slice(0, insertIndex) + navbarTemplate + '\n\n    ' + content.slice(insertIndex);
                console.log(`✅ 已插入导航栏: ${path.basename(filePath)}`);
            } else {
                console.log(`⚠️  无法找到插入位置: ${path.basename(filePath)}`);
                return false;
            }
        }

        // 写回文件
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    } catch (error) {
        console.error(`❌ 更新失败 ${path.basename(filePath)}: ${error.message}`);
        return false;
    }
}

/**
 * 批量更新所有HTML文件
 */
function updateAllNavbars() {
    console.log('🚀 开始批量更新导航栏...\n');
    
    let successCount = 0;
    let totalCount = 0;

    htmlFiles.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        totalCount++;
        
        if (updateNavbarInFile(filePath)) {
            successCount++;
        }
    });

    console.log(`\n📊 更新完成: ${successCount}/${totalCount} 个文件成功更新`);
    
    if (successCount === totalCount) {
        console.log('🎉 所有文件导航栏已成功统一！');
    } else {
        console.log('⚠️  部分文件更新失败，请检查日志');
    }
}

// 执行更新
if (require.main === module) {
    updateAllNavbars();
}

module.exports = { updateNavbarInFile, updateAllNavbars };