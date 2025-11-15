const jwt = require('jsonwebtoken')

// 验证 JWT Token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未提供认证令牌'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: '令牌无效或已过期'
    })
  }
}

// 验证管理员权限
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      code: 403,
      message: '需要管理员权限'
    })
  }
  next()
}

module.exports = {
  authMiddleware,
  adminMiddleware
}
