/**
 * 数据加载器 - 用于加载和管理平台数据
 * Author: sunsky
 * 功能：加载题目、用户、新闻等数据并更新页面显示
 * TODO: 添加缓存机制和错误重试逻辑
 */

class DataLoader {
    constructor() {
        this.challenges = [];
        this.users = [];
        this.news = [];
        this.stats = {};
        this.basePath = '../assets/data/';
    }

    /**
     * 初始化数据加载器
     */
    async init() {
        try {
            await this.loadInitialData();
            this.updateHomepageStats();
            this.updateRecentActivities();
            this.updateLatestNews();
        } catch (error) {
            console.error('数据加载器初始化失败:', error);
        }
    }

    /**
     * 加载初始数据
     */
    async loadInitialData() {
        const promises = [
            this.loadChallenges(),
            this.loadUsers(),
            this.loadNews()
        ];

        await Promise.all(promises);
        this.calculateStats();
    }

    /**
     * 加载题目数据
     */
    async loadChallenges() {
        try {
            const response = await fetch(this.basePath + 'challenges.json');
            const data = await response.json();
            this.challenges = data.challenges || [];
        } catch (error) {
            console.error('加载题目数据失败:', error);
            this.challenges = [];
        }
    }

    /**
     * 加载用户数据
     */
    async loadUsers() {
        try {
            const response = await fetch(this.basePath + 'users.json');
            const data = await response.json();
            this.users = data.users || [];
            this.stats = data.stats || {};
        } catch (error) {
            console.error('加载用户数据失败:', error);
            this.users = [];
        }
    }

    /**
     * 加载新闻数据
     */
    async loadNews() {
        try {
            const response = await fetch(this.basePath + 'news.json');
            const data = await response.json();
            this.news = data.news || [];
        } catch (error) {
            console.error('加载新闻数据失败:', error);
            this.news = [];
        }
    }

    /**
     * 计算统计数据
     */
    calculateStats() {
        // 计算活跃用户数（最近7天登录的用户）
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const activeUsers = this.users.filter(user => {
            const lastActive = new Date(user.lastActive);
            return lastActive >= sevenDaysAgo;
        }).length;

        // 计算总解题次数
        const totalSolves = this.users.reduce((sum, user) => sum + (user.solvedCount || 0), 0);

        // 模拟在线用户数（活跃用户的30-60%）
        const onlineUsers = Math.floor(activeUsers * (0.3 + Math.random() * 0.3));

        this.stats = {
            ...this.stats,
            activeUsers: activeUsers,
            totalChallenges: this.challenges.length,
            totalSolves: totalSolves,
            onlineUsers: onlineUsers
        };
    }

    /**
     * 更新首页统计数据
     */
    updateHomepageStats() {
        // 更新活跃用户数
        const activeUsersElement = document.getElementById('active-users-count');
        if (activeUsersElement) {
            this.animateNumber(activeUsersElement, this.stats.activeUsers || 156);
        }

        // 更新题目数量
        const challengesElement = document.getElementById('challenges-count');
        if (challengesElement) {
            this.animateNumber(challengesElement, this.stats.totalChallenges || 42);
        }

        // 更新解题次数
        const solvesElement = document.getElementById('solves-count');
        if (solvesElement) {
            this.animateNumber(solvesElement, this.stats.totalSolves || 1234);
        }

        // 更新在线用户数
        const onlineUsersElement = document.getElementById('online-users-count');
        if (onlineUsersElement) {
            this.animateNumber(onlineUsersElement, this.stats.onlineUsers || 89);
        }
    }

