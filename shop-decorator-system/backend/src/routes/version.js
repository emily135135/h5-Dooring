const express = require('express')
const router = express.Router()
const versionController = require('../controllers/versionController')
const auth = require('../middleware/auth')

// 所有版本相关的路由都需要认证
router.use(auth)

// 获取指定设计的版本历史列表
router.get('/designs/:designId/versions', versionController.getVersions)

// 创建新版本（手动）
router.post('/designs/:designId/versions', versionController.createVersion)

// 获取指定版本的详细内容
router.get('/versions/:versionId', versionController.getVersionDetail)

// 恢复到指定版本
router.post('/versions/:versionId/restore', versionController.restoreVersion)

// 删除版本
router.delete('/versions/:versionId', versionController.deleteVersion)

module.exports = router
