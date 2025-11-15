const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/uploadController')
const { authMiddleware } = require('../middleware/auth')
const { uploadSingle, uploadMultiple, handleUploadError } = require('../middleware/upload')

// 所有上传路由都需要认证

// 上传单个文件
router.post('/single', authMiddleware, (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next)
    }
    uploadController.uploadSingle(req, res)
  })
})

// 上传多个文件
router.post('/multiple', authMiddleware, (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next)
    }
    uploadController.uploadMultiple(req, res)
  })
})

// 删除文件
router.delete('/file', authMiddleware, uploadController.deleteFile)

// 获取图片列表
router.get('/images', authMiddleware, uploadController.getImages)

module.exports = router
