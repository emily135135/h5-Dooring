-- 添加设计方案版本历史表
USE shop_decorator;

-- 版本历史表
CREATE TABLE IF NOT EXISTS design_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  design_id INT NOT NULL COMMENT '关联的设计方案ID',
  version_number INT NOT NULL COMMENT '版本号',
  content LONGTEXT NOT NULL COMMENT '版本内容（JSON格式）',
  description VARCHAR(255) DEFAULT NULL COMMENT '版本描述',
  created_by INT NOT NULL COMMENT '创建者ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (design_id) REFERENCES designs(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_design_id (design_id),
  INDEX idx_created_at (created_at),
  UNIQUE KEY unique_design_version (design_id, version_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设计方案版本历史表';
