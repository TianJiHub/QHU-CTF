#!/usr/bin/env node

/**
 * QHU-CTF Learn Platform - Development Server
 * 
 * 功能：
 * - 启动本地开发服务器
 * - 热重载支持
 * - 代理API请求
 * - 静态文件服务
 * 
 * Author: sunsky
 * Date: 2025-01-10
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 开发服务器配置
const DEV_CONFIG = {
  port: 3000,
  host: 'localhost',
  root: 'src/',
  proxy: {
    '/api': 'http://localhost:8080'
  },
  hotReload: true,
  cors: true,
  fallback: 'index.html'
};

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// 日志工具
const Logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${new Date().toISOString()} - ${msg}`),
  request: (method, url, status) => {
    const color = status >= 400 ? '\x1b[31m' : status >= 300 ? '\x1b[33m' : '\x1b[32m';
    console.log(`${color}[${method}] ${url} - ${status}\x1b[0m`);
  }
};

// 文件监听器
class FileWatcher {
  constructor(root) {
    this.root = root;
    this.clients = new Set();
    this.watchers = new Map();
    this.setupWatchers();
  }

  // 设置文件监听
  setupWatchers() {
    if (!DEV_CONFIG.hotReload) return;

    const watchDir = (dir) => {
      try {
        const watcher = fs.watch(dir, { recursive: true }, (eventType, filename) => {
          if (filename && this.shouldReload(filename)) {
            Logger.info(`文件变更: ${filename}`);
            this.notifyClients(filename);
          }
        });
        
        this.watchers.set(dir, watcher);
        Logger.info(`监听目录: ${dir}`);
      } catch (error) {
        Logger.error(`监听目录失败: ${dir} - ${error.message}`);
      }
    };

    watchDir(this.root);
  }

  // 判断是否需要重载
  shouldReload(filename) {
    const ext = path.extname(filename).toLowerCase();
    return ['.html', '.css', '.js'].includes(ext);
  }

  // 添加客户端
  addClient(response) {
    this.clients.add(response);
    Logger.info(`SSE 客户端连接，当前连接数: ${this.clients.size}`);
  }

  // 移除客户端
  removeClient(response) {
    this.clients.delete(response);
    Logger.info(`SSE 客户端断开，当前连接数: ${this.clients.size}`);
  }

  // 通知所有客户端
  notifyClients(filename) {
    const message = JSON.stringify({
      type: 'reload',
      file: filename,
      timestamp: Date.now()
    });

    this.clients.forEach(client => {
      try {
        client.write(`data: ${message}\n\n`);
      } catch (error) {
        this.clients.delete(client);
      }
    });
  }

  // 关闭监听器
  close() {
    this.watchers.forEach(watcher => watcher.close());
    this.watchers.clear();
    this.clients.clear();
  }
}

// 开发服务器类
class DevServer {
  constructor(config = {}) {
    this.config = { ...DEV_CONFIG, ...config };
    this.watcher = new FileWatcher(this.config.root);
    this.server = null;
  }

  // 启动服务器
  start() {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    this.server.listen(this.config.port, this.config.host, () => {
      Logger.success(`开发服务器启动成功！`);
      Logger.info(`地址: http://${this.config.host}:${this.config.port}`);
      Logger.info(`根目录: ${path.resolve(this.config.root)}`);
      Logger.info(`热重载: ${this.config.hotReload ? '启用' : '禁用'}`);
    });

    // 优雅关闭
    process.on('SIGINT', () => {
      Logger.info('正在关闭服务器...');
      this.stop();
    });
  }

  // 停止服务器
  stop() {
    if (this.server) {
      this.server.close();
    }
    if (this.watcher) {
      this.watcher.close();
    }
    process.exit(0);
  }

  // 处理请求
  async handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 设置 CORS 头
    if (this.config.cors) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      // SSE 热重载端点
      if (pathname === '/__dev_reload__') {
        this.handleSSE(req, res);
        return;
      }

      // API 代理
      if (this.shouldProxy(pathname)) {
        await this.handleProxy(req, res);
        return;
      }

      // 静态文件服务
      await this.handleStatic(req, res, pathname);

    } catch (error) {
      Logger.error(`请求处理失败: ${error.message}`);
      this.sendError(res, 500, 'Internal Server Error');
    }
  }

  // 处理 SSE 连接
  handleSSE(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    res.write('data: {"type":"connected"}\n\n');
    
    this.watcher.addClient(res);

    req.on('close', () => {
      this.watcher.removeClient(res);
    });
  }

  // 判断是否需要代理
  shouldProxy(pathname) {
    return Object.keys(this.config.proxy).some(prefix => 
      pathname.startsWith(prefix)
    );
  }

  // 处理代理请求
  async handleProxy(req, res) {
    // 简单的代理实现
    // 实际项目中建议使用 http-proxy-middleware
    Logger.request(req.method, req.url, 'PROXY');
    this.sendError(res, 501, 'Proxy not implemented');
  }

  // 处理静态文件
  async handleStatic(req, res, pathname) {
    let filePath = this.resolveFilePath(pathname);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      // 尝试 fallback
      if (this.config.fallback) {
        filePath = path.join(this.config.root, this.config.fallback);
        if (!fs.existsSync(filePath)) {
          Logger.request(req.method, req.url, 404);
          this.sendError(res, 404, 'Not Found');
          return;
        }
      } else {
        Logger.request(req.method, req.url, 404);
        this.sendError(res, 404, 'Not Found');
        return;
      }
    }

    // 检查是否为目录
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
      } else {
        Logger.request(req.method, req.url, 403);
        this.sendError(res, 403, 'Directory listing not allowed');
        return;
      }
    }

    // 读取文件
    try {
      let content = fs.readFileSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

      // 注入热重载脚本
      if (ext === '.html' && this.config.hotReload) {
        content = this.injectHotReload(content.toString());
      }

      res.writeHead(200, {
        'Content-Type': mimeType,
        'Content-Length': Buffer.byteLength(content)
      });
      
      res.end(content);
      Logger.request(req.method, req.url, 200);

    } catch (error) {
      Logger.error(`读取文件失败: ${filePath} - ${error.message}`);
      this.sendError(res, 500, 'Internal Server Error');
    }
  }

  // 解析文件路径
  resolveFilePath(pathname) {
    // 移除查询参数和锚点
    pathname = pathname.split('?')[0].split('#')[0];
    
    // 防止路径遍历攻击
    pathname = pathname.replace(/\.\./g, '');
    
    // 移除开头的斜杠
    if (pathname.startsWith('/')) {
      pathname = pathname.slice(1);
    }
    
    // 如果路径为空，使用 index.html
    if (!pathname) {
      pathname = 'index.html';
    }
    
    return path.join(this.config.root, pathname);
  }

  // 注入热重载脚本
  injectHotReload(html) {
    const script = `
<script>
(function() {
  const eventSource = new EventSource('/__dev_reload__');
  
  eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'reload') {
      console.log('[Dev Server] 文件变更，重新加载页面:', data.file);
      location.reload();
    }
  };
  
  eventSource.onerror = function(event) {
    console.warn('[Dev Server] SSE 连接错误，尝试重连...');
    setTimeout(() => location.reload(), 1000);
  };
  
  console.log('[Dev Server] 热重载已启用');
})();
</script>`;

    // 在 </body> 前插入脚本
    if (html.includes('</body>')) {
      return html.replace('</body>', script + '\n</body>');
    } else {
      return html + script;
    }
  }

  // 发送错误响应
  sendError(res, status, message) {
    res.writeHead(status, { 'Content-Type': 'text/plain' });
    res.end(message);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const server = new DevServer();
  server.start();
}

module.exports = DevServer;