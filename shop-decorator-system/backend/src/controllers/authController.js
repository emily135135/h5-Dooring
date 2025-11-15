const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { success, error } = require('../utils/response')

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // 检查用户是否存在
    const existingUser = await User.findByUsername(username)
    if (existingUser) {
      return error(res, '用户名已存在')
    }

    const existingEmail = await User.findByEmail(email)
    if (existingEmail) {
      return error(res, '邮箱已被注册')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const userId = await User.create({
      username,
      email,
      password: hashedPassword
    })

    success(res, { id: userId }, '注册成功')
  } catch (err) {
    console.error('注册错误:', err)
    error(res, '注册失败', 500)
  }
}

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    // 查找用户
    const user = await User.findByUsername(username)
    if (!user) {
      return error(res, '用户名或密码错误', 401)
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return error(res, '用户名或密码错误', 401)
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    success(res, {
      token,
      userInfo: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }, '登录成功')
  } catch (err) {
    console.error('登录错误:', err)
    error(res, '登录失败', 500)
  }
}

// 获取用户信息
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return error(res, '用户不存在', 404)
    }

    success(res, user)
  } catch (err) {
    console.error('获取用户信息错误:', err)
    error(res, '获取用户信息失败', 500)
  }
}
