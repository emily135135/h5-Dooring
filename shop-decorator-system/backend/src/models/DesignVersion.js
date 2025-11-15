const db = require('../config/database')

class DesignVersion {
  // 创建新版本
  static async createVersion(versionData) {
    const { designId, content, description, createdBy } = versionData

    // 获取当前最新版本号
    const latestVersion = await this.getLatestVersionNumber(designId)
    const newVersionNumber = latestVersion + 1

    const [result] = await db.execute(
      'INSERT INTO design_versions (design_id, version_number, content, description, created_by) VALUES (?, ?, ?, ?, ?)',
      [designId, newVersionNumber, JSON.stringify(content || {}), description || null, createdBy]
    )

    return {
      id: result.insertId,
      versionNumber: newVersionNumber
    }
  }

  // 获取最新版本号
  static async getLatestVersionNumber(designId) {
    const [rows] = await db.execute(
      'SELECT MAX(version_number) as latestVersion FROM design_versions WHERE design_id = ?',
      [designId]
    )
    return rows[0].latestVersion || 0
  }

  // 获取指定设计的所有版本列表
  static async getVersionsByDesignId(designId, userId) {
    // 验证用户权限
    const [designRows] = await db.execute(
      'SELECT user_id FROM designs WHERE id = ?',
      [designId]
    )

    if (!designRows[0] || designRows[0].user_id !== userId) {
      return null
    }

    const [rows] = await db.execute(
      `SELECT dv.id, dv.design_id, dv.version_number, dv.description, dv.created_at,
              u.username as created_by_name
       FROM design_versions dv
       LEFT JOIN users u ON dv.created_by = u.id
       WHERE dv.design_id = ?
       ORDER BY dv.version_number DESC`,
      [designId]
    )

    return rows
  }

  // 获取指定版本的详细内容
  static async getVersionById(versionId, userId) {
    const [rows] = await db.execute(
      `SELECT dv.*, u.username as created_by_name, d.user_id
       FROM design_versions dv
       LEFT JOIN users u ON dv.created_by = u.id
       LEFT JOIN designs d ON dv.design_id = d.id
       WHERE dv.id = ?`,
      [versionId]
    )

    if (!rows[0] || rows[0].user_id !== userId) {
      return null
    }

    const version = rows[0]
    version.content = version.content ? JSON.parse(version.content) : {}
    delete version.user_id // 移除临时字段

    return version
  }

  // 恢复到指定版本
  static async restoreVersion(versionId, userId) {
    // 获取版本内容
    const version = await this.getVersionById(versionId, userId)
    if (!version) {
      return null
    }

    // 更新设计内容
    await db.execute(
      'UPDATE designs SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [JSON.stringify(version.content), version.design_id, userId]
    )

    return version
  }

  // 删除版本（可选功能）
  static async deleteVersion(versionId, userId) {
    // 验证权限
    const [rows] = await db.execute(
      `SELECT dv.design_id, d.user_id
       FROM design_versions dv
       LEFT JOIN designs d ON dv.design_id = d.id
       WHERE dv.id = ?`,
      [versionId]
    )

    if (!rows[0] || rows[0].user_id !== userId) {
      return false
    }

    await db.execute('DELETE FROM design_versions WHERE id = ?', [versionId])
    return true
  }
}

module.exports = DesignVersion
