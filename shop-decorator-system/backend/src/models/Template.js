const db = require('../config/database')

class Template {
  // 创建模板
  static async create(templateData) {
    const { name, description, content, thumbnail, isPublic, userId } = templateData
    const [result] = await db.execute(
      'INSERT INTO templates (name, description, content, thumbnail, is_public, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, JSON.stringify(content || {}), thumbnail || null, isPublic ? 1 : 0, userId]
    )
    return result.insertId
  }

  // 获取模板列表
  static async findAll(filters = {}) {
    let query = `
      SELECT t.*, u.username as author
      FROM templates t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `
    const params = []

    if (filters.isPublic !== undefined) {
      query += ' AND t.is_public = ?'
      params.push(filters.isPublic ? 1 : 0)
    }

    if (filters.userId) {
      query += ' AND t.user_id = ?'
      params.push(filters.userId)
    }

    query += ' ORDER BY t.created_at DESC'

    const [rows] = await db.execute(query, params)
    return rows.map(row => ({
      ...row,
      content: row.content ? JSON.parse(row.content) : {},
      isPublic: !!row.is_public
    }))
  }

  // 根据 ID 查找
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT t.*, u.username as author FROM templates t LEFT JOIN users u ON t.user_id = u.id WHERE t.id = ?',
      [id]
    )
    if (rows[0]) {
      rows[0].content = rows[0].content ? JSON.parse(rows[0].content) : {}
      rows[0].isPublic = !!rows[0].is_public
    }
    return rows[0]
  }

  // 更新模板
  static async update(id, templateData) {
    const { name, description, content, thumbnail, isPublic } = templateData
    await db.execute(
      'UPDATE templates SET name = ?, description = ?, content = ?, thumbnail = ?, is_public = ? WHERE id = ?',
      [name, description, JSON.stringify(content || {}), thumbnail, isPublic ? 1 : 0, id]
    )
  }

  // 切换公开状态
  static async toggleVisibility(id, isPublic) {
    await db.execute(
      'UPDATE templates SET is_public = ? WHERE id = ?',
      [isPublic ? 1 : 0, id]
    )
  }

  // 删除模板
  static async delete(id) {
    await db.execute('DELETE FROM templates WHERE id = ?', [id])
  }
}

module.exports = Template
