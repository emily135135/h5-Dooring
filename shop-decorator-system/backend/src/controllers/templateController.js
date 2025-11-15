const Template = require('../models/Template')
const { success, error } = require('../utils/response')

// 获取模板列表
exports.getTemplates = async (req, res) => {
  try {
    const { isPublic } = req.query
    const filters = {}

    if (isPublic !== undefined) {
      filters.isPublic = isPublic === 'true'
    }

    // 如果是查询私有模板，只返回当前用户的
    if (isPublic === 'false') {
      filters.userId = req.user.id
    }

    const templates = await Template.findAll(filters)
    success(res, templates)
  } catch (err) {
    console.error('获取模板列表错误:', err)
    error(res, '获取模板列表失败', 500)
  }
}

// 获取模板详情
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params
    const template = await Template.findById(id)

    if (!template) {
      return error(res, '模板不存在', 404)
    }

    // 检查权限：公共模板或自己的私有模板
    if (!template.is_public && template.user_id !== req.user.id) {
      return error(res, '无权访问此模板', 403)
    }

    success(res, template)
  } catch (err) {
    console.error('获取模板详情错误:', err)
    error(res, '获取模板详情失败', 500)
  }
}

// 创建模板（管理员）
exports.createTemplate = async (req, res) => {
  try {
    const { name, description, content, thumbnail, isPublic } = req.body

    const templateId = await Template.create({
      name,
      description,
      content,
      thumbnail,
      isPublic,
      userId: req.user.id
    })

    success(res, { id: templateId }, '创建模板成功')
  } catch (err) {
    console.error('创建模板错误:', err)
    error(res, '创建模板失败', 500)
  }
}

// 更新模板（管理员）
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, content, thumbnail, isPublic } = req.body

    const template = await Template.findById(id)
    if (!template) {
      return error(res, '模板不存在', 404)
    }

    if (template.user_id !== req.user.id) {
      return error(res, '无权修改此模板', 403)
    }

    await Template.update(id, { name, description, content, thumbnail, isPublic })
    success(res, null, '更新模板成功')
  } catch (err) {
    console.error('更新模板错误:', err)
    error(res, '更新模板失败', 500)
  }
}

// 切换模板可见性（管理员）
exports.toggleVisibility = async (req, res) => {
  try {
    const { id } = req.params
    const { isPublic } = req.body

    const template = await Template.findById(id)
    if (!template) {
      return error(res, '模板不存在', 404)
    }

    if (template.user_id !== req.user.id) {
      return error(res, '无权修改此模板', 403)
    }

    await Template.toggleVisibility(id, isPublic)
    success(res, null, '更新成功')
  } catch (err) {
    console.error('切换模板可见性错误:', err)
    error(res, '操作失败', 500)
  }
}

// 删除模板（管理员）
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params

    const template = await Template.findById(id)
    if (!template) {
      return error(res, '模板不存在', 404)
    }

    if (template.user_id !== req.user.id) {
      return error(res, '无权删除此模板', 403)
    }

    await Template.delete(id)
    success(res, null, '删除模板成功')
  } catch (err) {
    console.error('删除模板错误:', err)
    error(res, '删除模板失败', 500)
  }
}
