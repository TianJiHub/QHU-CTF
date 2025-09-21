#!/usr/bin/env node

/**
 * QHU-CTF Learn Platform - Deployment Script
 * 
 * 功能：
 * - 自动化部署流程
 * - 环境配置管理
 * - 备份与回滚
 * - 健康检查
 * 
 * Author: sunsky
 * Date: 2025-01-10
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// 部署配置
const DEPLOY_CONFIG = {
  environments: {
    development: {
      name: 'Development',
      host: 'localhost',
      port: 3000,
      buildDir: 'dist/',
      deployDir: './deploy/dev/',
      backup: false,
      healthCheck: true
    },
    staging: {
      name: 'Staging',
      host: 'staging.qhu-ctf.com',
      port: 80,
      buildDir: 'dist/',
      deployDir: '/var/www/qhu-ctf-staging/',
      backup: true,
      healthCheck: true,
      ssl: true
    },
    production: {
      name: 'Production',
      host: 'qhu-ctf.com',
      port: 443,
      buildDir: 'dist/',
      deployDir: '/var/www/qhu-ctf/',
      backup: true,
      healthCheck: true,
      ssl: true,
      cdn: true
    }
  },
  backup: {
    maxBackups: 5,
    backupDir: './backups/'
  },
  healthCheck: {
    timeout: 30000,
    retries: 3,
    interval: 5000
  }
};

// 日志工具
const Logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${new Date().toISOString()} - ${msg}`),
  step: (step, total, msg) => console.log(`[${step}/${total}] ${msg}`)
};

// 文件操作工具
const FileUtils = {
  // 确保目录存在
  ensureDir: (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      Logger.info(`创建目录: ${dirPath}`);
    }
  },

  // 复制目录
  copyDir: (src, dest) => {
    try {
      FileUtils.ensureDir(dest);
      
      if (process.platform === 'win32') {
        execSync(`xcopy "${src}" "${dest}" /E /I /Y`, { stdio: 'inherit' });
      } else {
        execSync(`cp -r "${src}"/* "${dest}"/`, { stdio: 'inherit' });
      }
      
      Logger.info(`复制目录: ${src} -> ${dest}`);
      return true;
    } catch (error) {
      Logger.error(`复制目录失败: ${error.message}`);
      return false;
    }
  },

  // 删除目录
  removeDir: (dirPath) => {
    try {
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        Logger.info(`删除目录: ${dirPath}`);
      }
      return true;
    } catch (error) {
      Logger.error(`删除目录失败: ${error.message}`);
      return false;
    }
  },

  // 获取目录大小
  getDirSize: (dirPath) => {
    try {
      let size = 0;
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          size += FileUtils.getDirSize(filePath);
        } else {
          size += stat.size;
        }
      }
      
      return size;
    } catch (error) {
      Logger.error(`获取目录大小失败: ${error.message}`);
      return 0;
    }
  },

  // 格式化文件大小
  formatSize: (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
};

// 部署器类
class Deployer {
  constructor(environment = 'development') {
    this.env = environment;
    this.config = DEPLOY_CONFIG.environments[environment];
    
    if (!this.config) {
      throw new Error(`未知的部署环境: ${environment}`);
    }
    
    this.deployId = `deploy-${Date.now()}`;
    this.startTime = Date.now();
  }

  // 执行部署
  async deploy() {
    try {
      Logger.info(`开始部署到 ${this.config.name} 环境...`);
      Logger.info(`部署ID: ${this.deployId}`);
      
      // 步骤1: 预检查
      Logger.step(1, 6, '执行预检查...');
      await this.preCheck();
      
      // 步骤2: 构建项目
      Logger.step(2, 6, '构建项目...');
      await this.build();
      
      // 步骤3: 备份现有版本
      if (this.config.backup) {
        Logger.step(3, 6, '备份现有版本...');
        await this.backup();
      }
      
      // 步骤4: 部署新版本
      Logger.step(4, 6, '部署新版本...');
      await this.deployFiles();
      
      // 步骤5: 健康检查
      if (this.config.healthCheck) {
        Logger.step(5, 6, '执行健康检查...');
        await this.healthCheck();
      }
      
      // 步骤6: 清理
      Logger.step(6, 6, '清理临时文件...');
      await this.cleanup();
      
      const duration = (Date.now() - this.startTime) / 1000;
      Logger.success(`部署完成！耗时: ${duration.toFixed(2)}s`);
      Logger.info(`访问地址: ${this.getUrl()}`);
      
    } catch (error) {
      Logger.error(`部署失败: ${error.message}`);
      await this.rollback();
      throw error;
    }
  }

  // 预检查
  async preCheck() {
    // 检查构建目录
    if (!fs.existsSync(this.config.buildDir)) {
      throw new Error(`构建目录不存在: ${this.config.buildDir}`);
    }
    
    // 检查部署目录权限
    FileUtils.ensureDir(this.config.deployDir);
    
    // 检查必要的文件
    const requiredFiles = ['index.html'];
    for (const file of requiredFiles) {
      const filePath = path.join(this.config.buildDir, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`缺少必要文件: ${file}`);
      }
    }
    
    Logger.info('预检查通过');
  }

  // 构建项目
  async build() {
    try {
      // 检查是否有构建脚本
      const buildScript = path.join(__dirname, '../build/build.js');
      
      if (fs.existsSync(buildScript)) {
        Logger.info('使用构建脚本构建项目...');
        execSync(`node "${buildScript}"`, { stdio: 'inherit' });
      } else {
        Logger.warn('未找到构建脚本，跳过构建步骤');
      }
      
      // 验证构建结果
      if (!fs.existsSync(this.config.buildDir)) {
        throw new Error('构建失败，输出目录不存在');
      }
      
      const buildSize = FileUtils.getDirSize(this.config.buildDir);
      Logger.info(`构建完成，大小: ${FileUtils.formatSize(buildSize)}`);
      
    } catch (error) {
      throw new Error(`构建失败: ${error.message}`);
    }
  }

  // 备份现有版本
  async backup() {
    if (!fs.existsSync(this.config.deployDir)) {
      Logger.info('部署目录不存在，跳过备份');
      return;
    }
    
    const backupDir = path.join(DEPLOY_CONFIG.backup.backupDir, this.env);
    FileUtils.ensureDir(backupDir);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}`);
    
    if (FileUtils.copyDir(this.config.deployDir, backupPath)) {
      Logger.info(`备份完成: ${backupPath}`);
      
      // 清理旧备份
      await this.cleanupBackups(backupDir);
    } else {
      throw new Error('备份失败');
    }
  }

  // 清理旧备份
  async cleanupBackups(backupDir) {
    try {
      const backups = fs.readdirSync(backupDir)
        .filter(name => name.startsWith('backup-'))
        .map(name => ({
          name,
          path: path.join(backupDir, name),
          time: fs.statSync(path.join(backupDir, name)).mtime
        }))
        .sort((a, b) => b.time - a.time);
      
      if (backups.length > DEPLOY_CONFIG.backup.maxBackups) {
        const toDelete = backups.slice(DEPLOY_CONFIG.backup.maxBackups);
        
        for (const backup of toDelete) {
          FileUtils.removeDir(backup.path);
          Logger.info(`删除旧备份: ${backup.name}`);
        }
      }
      
    } catch (error) {
      Logger.warn(`清理备份失败: ${error.message}`);
    }
  }

  // 部署文件
  async deployFiles() {
    // 创建临时部署目录
    const tempDir = `${this.config.deployDir}.tmp-${this.deployId}`;
    
    try {
      // 复制文件到临时目录
      if (!FileUtils.copyDir(this.config.buildDir, tempDir)) {
        throw new Error('复制文件失败');
      }
      
      // 原子性替换
      if (fs.existsSync(this.config.deployDir)) {
        const oldDir = `${this.config.deployDir}.old-${this.deployId}`;
        fs.renameSync(this.config.deployDir, oldDir);
        fs.renameSync(tempDir, this.config.deployDir);
        FileUtils.removeDir(oldDir);
      } else {
        fs.renameSync(tempDir, this.config.deployDir);
      }
      
      const deploySize = FileUtils.getDirSize(this.config.deployDir);
      Logger.info(`部署完成，大小: ${FileUtils.formatSize(deploySize)}`);
      
    } catch (error) {
      // 清理临时目录
      FileUtils.removeDir(tempDir);
      throw new Error(`部署文件失败: ${error.message}`);
    }
  }

  // 健康检查
  async healthCheck() {
    const url = this.getUrl();
    const { timeout, retries, interval } = DEPLOY_CONFIG.healthCheck;
    
    for (let i = 0; i < retries; i++) {
      try {
        Logger.info(`健康检查 (${i + 1}/${retries}): ${url}`);
        
        // 简单的 HTTP 检查
        const result = await this.httpCheck(url, timeout);
        
        if (result.success) {
          Logger.success(`健康检查通过: ${result.status} ${result.statusText}`);
          return;
        } else {
          throw new Error(`HTTP ${result.status}: ${result.statusText}`);
        }
        
      } catch (error) {
        Logger.warn(`健康检查失败 (${i + 1}/${retries}): ${error.message}`);
        
        if (i < retries - 1) {
          Logger.info(`等待 ${interval}ms 后重试...`);
          await this.sleep(interval);
        }
      }
    }
    
    throw new Error('健康检查失败，所有重试均失败');
  }

  // HTTP 检查
  async httpCheck(url, timeout) {
    return new Promise((resolve) => {
      const http = require(url.startsWith('https:') ? 'https' : 'http');
      
      const req = http.get(url, { timeout }, (res) => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 400,
          status: res.statusCode,
          statusText: res.statusMessage
        });
      });
      
      req.on('error', (error) => {
        resolve({
          success: false,
          status: 0,
          statusText: error.message
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          success: false,
          status: 0,
          statusText: 'Timeout'
        });
      });
    });
  }

  // 清理
  async cleanup() {
    // 清理临时文件
    const tempFiles = fs.readdirSync('.')
      .filter(name => name.includes(this.deployId));
    
    for (const file of tempFiles) {
      try {
        if (fs.statSync(file).isDirectory()) {
          FileUtils.removeDir(file);
        } else {
          fs.unlinkSync(file);
        }
        Logger.info(`清理临时文件: ${file}`);
      } catch (error) {
        Logger.warn(`清理文件失败: ${file} - ${error.message}`);
      }
    }
  }

  // 回滚
  async rollback() {
    Logger.warn('开始回滚...');
    
    try {
      const backupDir = path.join(DEPLOY_CONFIG.backup.backupDir, this.env);
      
      if (!fs.existsSync(backupDir)) {
        throw new Error('没有可用的备份');
      }
      
      // 找到最新的备份
      const backups = fs.readdirSync(backupDir)
        .filter(name => name.startsWith('backup-'))
        .map(name => ({
          name,
          path: path.join(backupDir, name),
          time: fs.statSync(path.join(backupDir, name)).mtime
        }))
        .sort((a, b) => b.time - a.time);
      
      if (backups.length === 0) {
        throw new Error('没有可用的备份');
      }
      
      const latestBackup = backups[0];
      Logger.info(`使用备份: ${latestBackup.name}`);
      
      // 删除当前部署
      FileUtils.removeDir(this.config.deployDir);
      
      // 恢复备份
      if (FileUtils.copyDir(latestBackup.path, this.config.deployDir)) {
        Logger.success('回滚完成');
      } else {
        throw new Error('回滚失败');
      }
      
    } catch (error) {
      Logger.error(`回滚失败: ${error.message}`);
    }
  }

  // 获取访问URL
  getUrl() {
    const protocol = this.config.ssl ? 'https' : 'http';
    const port = (this.config.port === 80 && !this.config.ssl) || 
                 (this.config.port === 443 && this.config.ssl) ? '' : `:${this.config.port}`;
    
    return `${protocol}://${this.config.host}${port}`;
  }

  // 睡眠函数
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 命令行接口
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const environment = args[1] || 'development';
  
  switch (command) {
    case 'deploy':
      deployCommand(environment);
      break;
      
    case 'rollback':
      rollbackCommand(environment);
      break;
      
    case 'list':
      listCommand(environment);
      break;
      
    default:
      showHelp();
  }
}

// 部署命令
async function deployCommand(environment) {
  try {
    const deployer = new Deployer(environment);
    await deployer.deploy();
  } catch (error) {
    Logger.error(`部署失败: ${error.message}`);
    process.exit(1);
  }
}

// 回滚命令
async function rollbackCommand(environment) {
  try {
    const deployer = new Deployer(environment);
    await deployer.rollback();
  } catch (error) {
    Logger.error(`回滚失败: ${error.message}`);
    process.exit(1);
  }
}

// 列出备份
function listCommand(environment) {
  const backupDir = path.join(DEPLOY_CONFIG.backup.backupDir, environment);
  
  if (!fs.existsSync(backupDir)) {
    Logger.info('没有找到备份');
    return;
  }
  
  const backups = fs.readdirSync(backupDir)
    .filter(name => name.startsWith('backup-'))
    .map(name => {
      const backupPath = path.join(backupDir, name);
      const stat = fs.statSync(backupPath);
      const size = FileUtils.getDirSize(backupPath);
      
      return {
        name,
        time: stat.mtime.toISOString(),
        size: FileUtils.formatSize(size)
      };
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time));
  
  if (backups.length === 0) {
    Logger.info('没有找到备份');
    return;
  }
  
  Logger.info(`${environment} 环境的备份列表:`);
  console.table(backups);
}

// 显示帮助
function showHelp() {
  console.log(`
QHU-CTF Learn Platform - 部署工具

用法:
  node deploy.js <command> [environment]

命令:
  deploy     部署到指定环境
  rollback   回滚到上一个版本
  list       列出备份

环境:
  development  开发环境 (默认)
  staging      测试环境
  production   生产环境

示例:
  node deploy.js deploy development
  node deploy.js deploy production
  node deploy.js rollback production
  node deploy.js list production
`);
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = Deployer;