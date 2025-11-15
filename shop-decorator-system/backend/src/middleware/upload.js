const multer = require('multer')
const path = require('path')
const fs = require('fs')

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads')
const imagesDir = path.join(uploadDir, 'images')
const thumbnailsDir = path.join(uploadDir, 'thumbnails')

;[uploadDir, imagesDir, thumbnailsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 根据文件用途选择目录
    const type = req.query.type || 'images'
    const dir = type === 'thumbnail' ? thumbnailsDir : imagesDir
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${ext}`)
  }
})

// 文件过滤
const fileFilter = (req, file, cb) => {
  // 只允许图片文件
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('只支持图片文件 (jpeg, jpg, png, gif, webp)'))
  }
}

// 配置 multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  },
  fileFilter: fileFilter
})

// 单文件上传中间件
const uploadSingle = upload.single('file')

// 多文件上传中间件
const uploadMultiple = upload.array('files', 10)

// 错误处理中间件
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        code: 400,
        message: '文件大小不能超过 5MB'
      })
    }
    return res.status(400).json({
      code: 400,
      message: err.message
    })
  } else if (err) {
    return res.status(400).json({
      code: 400,
      message: err.message
    })
  }
  next()
}

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError
}
