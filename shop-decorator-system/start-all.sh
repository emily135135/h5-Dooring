#!/bin/bash

# 电商店铺装修系统 - 一键启动脚本
# 此脚本会启动 h5-Dooring 编辑器、后端服务和前端应用

echo "======================================"
echo "   电商店铺装修系统 - 一键启动"
echo "======================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请访问 https://nodejs.org 安装 Node.js"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未安装 npm"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 获取脚本所在目录的父目录（h5-Dooring 根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
H5_DOORING_DIR="$(dirname "$SCRIPT_DIR")"

# 启动 h5-Dooring 编辑器
echo "📝 启动 H5-Dooring 编辑器..."
cd "$H5_DOORING_DIR"

if [ ! -d "node_modules" ]; then
    echo "首次运行，正在安装 H5-Dooring 依赖..."
    npm install
fi

# 在后台启动 h5-Dooring
export NODE_OPTIONS=--openssl-legacy-provider
nohup npm run start > "$SCRIPT_DIR/logs/h5-dooring.log" 2>&1 &
H5_DOORING_PID=$!
echo "✅ H5-Dooring 编辑器已启动 (PID: $H5_DOORING_PID)"
echo "   访问地址: http://localhost:8000/editor"
echo ""

# 启动后端服务
echo "🚀 启动后端服务..."
cd "$SCRIPT_DIR/backend"

if [ ! -d "node_modules" ]; then
    echo "首次运行，正在安装后端依赖..."
    npm install
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件，复制示例配置..."
    cp .env.example .env
    echo "⚠️  请编辑 backend/.env 文件配置数据库连接"
fi

# 在后台启动后端
mkdir -p "$SCRIPT_DIR/logs"
nohup npm run dev > "$SCRIPT_DIR/logs/backend.log" 2>&1 &
BACKEND_PID=$!
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
echo "   访问地址: http://localhost:5000"
echo ""

# 启动前端应用
echo "💻 启动前端应用..."
cd "$SCRIPT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo "首次运行，正在安装前端依赖..."
    npm install
fi

# 在后台启动前端
nohup npm run dev > "$SCRIPT_DIR/logs/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "✅ 前端应用已启动 (PID: $FRONTEND_PID)"
echo "   访问地址: http://localhost:3000"
echo ""

# 保存 PID 到文件
echo "$H5_DOORING_PID" > "$SCRIPT_DIR/logs/h5-dooring.pid"
echo "$BACKEND_PID" > "$SCRIPT_DIR/logs/backend.pid"
echo "$FRONTEND_PID" > "$SCRIPT_DIR/logs/frontend.pid"

echo "======================================"
echo "   所有服务已启动！"
echo "======================================"
echo ""
echo "服务地址:"
echo "  - H5-Dooring 编辑器: http://localhost:8000/editor"
echo "  - 后端 API: http://localhost:5000"
echo "  - 前端应用: http://localhost:3000"
echo ""
echo "日志文件位置: $SCRIPT_DIR/logs/"
echo ""
echo "停止所有服务，请运行:"
echo "  ./stop-all.sh"
echo ""
echo "查看日志:"
echo "  tail -f $SCRIPT_DIR/logs/frontend.log"
echo "  tail -f $SCRIPT_DIR/logs/backend.log"
echo "  tail -f $SCRIPT_DIR/logs/h5-dooring.log"
echo ""
