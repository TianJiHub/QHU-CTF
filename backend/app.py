#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CTF竞赛平台后端主应用文件
Author: sunsky
功能：Flask应用初始化、蓝图注册、中间件配置
TODO: 添加WebSocket支持实时通知功能
"""

from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
import os
from datetime import timedelta

# 全局扩展实例
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cache = Cache()
limiter = Limiter(key_func=get_remote_address)


def create_app(config_name=None):
    """
    Flask应用工厂函数
    Args:
        config_name: 配置环境名称 ('development', 'production', 'testing')
    Returns:
        Flask应用实例
    """
    app = Flask(__name__)
    
    # 加载配置
    config_name = config_name or os.getenv('FLASK_ENV', 'development')
    app.config.from_object(f'config.{config_name.title()}Config')
    
    # 初始化扩展
    init_extensions(app)
    
    # 注册蓝图
    register_blueprints(app)
    
    # 注册错误处理器
    register_error_handlers(app)
    
    # 注册中间件
    register_middleware(app)
    
    return app


def init_extensions(app):
    """初始化Flask扩展"""
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)
    
    # CORS配置
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # JWT配置
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)


def register_blueprints(app):
    """注册蓝图路由"""
    from app.routes.auth import auth_bp
    from app.routes.user import user_bp
    from app.routes.challenge import challenge_bp
    from app.routes.ranking import ranking_bp
    from app.routes.admin import admin_bp
    from app.routes.notification import notification_bp
    
    # API路由前缀
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(challenge_bp, url_prefix='/api/challenge')
    app.register_blueprint(ranking_bp, url_prefix='/api/ranking')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(notification_bp, url_prefix='/api/notification')


def register_error_handlers(app):
    """注册全局错误处理器"""
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Bad Request',
            'message': '请求参数错误',
            'code': 400
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            'error': 'Unauthorized',
            'message': '未授权访问',
            'code': 401
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            'error': 'Forbidden',
            'message': '权限不足',
            'code': 403
        }), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not Found',
            'message': '资源不存在',
            'code': 404
        }), 404
    
    @app.errorhandler(429)
    def ratelimit_handler(error):
        return jsonify({
            'error': 'Too Many Requests',
            'message': '请求过于频繁，请稍后再试',
            'code': 429
        }), 429
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({
            'error': 'Internal Server Error',
            'message': '服务器内部错误',
            'code': 500
        }), 500


def register_middleware(app):
    """注册中间件"""
    
    @app.before_request
    def before_request():
        """请求前处理"""
        # TODO: 添加请求日志记录
        pass
    
    @app.after_request
    def after_request(response):
        """请求后处理"""
        # 添加安全头
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        return response


# 健康检查端点
@app.route('/health')
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'healthy',
        'message': 'CTF平台运行正常',
        'version': '1.0.0'
    })


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)