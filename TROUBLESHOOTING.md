# GitHub Pages 部署故障排除指南

## 问题：Domain does not resolve to the GitHub Pages server

### 解决步骤

#### 1. 检查 GitHub Pages 设置

1. 访问你的 GitHub 仓库：https://github.com/Zhanbingli/zhanbing
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 确保以下设置正确：
   - **Source**: Deploy from a branch
   - **Branch**: gh-pages (如果使用 peaceiris/actions-gh-pages)
   - **Folder**: / (root)

#### 2. 配置自定义域名

在 Pages 设置中：
1. 在 **Custom domain** 字段中输入：`zhanbing.site`
2. 勾选 **Enforce HTTPS**（在 DNS 配置完成后）

#### 3. DNS 配置

你需要在你的域名注册商（如阿里云、腾讯云等）配置 DNS 记录：

**选项 A：使用 A 记录（推荐）**
```
类型: A
名称: @
值: 185.199.108.153
TTL: 3600

类型: A  
名称: @
值: 185.199.109.153
TTL: 3600

类型: A
名称: @
值: 185.199.110.153
TTL: 3600

类型: A
名称: @
值: 185.199.111.153
TTL: 3600
```

**选项 B：使用 CNAME 记录**
```
类型: CNAME
名称: www
值: zhanbingli.github.io
TTL: 3600
```

#### 4. 验证 DNS 配置

使用以下命令检查 DNS 是否正确配置：

```bash
# 检查 A 记录
dig zhanbing.site

# 检查 CNAME 记录  
dig www.zhanbing.site

# 或使用 nslookup
nslookup zhanbing.site
```

#### 5. 等待 DNS 传播

DNS 更改可能需要 24-48 小时才能完全传播。你可以使用以下工具检查传播状态：
- https://www.whatsmydns.net/
- https://dnschecker.org/

#### 6. 常见问题

**问题：Actions 构建失败**
- 确保 GitHub Actions 已启用
- 检查 `.github/workflows/deploy.yml` 文件是否正确
- 查看 Actions 日志获取详细错误信息

**问题：页面显示 404**
- 确保 `gh-pages` 分支存在且包含构建后的文件
- 检查 `out` 目录是否正确生成
- 确认 `index.html` 文件在根目录

**问题：CSS/JS 文件加载失败**
- 检查 `next.config.ts` 中的 `output: 'export'` 配置
- 确保没有使用服务器端功能（如 API routes）

#### 7. 临时访问方法

在 DNS 配置完成前，你可以通过以下地址访问你的博客：
- https://zhanbingli.github.io/zhanbing/

#### 8. 检查列表

- [ ] GitHub Actions 已启用并成功运行
- [ ] GitHub Pages 设置正确（Source: gh-pages branch）
- [ ] 自定义域名已在 GitHub Pages 中配置
- [ ] DNS A 记录或 CNAME 记录已正确设置
- [ ] DNS 传播已完成（可能需要 24-48 小时）
- [ ] HTTPS 已启用

## 联系支持

如果问题仍然存在，请：
1. 检查 GitHub Actions 日志
2. 验证域名注册商的 DNS 设置
3. 等待 DNS 传播完成
4. 联系域名注册商技术支持

## 有用的链接

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [配置自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS 记录类型说明](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) 