#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CTF竞赛平台用户模型
Author: sunsky
功能：用户认证、权限管理、个人信息
TODO: 添加OAuth第三方登录支持
"""

from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token, create_refresh_token
import secrets
import string

db = SQLAlchemy()


class User(db.Model):
    """用户基础模型"""
    __tablename__ = 'users'
    
    # 基础字段
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # 状态字段
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    
    # 时间字段
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # 验证字段
    email_verification_token = db.Column(db.String(100))
    email_verification_sent_at = db.Column(db.DateTime)
    password_reset_token = db.Column(db.String(100))
    password_reset_sent_at = db.Column(db.DateTime)
    
    # 关联关系
    profile = db.relationship('UserProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    submissions = db.relationship('Submission', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    team_memberships = db.relationship('TeamMember', backref='user', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def __init__(self, username, email, password=None):
        self.username = username
        self.email = email
        if password:
            self.set_password(password)
    
    def set_password(self, password):
        """设置密码哈希"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """验证密码"""
        return check_password_hash(self.password_hash, password)
    
    def generate_tokens(self):
        """生成JWT访问令牌和刷新令牌"""
        access_token = create_access_token(
            identity=self.id,
            additional_claims={
                'username': self.username,
                'is_admin': self.is_admin,
                'is_verified': self.is_verified
            }
        )
        refresh_token = create_refresh_token(identity=self.id)
        return access_token, refresh_token
    
    def generate_verification_token(self):
        """生成邮箱验证令牌"""
        token = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
        self.email_verification_token = token
        self.email_verification_sent_at = datetime.utcnow()
        return token
    
    def verify_email(self, token):
        """验证邮箱令牌"""
        if not self.email_verification_token or self.email_verification_token != token:
            return False
        
        # 检查令牌是否过期（24小时）
        if self.email_verification_sent_at and \
           datetime.utcnow() - self.email_verification_sent_at > timedelta(hours=24):
            return False
        
        self.is_verified = True
        self.email_verification_token = None
        self.email_verification_sent_at = None
        return True
    
    def generate_password_reset_token(self):
        """生成密码重置令牌"""
        token = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
        self.password_reset_token = token
        self.password_reset_sent_at = datetime.utcnow()
        return token
    
    def reset_password(self, token, new_password):
        """重置密码"""
        if not self.password_reset_token or self.password_reset_token != token:
            return False
        
        # 检查令牌是否过期（1小时）
        if self.password_reset_sent_at and \
           datetime.utcnow() - self.password_reset_sent_at > timedelta(hours=1):
            return False
        
        self.set_password(new_password)
        self.password_reset_token = None
        self.password_reset_sent_at = None
        return True
    
    def update_last_login(self):
        """更新最后登录时间"""
        self.last_login = datetime.utcnow()
    
    def get_score(self):
        """获取用户总分"""
        if not self.profile:
            return 0
        return self.profile.total_score
    
    def get_solved_challenges(self):
        """获取已解决的题目数量"""
        from .submission import Submission
        return Submission.query.filter_by(
            user_id=self.id,
            is_correct=True
        ).distinct(Submission.challenge_id).count()
    
    def get_team(self):
        """获取用户当前所在团队"""
        active_membership = next(
            (tm for tm in self.team_memberships if tm.is_active),
            None
        )
        return active_membership.team if active_membership else None
    
    def to_dict(self, include_sensitive=False):
        """转换为字典格式"""
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email if include_sensitive else None,
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'total_score': self.get_score(),
            'solved_challenges': self.get_solved_challenges()
        }
        
        # 包含个人资料信息
        if self.profile:
            data.update({
                'nickname': self.profile.nickname,
                'avatar_url': self.profile.avatar_url,
                'bio': self.profile.bio,
                'school': self.profile.school,
                'major': self.profile.major
            })
        
        # 包含团队信息
        team = self.get_team()
        if team:
            data['team'] = {
                'id': team.id,
                'name': team.name
            }
        
        return data
    
    def __repr__(self):
        return f'<User {self.username}>'


class UserProfile(db.Model):
    """用户详细资料模型"""
    __tablename__ = 'user_profiles'
    
    # 基础字段
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # 个人信息
    nickname = db.Column(db.String(100))
    real_name = db.Column(db.String(100))
    avatar_url = db.Column(db.String(255))
    bio = db.Column(db.Text)
    
    # 教育信息
    school = db.Column(db.String(200))
    major = db.Column(db.String(100))
    grade = db.Column(db.String(50))
    student_id = db.Column(db.String(50))
    
    # 联系信息
    phone = db.Column(db.String(20))
    qq = db.Column(db.String(20))
    wechat = db.Column(db.String(50))
    github = db.Column(db.String(100))
    
    # 竞赛统计
    total_score = db.Column(db.Integer, default=0, nullable=False)
    rank = db.Column(db.Integer)
    solved_count = db.Column(db.Integer, default=0, nullable=False)
    submission_count = db.Column(db.Integer, default=0, nullable=False)
    
    # 偏好设置
    preferred_language = db.Column(db.String(10), default='zh-CN')
    timezone = db.Column(db.String(50), default='Asia/Shanghai')
    email_notifications = db.Column(db.Boolean, default=True)
    
    # 时间字段
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def update_statistics(self):
        """更新用户统计信息"""
        from .submission import Submission
        
        # 更新提交次数
        self.submission_count = Submission.query.filter_by(user_id=self.user_id).count()
        
        # 更新解题数量和总分
        correct_submissions = Submission.query.filter_by(
            user_id=self.user_id,
            is_correct=True
        ).all()
        
        self.solved_count = len(set(sub.challenge_id for sub in correct_submissions))
        self.total_score = sum(sub.challenge.points for sub in correct_submissions)
    
    def to_dict(self):
        """转换为字典格式"""
        return {
            'nickname': self.nickname,
            'real_name': self.real_name,
            'avatar_url': self.avatar_url,
            'bio': self.bio,
            'school': self.school,
            'major': self.major,
            'grade': self.grade,
            'phone': self.phone,
            'qq': self.qq,
            'wechat': self.wechat,
            'github': self.github,
            'total_score': self.total_score,
            'rank': self.rank,
            'solved_count': self.solved_count,
            'submission_count': self.submission_count,
            'preferred_language': self.preferred_language,
            'timezone': self.timezone,
            'email_notifications': self.email_notifications
        }
    
    def __repr__(self):
        return f'<UserProfile {self.user.username}>'