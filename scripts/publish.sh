#!/bin/bash

# 博客发布脚本
echo "🚀 开始发布博客..."

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
    
    # 推送到 GitHub
    echo "📤 推送到 GitHub..."
    git push
    
    echo "✅ 博客发布成功！"
    echo "🌐 网站将在 2-3 分钟后更新：https://zhanbing.site"
else
    echo "ℹ️  没有发现新的更改"
fi 