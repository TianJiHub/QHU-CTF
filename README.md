# QHU-CTF竞赛平台

## 🎯 项目简介

QHU-CTF网络安全竞赛平台，专注于CTF竞赛组织和网络安全教育

## 🚀 快速开始

### 开发环境启动（未实现）

```bash
# 克隆项目
git clone https://github.com/TianJiHub/QHU-CTF
cd QHU-CTF

# 启动开发环境
docker-compose up -d

# 访问应用
# 前端：http://localhost:3000
# 后端API：http://localhost:5000
```

### 学习版本（纯HTML）

```bash
# 进入学习目录
cd learn

# 启动本地服务器
python -m http.server 8080

# 访问：http://localhost:8080
```

## 📁 项目结构

```
QHU-CTF/
├── frontend/          # Vue.js前端应用
├── backend/           # Flask后端API
├── learn/             # HTML学习版本
├── docs/              # 项目文档
├── config/            # 配置文件
└── tests/             # 测试文件
```

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
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- **开发者**: sunsky
- **项目地址**: https://github.com/TianJiHub/QHU-CTF
- **联系方式**: QQ: 1403757164
- **更新时间**: 2025/9/19

---

*致力于推动网络安全教育和技术发展，欢迎社区贡献和反馈。*
