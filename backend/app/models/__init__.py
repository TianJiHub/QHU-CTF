#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CTF竞赛平台数据库模型包
Author: sunsky
功能：统一导入所有数据库模型
"""

from .user import User, UserProfile
from .challenge import Challenge, Category, Tag, ChallengeTag
from .submission import Submission, Flag
from .team import Team, TeamMember
from .notification import Notification
from .admin import AdminLog

__all__ = [
    'User', 'UserProfile',
    'Challenge', 'Category', 'Tag', 'ChallengeTag',
    'Submission', 'Flag',
    'Team', 'TeamMember',
    'Notification',
    'AdminLog'
]