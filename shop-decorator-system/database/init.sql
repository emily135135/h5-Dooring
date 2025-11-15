-- 创建数据库
CREATE DATABASE IF NOT EXISTS shop_decorator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE shop_decorator;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
  password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  role ENUM('user', 'admin') DEFAULT 'user' COMMENT '角色：user-普通用户，admin-管理员',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 模板表
CREATE TABLE IF NOT EXISTS templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '模板名称',
  description TEXT COMMENT '模板描述',
  content LONGTEXT COMMENT '模板内容（JSON格式）',
  thumbnail VARCHAR(255) COMMENT '缩略图',
  is_public TINYINT(1) DEFAULT 0 COMMENT '是否公开：0-私有，1-公开',
  user_id INT NOT NULL COMMENT '创建者ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模板表';

-- 装修方案表
CREATE TABLE IF NOT EXISTS designs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '方案名称',
  description TEXT COMMENT '方案描述',
  content LONGTEXT COMMENT '方案内容（JSON格式）',
  template_id INT COMMENT '基于的模板ID',
  user_id INT NOT NULL COMMENT '创建者ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_template_id (template_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='装修方案表';

-- 插入默认管理员账号（密码：admin123，已使用 bcrypt 加密）
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', '$2a$10$YQXz0.xGKf4V9PxVmLn.1.ZV3zKVV6X9L/MPJQ5yKV7Vp8qZx.hOS', 'admin');

-- 插入示例公共模板
INSERT INTO templates (name, description, content, is_public, user_id) VALUES
('简约电商模板', '简约风格的电商店铺模板，适合各类商品展示', '{}', 1, 1),
('时尚服装模板', '专为时尚服装设计的店铺模板', '{}', 1, 1),
('数码产品模板', '适合数码产品展示的现代化模板', '{}', 1, 1);
