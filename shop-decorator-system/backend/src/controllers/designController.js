const Design = require('../models/Design')
const DesignVersion = require('../models/DesignVersion')
const { success, error } = require('../utils/response')
const { generateHTML } = require('../utils/htmlGenerator')

// 获取我的装修方案列表
exports.getMyDesigns = async (req, res) => {
  try {
    const designs = await Design.findByUserId(req.user.id)
    success(res, designs)
  } catch (err) {
    console.error('获取装修方案列表错误:', err)
    error(res, '获取装修方案列表失败', 500)
  }
}

// 获取装修方案详情
exports.getDesignById = async (req, res) => {
  try {
    const { id } = req.params
    const design = await Design.findById(id, req.user.id)

    if (!design) {
      return error(res, '装修方案不存在', 404)
    }

    success(res, design)
  } catch (err) {
    console.error('获取装修方案详情错误:', err)
    error(res, '获取装修方案详情失败', 500)
  }
}

// 保存装修方案
exports.createDesign = async (req, res) => {
  try {
    const { name, description, content, templateId } = req.body

    const designId = await Design.create({
      name,
      description,
      content,
      templateId,
      userId: req.user.id
    })

    success(res, { id: designId }, '保存成功')
  } catch (err) {
    console.error('保存装修方案错误:', err)
    error(res, '保存失败', 500)
  }
}

// 更新装修方案
exports.updateDesign = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, content, createVersion } = req.body

    const design = await Design.findById(id, req.user.id)
    if (!design) {
      return error(res, '装修方案不存在', 404)
    }

    // 如果需要创建版本，先保存当前版本到历史记录
    if (createVersion !== false) {
      try {
        await DesignVersion.createVersion({
          designId: parseInt(id),
          content: design.content,
          description: req.body.versionDescription || '自动保存',
          createdBy: req.user.id
        })
      } catch (versionErr) {
        console.error('创建版本失败（继续执行更新）:', versionErr)
      }
    }

    await Design.update(id, { name, description, content }, req.user.id)
    success(res, null, '更新成功')
  } catch (err) {
    console.error('更新装修方案错误:', err)
    error(res, '更新失败', 500)
  }
}

// 删除装修方案
exports.deleteDesign = async (req, res) => {
  try {
    const { id } = req.params

    const design = await Design.findById(id, req.user.id)
    if (!design) {
      return error(res, '装修方案不存在', 404)
    }

    await Design.delete(id, req.user.id)
    success(res, null, '删除成功')
  } catch (err) {
    console.error('删除装修方案错误:', err)
    error(res, '删除失败', 500)
  }
}

// 导出装修方案（JSON）
exports.exportDesign = async (req, res) => {
  try {
    const { id } = req.params
    const design = await Design.findById(id, req.user.id)

    if (!design) {
      return error(res, '装修方案不存在', 404)
    }

    // 设置响应头
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename=design_${id}.json`)

    res.send(JSON.stringify(design.content, null, 2))
  } catch (err) {
    console.error('导出装修方案错误:', err)
    error(res, '导出失败', 500)
  }
}

// 导出为 HTML
exports.exportHTML = async (req, res) => {
  try {
    const { id } = req.params
    const design = await Design.findById(id, req.user.id)

    if (!design) {
      return error(res, '装修方案不存在', 404)
    }

    // 生成 HTML
    const html = generateHTML(design.content)

    // 设置响应头
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename=${design.name || 'design'}.html`)

    res.send(html)
  } catch (err) {
    console.error('导出 HTML 错误:', err)
    error(res, '导出 HTML 失败', 500)
  }
}
