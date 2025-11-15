const express = require('express')
const router = express.Router()
const templateController = require('../controllers/templateController')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

// 获取模板列表（需要认证）
router.get('/', authMiddleware, templateController.getTemplates)

// 获取模板详情（需要认证）
router.get('/:id', authMiddleware, templateController.getTemplateById)

// 创建模板（需要管理员权限）
router.post('/', authMiddleware, adminMiddleware, templateController.createTemplate)

// 更新模板（需要管理员权限）
router.put('/:id', authMiddleware, adminMiddleware, templateController.updateTemplate)

// 切换模板可见性（需要管理员权限）
router.patch('/:id/visibility', authMiddleware, adminMiddleware, templateController.toggleVisibility)

// 删除模板（需要管理员权限）
router.delete('/:id', authMiddleware, adminMiddleware, templateController.deleteTemplate)

module.exports = router
