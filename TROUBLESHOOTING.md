# GitHub Pages 部署故障排除指南

最后检查时间：2026-04-23

## 当前已确认的状态

- `https://zhanbing.site/` 可访问，返回 `HTTP 200`
- `http://zhanbing.site/` 会跳转到 HTTPS
- `https://zhanbing.site/feed.xml` 可访问
- `https://zhanbing.site/sitemap.xml` 可访问
- GitHub Pages 构建本地验证通过：`npm run build`

当前主要风险点是 `www.zhanbing.site` 的 HTTPS 证书。如果访问 `https://www.zhanbing.site` 出现证书不匹配，按下面步骤处理。

## 问题：www 子域名 HTTPS 证书不匹配

症状：

```text
SSL: no alternative certificate subject name matches target host name 'www.zhanbing.site'
```

处理方式：

1. 登录 Hostinger。
2. 打开 `zhanbing.site` 的 DNS Zone。
3. 删除或修改当前 `www` 记录。
4. 添加这条记录：

```text
类型: CNAME
名称: www
值: zhanbingli.github.io
TTL: 300 或 3600
```

不要把 `www` 指向 `zhanbing.site`。GitHub Pages 推荐 `www` 子域名直接 CNAME 到 `<user>.github.io`，本项目对应 `zhanbingli.github.io`。

修改后等待 GitHub Pages 重新签发/更新证书，通常需要几分钟到 1 小时，最多可能 24 小时。

## 问题：Domain does not resolve to the GitHub Pages server

根域名 `zhanbing.site` 应有 4 条 A 记录：

```text
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
```

如果 Hostinger 中还有 parking、转发或其他 A 记录，删除它们，避免和 GitHub Pages 冲突。

## GitHub Pages 设置检查

访问：

```text
https://github.com/Zhanbingli/zhanbing/settings/pages
```

应确认：

- Source: GitHub Actions
- Custom domain: `zhanbing.site`
- Enforce HTTPS: enabled

本仓库使用 GitHub Actions 发布到 Pages。`public/CNAME` 里保留 `zhanbing.site`，构建后会进入静态产物。

## 验证命令

DNS 验证：

```bash
curl -s 'https://dns.google/resolve?name=zhanbing.site&type=A'
curl -s 'https://dns.google/resolve?name=www.zhanbing.site&type=CNAME'
```

访问验证：

```bash
curl -I https://zhanbing.site
curl -I http://zhanbing.site
curl -I https://www.zhanbing.site
curl -I https://zhanbing.site/feed.xml
curl -I https://zhanbing.site/sitemap.xml
```

本地构建验证：

```bash
npm run build
```

## 如果本地 DNS 和公共 DNS 结果不一致

如果本地 `dig` 看到 `198.18.1.1`，但 Google/Cloudflare DNS over HTTPS 返回 GitHub Pages 的 4 个 IP，优先相信公共 DNS over HTTPS 结果。这通常是本地 DNS、代理或网络缓存问题。

macOS 可清理本地 DNS 缓存：

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

## 参考

- GitHub Pages 自定义域名文档：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GitHub Pages 故障排除文档：https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
