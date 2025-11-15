const express = require('express')
const router = express.Router()
const designController = require('../controllers/designController')
const { authMiddleware } = require('../middleware/auth')

// 所有装修方案路由都需要认证

// 获取我的装修方案列表
router.get('/', authMiddleware, designController.getMyDesigns)

// 获取装修方案详情
router.get('/:id', authMiddleware, designController.getDesignById)

// 创建装修方案
router.post('/', authMiddleware, designController.createDesign)

// 更新装修方案
router.put('/:id', authMiddleware, designController.updateDesign)

// 删除装修方案
router.delete('/:id', authMiddleware, designController.deleteDesign)

// 导出装修方案（JSON）
router.get('/:id/export', authMiddleware, designController.exportDesign)

// 导出为 HTML
router.get('/:id/export-html', authMiddleware, designController.exportHTML)

module.exports = router
