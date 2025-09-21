/**
 * 活动跟踪器 - 用于跟踪和显示用户活动数据
 * Author: sunsky
 * 功能：实时更新用户活动统计、最近活动记录
 * TODO: 添加实时WebSocket连接支持
 */

class ActivityTracker {
    constructor() {
        this.activities = [];
        this.updateInterval = 30000; // 30秒更新一次
        this.intervalId = null;
    }

    /**
     * 初始化活动跟踪器
     */
    init() {
        this.loadRecentActivities();
        this.startPeriodicUpdate();
    }

    /**
     * 加载最近活动数据
     */
    async loadRecentActivities() {
        try {
            // 模拟从API获取最近活动数据
            const activities = this.generateMockActivities();
            this.activities = activities;
            this.updateActivityDisplay();
        } catch (error) {
            console.error('加载活动数据失败:', error);
        }
    }

    /**
     * 生成模拟活动数据
     */
    generateMockActivities() {
        const activityTypes = [
            { type: 'solve', icon: '✅', color: '#28a745' },
            { type: 'attempt', icon: '🔍', color: '#ffc107' },
            { type: 'register', icon: '👤', color: '#17a2b8' },
            { type: 'login', icon: '🔐', color: '#6c757d' }
        ];

        const users = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
        const challenges = ['SQL注入基础', 'XSS攻击', '密码破解', '逆向工程', '取证分析'];

        const activities = [];
        const now = new Date();

        for (let i = 0; i < 20; i++) {
            const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
            const user = users[Math.floor(Math.random() * users.length)];
            const challenge = challenges[Math.floor(Math.random() * challenges.length)];
            
            // 生成过去2小时内的随机时间
            const timestamp = new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000);

            let description = '';
            switch (activityType.type) {
                case 'solve':
                    description = `${user} 成功解决了 "${challenge}"`;
                    break;
                case 'attempt':
                    description = `${user} 正在尝试 "${challenge}"`;
                    break;
                case 'register':
                    description = `${user} 注册了新账户`;
                    break;
                case 'login':
                    description = `${user} 登录了平台`;
                    break;
            }

            activities.push({
                id: i + 1,
                type: activityType.type,
                icon: activityType.icon,
                color: activityType.color,
                description: description,
                user: user,
                timestamp: timestamp,
                timeAgo: this.getTimeAgo(timestamp)
            });
        }

        // 按时间排序（最新的在前）
        return activities.sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * 计算相对时间
     */
    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        return timestamp.toLocaleDateString();
    }

    /**
     * 更新活动显示
     */
    updateActivityDisplay() {
        const container = document.getElementById('recent-activities');
        if (!container) return;

        const html = this.activities.slice(0, 10).map(activity => `
            <div class="activity-item" data-type="${activity.type}">
                <div class="activity-icon" style="color: ${activity.color}">
                    ${activity.icon}
                </div>
                <div class="activity-content">
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${activity.timeAgo}</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    /**
     * 添加新活动
     */
    addActivity(type, description, user) {
        const activityTypes = {
            'solve': { icon: '✅', color: '#28a745' },
            'attempt': { icon: '🔍', color: '#ffc107' },
            'register': { icon: '👤', color: '#17a2b8' },
            'login': { icon: '🔐', color: '#6c757d' }
        };

        const activityType = activityTypes[type] || activityTypes['attempt'];
        const timestamp = new Date();

        const newActivity = {
            id: Date.now(),
            type: type,
            icon: activityType.icon,
            color: activityType.color,
            description: description,
            user: user,
            timestamp: timestamp,
            timeAgo: '刚刚'
        };

        this.activities.unshift(newActivity);
        this.activities = this.activities.slice(0, 50); // 保持最近50条记录
        this.updateActivityDisplay();
    }

    /**
     * 开始定期更新
     */
    startPeriodicUpdate() {
        this.intervalId = setInterval(() => {
            // 更新时间显示
            this.activities.forEach(activity => {
                activity.timeAgo = this.getTimeAgo(activity.timestamp);
            });
            this.updateActivityDisplay();

            // 偶尔添加新的模拟活动
            if (Math.random() < 0.3) {
                const mockActivity = this.generateMockActivities()[0];
                this.addActivity(
                    mockActivity.type,
                    mockActivity.description,
                    mockActivity.user
                );
            }
        }, this.updateInterval);
    }

    /**
     * 停止定期更新
     */
    stopPeriodicUpdate() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * 获取活动统计
     */
    getActivityStats() {
        const stats = {
            total: this.activities.length,
            solves: this.activities.filter(a => a.type === 'solve').length,
            attempts: this.activities.filter(a => a.type === 'attempt').length,
            registrations: this.activities.filter(a => a.type === 'register').length,
            logins: this.activities.filter(a => a.type === 'login').length
        };

        return stats;
    }

    /**
     * 销毁跟踪器
     */
    destroy() {
        this.stopPeriodicUpdate();
        this.activities = [];
    }
}

// 导出类供其他模块使用
window.ActivityTracker = ActivityTracker;