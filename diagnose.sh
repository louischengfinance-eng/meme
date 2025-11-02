#!/bin/bash

echo "🔍 Crypto Monitoring Dashboard - 诊断工具"
echo "=========================================="
echo ""

# Check if backend is running
echo "1️⃣ 检查后端服务器..."
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ 后端服务器正在运行"
    echo ""
    echo "后端状态："
    curl -s http://localhost:3001/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3001/api/health
    echo ""
else
    echo "❌ 后端服务器未运行或无法访问"
    echo ""
    echo "🔧 解决方案："
    echo "   终端 1: cd backend && npm run dev"
    echo ""
fi

# Check if frontend is running
echo "2️⃣ 检查前端服务器..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 前端服务器正在运行"
else
    echo "❌ 前端服务器未运行或无法访问"
    echo ""
    echo "🔧 解决方案："
    echo "   终端 2: cd frontend && npm run dev"
fi
echo ""

# Check backend .env file
echo "3️⃣ 检查后端配置文件..."
if [ -f "backend/.env" ]; then
    echo "✅ backend/.env 文件存在"
    if grep -q "BYBIT_API_KEY" backend/.env && grep -q "BYBIT_API_SECRET" backend/.env; then
        echo "✅ API 凭证已配置"
    else
        echo "❌ API 凭证未配置"
        echo ""
        echo "🔧 解决方案："
        echo "   运行: npm run deploy"
    fi
else
    echo "❌ backend/.env 文件不存在"
    echo ""
    echo "🔧 解决方案："
    echo "   运行: npm run deploy"
fi
echo ""

# Check frontend .env.local file
echo "4️⃣ 检查前端配置文件..."
if [ -f "frontend/.env.local" ]; then
    echo "✅ frontend/.env.local 文件存在"
    cat frontend/.env.local
else
    echo "❌ frontend/.env.local 文件不存在"
    echo ""
    echo "🔧 解决方案："
    echo "   运行: npm run deploy"
fi
echo ""

# Check if dependencies are installed
echo "5️⃣ 检查依赖安装..."
if [ -d "backend/node_modules" ]; then
    echo "✅ 后端依赖已安装"
else
    echo "❌ 后端依赖未安装"
    echo ""
    echo "🔧 解决方案："
    echo "   cd backend && npm install"
fi

if [ -d "frontend/node_modules" ]; then
    echo "✅ 前端依赖已安装"
else
    echo "❌ 前端依赖未安装"
    echo ""
    echo "🔧 解决方案："
    echo "   cd frontend && npm install"
fi
echo ""

# Test API endpoint
echo "6️⃣ 测试 API 端点..."
if curl -s http://localhost:3001/api/tickers > /dev/null 2>&1; then
    echo "✅ /api/tickers 端点正常响应"
else
    echo "❌ /api/tickers 端点无响应"
fi
echo ""

# Check for processes
echo "7️⃣ 检查运行的进程..."
echo "后端进程 (端口 3001):"
lsof -i :3001 2>/dev/null || echo "   没有进程在运行"
echo ""
echo "前端进程 (端口 3000):"
lsof -i :3000 2>/dev/null || echo "   没有进程在运行"
echo ""

echo "=========================================="
echo "📋 快速修复步骤："
echo "1. 运行: npm run deploy"
echo "2. 终端 1: cd backend && npm run dev"
echo "3. 终端 2: cd frontend && npm run dev"
echo "4. 访问: http://localhost:3000"
echo "=========================================="
