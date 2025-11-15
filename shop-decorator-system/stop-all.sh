#!/bin/bash

# 电商店铺装修系统 - 停止所有服务脚本

echo "======================================"
echo "   停止所有服务..."
echo "======================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"

# 停止前端
if [ -f "$LOG_DIR/frontend.pid" ]; then
    PID=$(cat "$LOG_DIR/frontend.pid")
    if kill -0 $PID 2>/dev/null; then
        echo "🛑 停止前端服务 (PID: $PID)..."
        kill $PID
        rm "$LOG_DIR/frontend.pid"
    fi
fi

# 停止后端
if [ -f "$LOG_DIR/backend.pid" ]; then
    PID=$(cat "$LOG_DIR/backend.pid")
    if kill -0 $PID 2>/dev/null; then
        echo "🛑 停止后端服务 (PID: $PID)..."
        kill $PID
        rm "$LOG_DIR/backend.pid"
    fi
fi

# 停止 h5-dooring
if [ -f "$LOG_DIR/h5-dooring.pid" ]; then
    PID=$(cat "$LOG_DIR/h5-dooring.pid")
    if kill -0 $PID 2>/dev/null; then
        echo "🛑 停止 H5-Dooring 编辑器 (PID: $PID)..."
        kill $PID
        rm "$LOG_DIR/h5-dooring.pid"
    fi
fi

# 额外清理：查找并杀死相关进程
echo "🔍 清理残留进程..."
pkill -f "umi dev"
pkill -f "vite"
pkill -f "nodemon"

echo ""
echo "✅ 所有服务已停止"
echo ""
