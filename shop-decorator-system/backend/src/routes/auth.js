const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const authController = require('../controllers/authController')
const { authMiddleware } = require('../middleware/auth')

// 注册
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('用户名长度在 3 到 20 个字符'),
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').isLength({ min: 6 }).withMessage('密码长度不能少于 6 个字符')
], authController.register)

// 登录
router.post('/login', [
  body('username').notEmpty().withMessage('请输入用户名'),
  body('password').notEmpty().withMessage('请输入密码')
], authController.login)

// 获取用户信息（需要认证）
router.get('/userinfo', authMiddleware, authController.getUserInfo)

module.exports = router
