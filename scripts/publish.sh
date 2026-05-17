#!/bin/bash

set -euo pipefail

# 博客发布脚本
echo "🚀 开始发布博客..."

# 检查当前分支
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" != "main" ]]; then
  echo "⚠️  当前分支为 '$current_branch'，推荐在 'main' 分支发布"
  read -p "是否继续在当前分支发布？(y/N): " cont
  if [[ ! "$cont" =~ ^[Yy]$ ]]; then
    echo "❌ 已取消发布"
    exit 1
  fi
fi

# 检查是否有未提交的更改
if [[ -n $(git status -s) ]]; then
    echo "📝 发现新的更改，准备提交..."
    
    # 显示更改的文件
    echo "📋 更改的文件："
    git status -s
    
    # 询问提交信息
    echo ""
    read -p "💬 请输入提交信息 (默认: Update blog content): " commit_message
    
    # 如果没有输入提交信息，使用默认值
    if [[ -z "$commit_message" ]]; then
        commit_message="Update blog content"
    fi
    
    # 添加所有更改
    git add .
    
    # 提交更改
    git commit -m "$commit_message"
    
    # 推送前预检
    echo "🧪 运行代码检查与构建..."
    if npm run lint; then
      echo "✅ Lint 通过"
    else
      echo "❌ Lint 失败，请修复后再试"
      exit 1
    fi

    if npm run build; then
      echo "✅ 构建通过"
    else
      echo "❌ 构建失败，请根据错误信息修复"
      exit 1
    fi

    # 推送到 GitHub
    echo "📤 推送到 GitHub..."
    git push --set-upstream origin "$current_branch"
    
    echo "✅ 博客发布成功！"
    echo "🌐 网站将在 2-3 分钟后更新：https://zhanbing-blog.pages.dev"
else
    echo "ℹ️  没有发现新的更改"
fi 