    /**
     * 数字动画效果
     */
    animateNumber(element, targetValue) {
        const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const duration = 1500; // 1.5秒动画
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            // 格式化数字（添加千位分隔符）
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * 更新最近活动
     */
    updateRecentActivities(activities) {
        const container = document.querySelector('.recent-activities-list');
        if (!container || !activities) return;

        container.innerHTML = '';
        
        activities.slice(0, 5).forEach(activity => {
            const activityElement = this.createActivityElement(activity);
            container.appendChild(activityElement);
        });
    }

    /**
     * 创建活动元素
     */
    createActivityElement(activity) {
        const div = document.createElement('div');
        div.className = 'activity-item';
        
        const actionText = activity.action === 'solved' ? '解决了' : '尝试了';
        const statusClass = activity.action === 'solved' ? 'success' : 'attempt';
        const timeAgo = this.getTimeAgo(activity.timestamp);
        
        div.innerHTML = `
            <div class="activity-content">
                <div class="activity-user">${activity.user}</div>
                <div class="activity-description">
                    <span class="activity-action ${statusClass}">${actionText}</span>
                    <span class="activity-challenge">${activity.challenge}</span>
                    ${activity.points > 0 ? `<span class="activity-points">+${activity.points}分</span>` : ''}
                </div>
                <div class="activity-time">${timeAgo}</div>
            </div>
        `;
        
        return div;
    }

    /**
     * 更新最新新闻
     */
    updateLatestNews(news) {
        const container = document.querySelector('.news-list');
        if (!container || !news) return;

        container.innerHTML = '';
        
        news.slice(0, 3).forEach(article => {
            const newsElement = this.createNewsElement(article);
            container.appendChild(newsElement);
        });
    }

    /**
     * 创建新闻元素
     */
    createNewsElement(article) {
        const div = document.createElement('div');
        div.className = 'news-item';
        if (article.featured) {
            div.classList.add('featured');
        }
        
        const publishedDate = new Date(article.published_at).toLocaleDateString('zh-CN');
        
        div.innerHTML = `
            <div class="news-content">
                <div class="news-category" style="color: ${this.getCategoryColor(article.category)}">${article.category}</div>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-summary">${article.summary}</p>
                <div class="news-meta">
                    <span class="news-author">${article.author}</span>
                    <span class="news-date">${publishedDate}</span>
                    <span class="news-views">${article.views} 阅读</span>
                </div>
            </div>
        `;
        
        return div;
    }

    /**
     * 更新难度统计
     */
    updateDifficultyStats(distribution) {
        Object.entries(distribution).forEach(([difficulty, count]) => {
            const element = document.querySelector(`.difficulty-${difficulty.toLowerCase()} .count`);
            if (element) {
                element.textContent = count;
            }
        });
    }

    /**
     * 更新分类统计
     */
    updateCategoryStats(categories) {
        const container = document.querySelector('.category-stats');
        if (!container) return;

        container.innerHTML = '';
        
        categories.forEach(category => {
            const div = document.createElement('div');
            div.className = 'category-item';
            div.innerHTML = `
                <div class="category-name">${category.category}</div>
                <div class="category-count">${category.solved_count}</div>
                <div class="category-popularity">${category.popularity}%</div>
            `;
            container.appendChild(div);
        });
    }

    /**
     * 更新元素内容
     */
    updateElement(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = content;
        }
    }

    /**
     * 获取分类颜色
     */
    getCategoryColor(category) {
        const colors = {
            '比赛公告': '#FF6B6B',
            '课程公告': '#4ECDC4',
            '题目更新': '#45B7D1',
            '系统更新': '#96CEB4',
            '社区公告': '#FFEAA7'
        };
        return colors[category] || '#8ECFC9';
    }

    /**
     * 获取相对时间
     */
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) {
            return `${minutes}分钟前`;
        } else if (hours < 24) {
            return `${hours}小时前`;
        } else {
            return `${days}天前`;
        }
    }

    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
        console.log('Data cache cleared');
    }

    /**
     * 刷新数据
     */
    async refreshData() {
        this.clearCache();
        await this.loadInitialData();
        console.log('Data refreshed');
    }
}

// 页面加载完成后初始化数据加载器
document.addEventListener('DOMContentLoaded', () => {
    window.dataLoader = new DataLoader();
});

// 导出数据加载器类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}