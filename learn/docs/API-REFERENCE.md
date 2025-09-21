# QHU-CTF Learn 模块 - API 参考文档

**作者**: sunsky  
**版本**: 2.0.0  
**更新时间**: 2025/9/19  
**API 版本**: v1  
**基础URL**: `https://api.qhu-ctf.com/v1`

## 📋 目录

- [认证系统](#-认证系统)
- [用户管理](#-用户管理)
- [题目系统](#-题目系统)
- [排行榜](#-排行榜)
- [团队管理](#-团队管理)
- [管理员接口](#-管理员接口)
- [错误处理](#-错误处理)
- [数据模型](#-数据模型)

## 🔐 认证系统

### 用户注册
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "studentId": "string",
  "realName": "string"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "userId": "12345",
    "username": "testuser",
    "email": "test@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 用户登录
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "rememberMe": "boolean"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "userId": "12345",
    "username": "testuser",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "profile": {
      "avatar": "https://api.qhu-ctf.com/avatars/12345.jpg",
      "realName": "张三",
      "email": "test@example.com"
    }
  }
}
```

### 刷新令牌
```http
POST /auth/refresh
Content-Type: application/json
Authorization: Bearer {refreshToken}

{
  "refreshToken": "string"
}
```

### 用户登出
```http
POST /auth/logout
Authorization: Bearer {token}
```

## 👤 用户管理

### 获取用户信息
```http
GET /users/profile
Authorization: Bearer {token}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "userId": "12345",
    "username": "testuser",
    "email": "test@example.com",
    "realName": "张三",
    "studentId": "2021001",
    "avatar": "https://api.qhu-ctf.com/avatars/12345.jpg",
    "score": 1250,
    "rank": 15,
    "solvedChallenges": 8,
    "joinDate": "2024-01-15T08:00:00Z",
    "lastActive": "2025-01-10T10:30:00Z",
    "team": {
      "teamId": "team001",
      "teamName": "白帽子团队",
      "role": "member"
    }
  }
}
```

### 更新用户信息
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "realName": "string",
  "email": "string",
  "avatar": "string",
  "bio": "string"
}
```

### 修改密码
```http
PUT /users/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

### 获取用户统计
```http
GET /users/{userId}/stats
Authorization: Bearer {token}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalScore": 1250,
    "currentRank": 15,
    "solvedChallenges": 8,
    "totalChallenges": 25,
    "categoryStats": {
      "web": {"solved": 3, "total": 8},
      "crypto": {"solved": 2, "total": 6},
      "pwn": {"solved": 1, "total": 5},
      "reverse": {"solved": 2, "total": 6}
    },
    "recentSolves": [
      {
        "challengeId": "ch001",
        "challengeName": "SQL注入基础",
        "category": "web",
        "score": 100,
        "solvedAt": "2025-01-10T09:15:00Z"
      }
    ]
  }
}
```

## 🎯 题目系统

### 获取题目列表
```http
GET /challenges?category={category}&difficulty={difficulty}&page={page}&limit={limit}
Authorization: Bearer {token}
```

**查询参数**:
- `category`: 题目分类 (web, crypto, pwn, reverse, misc)
- `difficulty`: 难度等级 (easy, medium, hard)
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20, 最大: 100)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "challengeId": "ch001",
        "title": "SQL注入基础",
        "category": "web",
        "difficulty": "easy",
        "score": 100,
        "solvedCount": 45,
        "totalAttempts": 120,
        "isSolved": true,
        "tags": ["sql", "injection", "beginner"],
        "author": "admin",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 获取题目详情
```http
GET /challenges/{challengeId}
Authorization: Bearer {token}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "challengeId": "ch001",
    "title": "SQL注入基础",
    "description": "这是一道关于SQL注入的基础题目...",
    "category": "web",
    "difficulty": "easy",
    "score": 100,
    "solvedCount": 45,
    "totalAttempts": 120,
    "isSolved": true,
    "solvedAt": "2025-01-10T09:15:00Z",
    "tags": ["sql", "injection", "beginner"],
    "files": [
      {
        "filename": "source.php",
        "url": "https://api.qhu-ctf.com/files/ch001/source.php",
        "size": 1024
      }
    ],
    "hints": [
      {
        "hintId": "hint001",
        "content": "尝试使用单引号闭合SQL语句",
        "cost": 10,
        "isUnlocked": false
      }
    ],
    "author": "admin",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 提交答案
```http
POST /challenges/{challengeId}/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "flag": "string"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "恭喜！答案正确",
  "data": {
    "isCorrect": true,
    "score": 100,
    "newTotalScore": 1350,
    "newRank": 12,
    "solvedAt": "2025-01-10T10:45:00Z",
    "firstBlood": false
  }
}
```

### 获取提示
```http
POST /challenges/{challengeId}/hints/{hintId}/unlock
Authorization: Bearer {token}
```

### 获取题目文件
```http
GET /challenges/{challengeId}/files/{filename}
Authorization: Bearer {token}
```

## 🏆 排行榜

### 获取总排行榜
```http
GET /leaderboard?type={type}&page={page}&limit={limit}
Authorization: Bearer {token}
```

**查询参数**:
- `type`: 排行榜类型 (overall, team, category)
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 50, 最大: 100)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user001",
        "username": "hacker_pro",
        "realName": "李四",
        "score": 2500,
        "solvedChallenges": 20,
        "lastSolveTime": "2025-01-10T08:30:00Z",
        "team": {
          "teamId": "team001",
          "teamName": "白帽子团队"
        }
      }
    ],
    "currentUser": {
      "rank": 15,
      "score": 1250,
      "solvedChallenges": 8
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 234
    }
  }
}
```

### 获取分类排行榜
```http
GET /leaderboard/category/{category}
Authorization: Bearer {token}
```

### 获取团队排行榜
```http
GET /leaderboard/teams
Authorization: Bearer {token}
```

## 👥 团队管理

### 创建团队
```http
POST /teams
Authorization: Bearer {token}
Content-Type: application/json

