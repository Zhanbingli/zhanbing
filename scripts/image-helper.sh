#!/bin/bash

# 博客图片管理助手脚本
# 使用方法: ./scripts/image-helper.sh [command] [options]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
IMAGES_DIR="public/images"
POSTS_IMAGES_DIR="${IMAGES_DIR}/posts"

# 帮助信息
show_help() {
    echo -e "${BLUE}博客图片管理助手${NC}"
    echo ""
    echo "使用方法: $0 [command] [options]"
    echo ""
    echo "命令:"
    echo "  create-dir <article-name>    为文章创建图片目录"
    echo "  list-dirs                    列出所有文章图片目录"
    echo "  optimize <file>              优化单个图片文件"
    echo "  optimize-all                 优化所有图片文件"
    echo "  check-missing                检查文章中引用的缺失图片"
    echo "  stats                        显示图片统计信息"
    echo "  help                         显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 create-dir my-new-article"
    echo "  $0 optimize public/images/posts/article/image.jpg"
    echo "  $0 check-missing"
}

# 创建文章图片目录
create_article_dir() {
    local article_name="$1"
    if [ -z "$article_name" ]; then
        echo -e "${RED}错误: 请提供文章名称${NC}"
        exit 1
    fi
    
    local dir_path="${POSTS_IMAGES_DIR}/${article_name}"
    
    if [ -d "$dir_path" ]; then
        echo -e "${YELLOW}目录已存在: ${dir_path}${NC}"
    else
        mkdir -p "$dir_path"
        echo -e "${GREEN}已创建目录: ${dir_path}${NC}"
        
        # 创建说明文件
        cat > "${dir_path}/README.md" << EOF
# ${article_name} 图片资源

## 图片列表

- \`cover.jpg\` - 文章封面图 (1200x630)
- \`demo-*.png\` - 演示截图
- \`diagram-*.svg\` - 流程图/架构图

## 使用方法

在 Markdown 文章中引用:

\`\`\`markdown
![图片描述](/images/posts/${article_name}/图片文件名)
\`\`\`

## 优化建议

- 压缩图片以减小文件大小
- 使用描述性的文件名
- 为图片添加 alt 属性
EOF
        echo -e "${GREEN}已创建说明文件: ${dir_path}/README.md${NC}"
    fi
}

# 列出所有文章图片目录
list_dirs() {
    echo -e "${BLUE}文章图片目录列表:${NC}"
    if [ -d "$POSTS_IMAGES_DIR" ]; then
        find "$POSTS_IMAGES_DIR" -type d -mindepth 1 -maxdepth 1 | sort | while read -r dir; do
            local article_name=$(basename "$dir")
            local image_count=$(find "$dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.svg" \) | wc -l)
            echo -e "  ${GREEN}${article_name}${NC} (${image_count} 张图片)"
        done
    else
        echo -e "${YELLOW}未找到图片目录${NC}"
    fi
}

# 优化单个图片
optimize_image() {
    local file_path="$1"
    if [ -z "$file_path" ]; then
        echo -e "${RED}错误: 请提供图片文件路径${NC}"
        exit 1
    fi
    
    if [ ! -f "$file_path" ]; then
        echo -e "${RED}错误: 文件不存在: ${file_path}${NC}"
        exit 1
    fi
    
    local file_size_before=$(stat -f%z "$file_path" 2>/dev/null || stat -c%s "$file_path" 2>/dev/null)
    
    # 使用 ImageMagick 进行基本优化（如果可用）
    if command -v convert >/dev/null 2>&1; then
        local backup_file="${file_path}.backup"
        cp "$file_path" "$backup_file"
        
        case "${file_path,,}" in
            *.jpg|*.jpeg)
                convert "$backup_file" -quality 85 -strip "$file_path"
                ;;
            *.png)
                convert "$backup_file" -quality 90 -strip "$file_path"
                ;;
        esac
        
        local file_size_after=$(stat -f%z "$file_path" 2>/dev/null || stat -c%s "$file_path" 2>/dev/null)
        local savings=$((file_size_before - file_size_after))
        local percentage=$((savings * 100 / file_size_before))
        
        if [ $savings -gt 0 ]; then
            echo -e "${GREEN}优化完成: ${file_path}${NC}"
            echo -e "  原始大小: ${file_size_before} 字节"
            echo -e "  优化后: ${file_size_after} 字节"
            echo -e "  节省: ${savings} 字节 (${percentage}%)"
            rm "$backup_file"
        else
            echo -e "${YELLOW}文件已经足够优化: ${file_path}${NC}"
            mv "$backup_file" "$file_path"
        fi
    else
        echo -e "${YELLOW}ImageMagick 未安装，跳过优化。建议安装: brew install imagemagick${NC}"
    fi
}

# 优化所有图片
optimize_all() {
    echo -e "${BLUE}优化所有图片文件...${NC}"
    find "$IMAGES_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r file; do
        optimize_image "$file"
    done
}

# 检查缺失的图片
check_missing() {
    echo -e "${BLUE}检查文章中引用的缺失图片...${NC}"
    local missing_count=0
    
    find posts -name "*.md" | while read -r md_file; do
        local article_name=$(basename "$md_file" .md)
        echo -e "${BLUE}检查文章: ${article_name}${NC}"
        
        # 提取图片引用
        grep -o '!\[.*\](.*\.[a-zA-Z]\{3,4\})' "$md_file" | while read -r img_ref; do
            local img_path=$(echo "$img_ref" | sed 's/.*](\(.*\))/\1/')
            local full_path="public${img_path}"
            
            if [ ! -f "$full_path" ]; then
                echo -e "  ${RED}缺失: ${img_path}${NC}"
                missing_count=$((missing_count + 1))
            fi
        done
    done
}

# 显示统计信息
show_stats() {
    echo -e "${BLUE}图片统计信息:${NC}"
    
    if [ -d "$IMAGES_DIR" ]; then
        local total_images=$(find "$IMAGES_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.svg" \) | wc -l)
        local total_size=$(find "$IMAGES_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.svg" \) -exec stat -f%z {} + 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo "0")
        
        echo -e "  总图片数: ${GREEN}${total_images}${NC}"
        echo -e "  总大小: ${GREEN}$(numfmt --to=iec-i --suffix=B ${total_size} 2>/dev/null || echo "${total_size} bytes")${NC}"
        
        echo ""
        echo -e "${BLUE}按格式分类:${NC}"
        for ext in jpg jpeg png gif webp svg; do
            local count=$(find "$IMAGES_DIR" -type f -iname "*.${ext}" | wc -l)
            if [ $count -gt 0 ]; then
                echo -e "  ${ext^^}: ${count}"
            fi
        done
    else
        echo -e "${YELLOW}未找到图片目录${NC}"
    fi
}

# 主程序
main() {
    case "${1:-help}" in
        create-dir)
            create_article_dir "$2"
            ;;
        list-dirs)
            list_dirs
            ;;
        optimize)
            optimize_image "$2"
            ;;
        optimize-all)
            optimize_all
            ;;
        check-missing)
            check_missing
            ;;
        stats)
            show_stats
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}未知命令: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@" 