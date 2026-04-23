# DNS 配置指南 - zhanbing.site

最后检查时间：2026-04-23

## 当前结论

`zhanbing.site` 的 GitHub Pages 部署本身是可访问的：

- `https://zhanbing.site/` 返回 `HTTP 200`
- `http://zhanbing.site/` 会跳转到 `https://zhanbing.site/`
- `https://zhanbing.site/feed.xml` 返回 `HTTP 200`
- `https://zhanbing.site/sitemap.xml` 返回 `HTTP 200`

公共 DNS over HTTPS 查询显示根域名已经指向 GitHub Pages：

```text
zhanbing.site A 185.199.108.153
zhanbing.site A 185.199.109.153
zhanbing.site A 185.199.110.153
zhanbing.site A 185.199.111.153
```

当前还需要处理的是 `www.zhanbing.site`：它会跳转到根域名，但 HTTPS 证书可能不包含 `www.zhanbing.site`。这通常是因为 `www` 没有按 GitHub Pages 推荐方式直接 CNAME 到 GitHub Pages 默认域名。

## Hostinger DNS 应保持的记录

在 Hostinger 的 DNS Zone 中，根域名 `@` 保留下面 4 条 A 记录：

```text
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

`www` 子域名应改成下面这条 CNAME：

```text
类型: CNAME
名称: www
值: zhanbingli.github.io
TTL: 300 或 3600
```

不要把 `www` CNAME 指向 `zhanbing.site`。GitHub 官方文档明确建议 `www` 子域名直接指向 `<user>.github.io`，否则 HTTPS 可能出问题。

## GitHub Pages 设置

仓库：`Zhanbingli/zhanbing`

Pages 设置应为：

- Source: GitHub Actions
- Custom domain: `zhanbing.site`
- Enforce HTTPS: enabled

本仓库的 `public/CNAME` 也应只包含：

```text
zhanbing.site
```

## 验证命令

优先使用公共 DNS over HTTPS 验证，避免本地网络或运营商 DNS 缓存干扰：

```bash
curl -s 'https://dns.google/resolve?name=zhanbing.site&type=A'
curl -s 'https://cloudflare-dns.com/dns-query?name=zhanbing.site&type=A' -H 'accept: application/dns-json'
curl -s 'https://dns.google/resolve?name=www.zhanbing.site&type=CNAME'
```

访问状态检查：

```bash
curl -I https://zhanbing.site
curl -I http://zhanbing.site
curl -I https://zhanbing.site/feed.xml
curl -I https://zhanbing.site/sitemap.xml
curl -I https://www.zhanbing.site
```

预期结果：

- `https://zhanbing.site` 返回 `HTTP 200`
- `http://zhanbing.site` 返回 `301` 到 HTTPS
- `feed.xml` 和 `sitemap.xml` 返回 `HTTP 200`
- `https://www.zhanbing.site` 不应有证书错误，并应跳转到 `https://zhanbing.site/`

## 如果本地 dig 显示 198.18.1.1

如果 `dig zhanbing.site A` 显示 `198.18.1.1`，但 Google/Cloudflare DNS over HTTPS 显示 GitHub Pages 的 4 个 IP，通常是本地递归 DNS、代理、网络环境或缓存问题，不代表全球 DNS 配置错误。

可以尝试：

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

然后重新打开浏览器或切换网络测试。

## 参考

- GitHub Pages 自定义域名文档：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GitHub Pages 自定义域名说明：https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages
