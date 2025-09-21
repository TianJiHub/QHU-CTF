#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CTF竞赛平台启动文件
Author: sunsky
功能：开发环境应用启动入口
TODO: 添加生产环境WSGI配置
"""

import os
from app import create_app, db
from flask_migrate import upgrade


def deploy():
    """部署函数：创建数据库表和初始数据"""
    app = create_app(os.getenv('FLASK_ENV') or 'development')
    
    with app.app_context():
        # 创建数据库表
        db.create_all()
        
        # 运行数据库迁移
        try:
            upgrade()
        except Exception as e:
            print(f"数据库迁移失败: {e}")
        
        # 创建初始管理员用户
        from app.models.user import User
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@ctf.local',
                is_admin=True,
                is_active=True
            )
            admin.set_password('admin123')  # 生产环境需要修改
            db.session.add(admin)
            db.session.commit()
            print("创建默认管理员用户: admin/admin123")


if __name__ == '__main__':
    # 获取环境配置
    env = os.getenv('FLASK_ENV', 'development')
    
    # 创建应用实例
    app = create_app(env)
    
    # 开发环境自动部署
    if env == 'development':
        with app.app_context():
            deploy()
    
    # 启动应用
    app.run(
        host=os.getenv('FLASK_HOST', '0.0.0.0'),
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=(env == 'development')
    )