{
  "teamName": "string",
  "description": "string",
  "isPublic": "boolean"
}
```

### 加入团队
```http
POST /teams/{teamId}/join
Authorization: Bearer {token}
Content-Type: application/json

{
  "inviteCode": "string"
}
```

### 获取团队信息
```http
GET /teams/{teamId}
Authorization: Bearer {token}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "teamId": "team001",
    "teamName": "白帽子团队",
    "description": "专注于Web安全研究的团队",
    "isPublic": true,
    "memberCount": 5,
    "totalScore": 3750,
    "teamRank": 3,
    "createdAt": "2024-01-01T00:00:00Z",
    "members": [
      {
        "userId": "user001",
        "username": "team_leader",
        "role": "leader",
        "score": 1500,
        "joinedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "recentSolves": [
      {
        "challengeId": "ch005",
        "challengeName": "XSS进阶",
        "solvedBy": "user002",
        "score": 200,
        "solvedAt": "2025-01-10T09:30:00Z"
      }
    ]
  }
}
```

## 🔧 管理员接口

### 获取用户列表
```http
GET /admin/users?page={page}&limit={limit}&search={search}
Authorization: Bearer {adminToken}
```

### 创建题目
```http
POST /admin/challenges
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "category": "string",
  "difficulty": "string",
  "score": "number",
  "flag": "string",
  "tags": ["string"],
  "files": ["string"],
  "hints": [
    {
      "content": "string",
      "cost": "number"
    }
  ]
}
```

### 更新题目
```http
PUT /admin/challenges/{challengeId}
Authorization: Bearer {adminToken}
Content-Type: application/json
```

### 删除题目
```http
DELETE /admin/challenges/{challengeId}
Authorization: Bearer {adminToken}
```

### 获取系统统计
```http
GET /admin/stats
Authorization: Bearer {adminToken}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 234,
    "activeUsers": 156,
    "totalChallenges": 25,
    "totalSubmissions": 1250,
    "correctSubmissions": 450,
    "totalTeams": 45,
    "systemHealth": {
      "status": "healthy",
      "uptime": "15d 8h 30m",
      "memoryUsage": "65%",
      "cpuUsage": "23%"
    }
  }
}
```

## ❌ 错误处理

### 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": "详细错误信息",
    "timestamp": "2025-01-10T10:30:00Z",
    "requestId": "req_12345"
  }
}
```

