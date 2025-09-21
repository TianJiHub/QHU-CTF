从零开始构建一个完整的QHUCTF竞赛平台作为Web系统与技术大作业，需实现以下核心功能和技术要求：

项目概述：
本项目是基于现代化Web技术栈开发的QHUCTF竞赛平台，采用前后端分离架构。前端使用Vue.js 3.x框架配合Tailwind CSS实现响应式UI设计，后端采用Flask框架构建RESTful API服务。数据库系统使用PostgreSQL存储结构化数据，Redis作为高速缓存和会话管理组件。

核心功能模块：
1. 用户认证系统：实现基于JWT的注册/登录/权限控制
2. 题目管理系统：支持多种题型（Web、Pwn、Reverse等）的CRUD操作
3. 积分排名系统：实时计算并展示用户得分
4. 数据可视化：通过EChart动态展示竞赛数据统计
5. 实时通知：WebSocket实现比赛状态更新推送

项目重构规范要求：
1. 项目清理：
   - 移除所有临时文件（*.tmp, *.bak）
   - 清除编译产物（dist/, build/目录）
   - 清理版本控制历史（.git, .svn等）

2. 目录结构：
   ├── frontend/            # Vue.js前端项目
   │   ├── public/          # 静态资源
   │   ├── src/             # 源代码
   │   │   ├── assets/      # 静态资源
   │   │   ├── components/  # Vue组件
   │   │   ├── router/      # 路由配置
   │   │   ├── store/       # Vuex状态管理
   │   │   └── views/       # 页面视图
   ├── backend/             # Flask后端项目
   │   ├── app/             # 应用代码
   │   │   ├── controllers/ # 业务逻辑
   │   │   ├── models/      # 数据模型
   │   │   ├── routes/      # API路由
   │   │   └── utils/       # 工具类
   │   ├── migrations/      # 数据库迁移
   │   └── config.py        # 配置文件
   ├── docs/                # 项目文档
   └── docker-compose.yml   # 容器编排

3. 代码规范：
   - 严格遵循MVC模式组织代码
   - 实现模块化开发（每个功能独立模块）
   - 组件化前端界面（可复用Vue组件）

技术栈说明：
1. 前端技术：
   - 核心框架：Vue.js 3.x（Composition API）
   - UI组件：Tailwind CSS + DaisyUI
   - 图标库：Font Awesome 6
   - 可视化：EChart 5.x
   - 状态管理：Pinia/Vuex

2. 后端技术：
   - Web框架：Flask 2.x
   - ORM：SQLAlchemy 2.0
   - 认证：Flask-JWT-Extended
   - API文档：Swagger UI

3. 数据存储：
   - 主数据库：PostgreSQL 14
   - 缓存：Redis 7.x
   - 会话存储：Redis-Session

4. 开发工具：
   - 版本控制：Git
   - 容器化：Docker + Docker Compose
   - CI/CD：GitHub Actions

附加要求：
1. 每项功能编写详细的技术文档和API文档，随时检查与当前代码相关的文档，及时更新
2. 挨个实现每个功能模块，确保代码质量和功能完整性
3. 每个功能模块完成后，在测试文件夹里写代码进行单元测试和集成测试，并且在测试文件夹里内置删除所有测试文件的脚本
4. 每次输出新功能模块的时候自行debug与其他模块的交互，确保功能的正确性
5. 全都使用相对路径！！！
6. 作者名:sunsky，QQ：1403757164
