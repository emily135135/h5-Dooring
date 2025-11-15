const db = require('../config/database')

class User {
  // 创建用户
  static async create(userData) {
    const { username, email, password, role = 'user' } = userData
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    )
    return result.insertId
  }

  // 根据用户名查找
  static async findByUsername(username) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )
    return rows[0]
  }

  // 根据邮箱查找
  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return rows[0]
  }

  // 根据 ID 查找
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [id]
    )
    return rows[0]
  }

  // 更新用户
  static async update(id, userData) {
    const { username, email } = userData
    await db.execute(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email, id]
    )
  }
}

module.exports = User
