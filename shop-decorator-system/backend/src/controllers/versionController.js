const DesignVersion = require('../models/DesignVersion')
const { success, error } = require('../utils/response')

// 获取设计的版本历史列表
exports.getVersions = async (req, res) => {
  try {
    const { designId } = req.params
    const versions = await DesignVersion.getVersionsByDesignId(parseInt(designId), req.user.id)

    if (versions === null) {
      return error(res, '无权访问该设计方案', 403)
    }

    success(res, versions)
  } catch (err) {
    console.error('获取版本历史失败:', err)
    error(res, '获取版本历史失败')
  }
}

// 获取指定版本的详细内容
exports.getVersionDetail = async (req, res) => {
  try {
    const { versionId } = req.params
    const version = await DesignVersion.getVersionById(parseInt(versionId), req.user.id)

    if (!version) {
      return error(res, '版本不存在或无权访问', 404)
    }

    success(res, version)
  } catch (err) {
    console.error('获取版本详情失败:', err)
    error(res, '获取版本详情失败')
  }
}

// 创建新版本（手动创建）
exports.createVersion = async (req, res) => {
  try {
    const { designId } = req.params
    const { content, description } = req.body

    // 验证权限
    const versions = await DesignVersion.getVersionsByDesignId(parseInt(designId), req.user.id)
    if (versions === null) {
      return error(res, '无权访问该设计方案', 403)
    }

    const result = await DesignVersion.createVersion({
      designId: parseInt(designId),
      content,
      description,
      createdBy: req.user.id
    })

    success(res, result, '版本创建成功')
  } catch (err) {
    console.error('创建版本失败:', err)
    error(res, '创建版本失败')
  }
}

// 恢复到指定版本
exports.restoreVersion = async (req, res) => {
  try {
    const { versionId } = req.params
    const version = await DesignVersion.restoreVersion(parseInt(versionId), req.user.id)

    if (!version) {
      return error(res, '版本不存在或无权访问', 404)
    }

    success(res, {
      designId: version.design_id,
      versionNumber: version.version_number
    }, '恢复成功')
  } catch (err) {
    console.error('恢复版本失败:', err)
    error(res, '恢复版本失败')
  }
}

// 删除版本
exports.deleteVersion = async (req, res) => {
  try {
    const { versionId } = req.params
    const result = await DesignVersion.deleteVersion(parseInt(versionId), req.user.id)

    if (!result) {
      return error(res, '版本不存在或无权访问', 404)
    }

    success(res, null, '版本删除成功')
  } catch (err) {
    console.error('删除版本失败:', err)
    error(res, '删除版本失败')
  }
}
