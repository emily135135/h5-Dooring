const db = require('../config/database')

class Design {
  // 创建装修方案
  static async create(designData) {
    const { name, description, content, templateId, userId } = designData
    const [result] = await db.execute(
      'INSERT INTO designs (name, description, content, template_id, user_id) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', JSON.stringify(content || {}), templateId || null, userId]
    )
    return result.insertId
  }

  // 获取用户的装修方案列表
  static async findByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT d.*, t.name as templateName
       FROM designs d
       LEFT JOIN templates t ON d.template_id = t.id
       WHERE d.user_id = ?
       ORDER BY d.updated_at DESC`,
      [userId]
    )
    return rows.map(row => ({
      ...row,
      content: row.content ? JSON.parse(row.content) : {}
    }))
  }

  // 根据 ID 查找
  static async findById(id, userId = null) {
    let query = 'SELECT * FROM designs WHERE id = ?'
    const params = [id]

    if (userId) {
      query += ' AND user_id = ?'
      params.push(userId)
    }

    const [rows] = await db.execute(query, params)
    if (rows[0]) {
      rows[0].content = rows[0].content ? JSON.parse(rows[0].content) : {}
    }
    return rows[0]
  }

  // 更新装修方案
  static async update(id, designData, userId) {
    const { name, description, content } = designData
    await db.execute(
      'UPDATE designs SET name = ?, description = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [name, description || '', JSON.stringify(content || {}), id, userId]
    )
  }

  // 删除装修方案
  static async delete(id, userId) {
    await db.execute('DELETE FROM designs WHERE id = ? AND user_id = ?', [id, userId])
  }
}

module.exports = Design
