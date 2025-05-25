#!/bin/bash

# 新文章创建脚本
echo "📝 创建新的博客文章..."

# 询问文章标题
read -p "📋 请输入文章标题: " title

if [[ -z "$title" ]]; then
    echo "❌ 文章标题不能为空"
    exit 1
fi

# 生成文件名（将标题转换为 URL 友好的格式）
filename=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9\u4e00-\u9fa5]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
filepath="posts/${filename}.md"

# 检查文件是否已存在
if [[ -f "$filepath" ]]; then
    echo "❌ 文件 $filepath 已存在"
    exit 1
fi

# 获取当前日期
current_date=$(date +"%Y-%m-%d")

# 询问文章摘要
read -p "📄 请输入文章摘要: " excerpt

# 询问标签
read -p "🏷️  请输入标签 (用逗号分隔): " tags_input

# 处理标签
if [[ -n "$tags_input" ]]; then
    # 将逗号分隔的标签转换为 YAML 数组格式
    tags_array=""
    IFS=',' read -ra TAGS <<< "$tags_input"
    for tag in "${TAGS[@]}"; do
        # 去除前后空格
        tag=$(echo "$tag" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        tags_array="${tags_array}'${tag}', "
    done
    # 去除最后的逗号和空格
    tags_array=$(echo "$tags_array" | sed 's/, $//')
    tags_yaml="[$tags_array]"
else
    tags_yaml="[]"
fi

# 创建文章文件
cat > "$filepath" << EOF
---
title: '$title'
date: '$current_date'
excerpt: '$excerpt'
tags: $tags_yaml
---

# $title

在这里开始写你的文章内容...

## 小标题

文章内容...

### 更小的标题

更多内容...

## 总结

总结内容...
EOF

echo "✅ 新文章已创建：$filepath"
echo "📝 现在你可以编辑这个文件来写作"
echo "🚀 完成后运行 ./scripts/publish.sh 来发布"

# 询问是否立即打开文件
read -p "📖 是否立即打开文件进行编辑？(y/n): " open_file

if [[ "$open_file" == "y" || "$open_file" == "Y" ]]; then
    # 尝试用不同的编辑器打开
    if command -v code &> /dev/null; then
        code "$filepath"
    elif command -v vim &> /dev/null; then
        vim "$filepath"
    elif command -v nano &> /dev/null; then
        nano "$filepath"
    else
        echo "📝 请手动打开文件：$filepath"
    fi
fi 