### 常见错误码

| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| `INVALID_CREDENTIALS` | 401 | 用户名或密码错误 |
| `TOKEN_EXPIRED` | 401 | 访问令牌已过期 |
| `INSUFFICIENT_PERMISSIONS` | 403 | 权限不足 |
| `RESOURCE_NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求频率超限 |
| `INTERNAL_SERVER_ERROR` | 500 | 服务器内部错误 |
| `CHALLENGE_ALREADY_SOLVED` | 409 | 题目已解决 |
| `INCORRECT_FLAG` | 400 | 答案错误 |
| `TEAM_FULL` | 409 | 团队人数已满 |

### 错误处理示例

```javascript
// JavaScript 错误处理示例
async function submitFlag(challengeId, flag) {
    try {
        const response = await fetch(`/api/v1/challenges/${challengeId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ flag })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            switch (data.error.code) {
                case 'INCORRECT_FLAG':
                    showError('答案错误，请重试');
                    break;
                case 'CHALLENGE_ALREADY_SOLVED':
                    showInfo('您已经解决了这道题目');
                    break;
                case 'TOKEN_EXPIRED':
                    redirectToLogin();
                    break;
                default:
                    showError(data.error.message);
            }
            return;
        }
        
        // 处理成功响应
        showSuccess('恭喜！答案正确');
        updateUserScore(data.data.newTotalScore);
        
    } catch (error) {
        console.error('提交失败:', error);
        showError('网络错误，请稍后重试');
    }
}
```

## 📊 数据模型

### 用户模型
```typescript
interface User {
  userId: string;
  username: string;
  email: string;
  realName: string;
  studentId: string;
  avatar: string;
  bio: string;
  score: number;
  rank: number;
  role: 'user' | 'admin';
  isActive: boolean;
  joinDate: string;
  lastActive: string;
  team?: {
    teamId: string;
    teamName: string;
    role: 'member' | 'leader';
  };
}
```

### 题目模型
```typescript
interface Challenge {
  challengeId: string;
  title: string;
  description: string;
  category: 'web' | 'crypto' | 'pwn' | 'reverse' | 'misc';
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  flag: string;
  solvedCount: number;
  totalAttempts: number;
  tags: string[];
  files: ChallengeFile[];
  hints: ChallengeHint[];
  author: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 团队模型
```typescript
interface Team {
  teamId: string;
  teamName: string;
  description: string;
  isPublic: boolean;
  memberCount: number;
  maxMembers: number;
  totalScore: number;
  teamRank: number;
  inviteCode: string;
  createdAt: string;
  members: TeamMember[];
}
```

## 🔄 Webhook 事件

### 用户解题事件
```json
{
  "event": "challenge.solved",
  "timestamp": "2025-01-10T10:45:00Z",
  "data": {
    "userId": "user001",
    "username": "hacker_pro",
    "challengeId": "ch001",
    "challengeName": "SQL注入基础",
    "score": 100,
    "isFirstBlood": false,
    "solveTime": "2025-01-10T10:45:00Z"
  }
}
```

### 新用户注册事件
```json
{
  "event": "user.registered",
  "timestamp": "2025-01-10T08:00:00Z",
  "data": {
    "userId": "user123",
    "username": "newbie",
    "email": "newbie@example.com",
    "registrationTime": "2025-01-10T08:00:00Z"
  }
}
```

## 📝 使用示例

### 完整的登录流程
```javascript
// 1. 用户登录
const loginResponse = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
    })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// 2. 获取用户信息
const profileResponse = await fetch('/api/v1/users/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
});

const profileData = await profileResponse.json();

// 3. 获取题目列表
const challengesResponse = await fetch('/api/v1/challenges?category=web', {
    headers: { 'Authorization': `Bearer ${token}` }
});

const challengesData = await challengesResponse.json();
```

## 📞 技术支持

如有API相关问题：

1. **查看错误日志**: 检查响应中的 `requestId`
2. **联系开发团队**: [待补充联系方式]
3. **API状态页面**: [待补充状态页面地址]

---

*本API文档由 QHU-CTF Learn 模块维护，最后更新: 2025/1/10*