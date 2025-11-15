# 数据库配置说明

## 初始化数据库

1. 确保已安装 MySQL 数据库

2. 登录 MySQL：
```bash
mysql -u root -p
```

3. 执行初始化脚本：
```bash
source init.sql
```

或者在命令行直接导入：
```bash
mysql -u root -p < init.sql
```

## 数据库表结构

### users - 用户表
- id: 用户ID（主键）
- username: 用户名（唯一）
- email: 邮箱（唯一）
- password: 加密后的密码
- role: 用户角色（user/admin）
- created_at: 创建时间
- updated_at: 更新时间

### templates - 模板表
- id: 模板ID（主键）
- name: 模板名称
- description: 模板描述
- content: 模板内容（JSON格式）
- thumbnail: 缩略图URL
- is_public: 是否公开（0-私有，1-公开）
- user_id: 创建者ID（外键）
- created_at: 创建时间
- updated_at: 更新时间

### designs - 装修方案表
- id: 方案ID（主键）
- name: 方案名称
- description: 方案描述
- content: 方案内容（JSON格式）
- template_id: 基于的模板ID（外键，可为空）
- user_id: 创建者ID（外键）
- created_at: 创建时间
- updated_at: 更新时间

## 默认账号

### 管理员账号
- 用户名: admin
- 密码: admin123
- 角色: admin

## 注意事项

1. 修改密码后需要使用 bcrypt 加密
2. 公共模板（is_public=1）对所有用户可见
3. 私有模板（is_public=0）仅创建者可见
4. 删除用户会级联删除其创建的模板和装修方案
5. 删除模板会将关联的装修方案的 template_id 设置为 NULL
