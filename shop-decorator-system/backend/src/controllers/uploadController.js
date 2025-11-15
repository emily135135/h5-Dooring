const path = require('path')
const fs = require('fs')
const { success, error } = require('../utils/response')

// 上传单个文件
exports.uploadSingle = (req, res) => {
  try {
    if (!req.file) {
      return error(res, '请选择文件', 400)
    }

    const type = req.query.type || 'images'
    const fileUrl = `/uploads/${type}/${req.file.filename}`

    success(res, {
      filename: req.file.filename,
      originalname: req.file.originalname,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    }, '上传成功')
  } catch (err) {
    console.error('上传文件错误:', err)
    error(res, '上传失败', 500)
  }
}

// 上传多个文件
exports.uploadMultiple = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return error(res, '请选择文件', 400)
    }

    const type = req.query.type || 'images'
    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      url: `/uploads/${type}/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }))

    success(res, files, '上传成功')
  } catch (err) {
    console.error('上传文件错误:', err)
    error(res, '上传失败', 500)
  }
}

// 删除文件
exports.deleteFile = (req, res) => {
  try {
    const { filename, type = 'images' } = req.body

    if (!filename) {
      return error(res, '缺少文件名', 400)
    }

    const uploadsDir = path.join(__dirname, '../../uploads')
    const filePath = path.join(uploadsDir, type, filename)

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return error(res, '文件不存在', 404)
    }

    // 删除文件
    fs.unlinkSync(filePath)

    success(res, null, '删除成功')
  } catch (err) {
    console.error('删除文件错误:', err)
    error(res, '删除失败', 500)
  }
}

// 获取图片列表
exports.getImages = async (req, res) => {
  try {
    const { type = 'images' } = req.query
    const uploadsDir = path.join(__dirname, '../../uploads')
    const dirPath = path.join(uploadsDir, type)

    // 确保目录存在
    if (!fs.existsSync(dirPath)) {
      return success(res, [])
    }

    // 读取目录
    const files = fs.readdirSync(dirPath)

    // 获取文件信息
    const images = files
      .filter(file => {
        // 过滤图片文件
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
      })
      .map(file => {
        const filePath = path.join(dirPath, file)
        const stats = fs.statSync(filePath)
        return {
          filename: file,
          url: `/uploads/${type}/${file}`,
          size: stats.size,
          createdAt: stats.birthtime
        }
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    success(res, images)
  } catch (err) {
    console.error('获取图片列表错误:', err)
    error(res, '获取图片列表失败', 500)
  }
}
