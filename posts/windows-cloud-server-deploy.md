---
title: "将Windows作为云服务器部署教程"
date: "2026-02-18"
excerpt: "将Windows作为云服务器部署教程"
tags: ["微信公众号"]
draft: false
source: "https://mp.weixin.qq.com/s/oQ5SltsdJhV9j8GBQLAe-Q"
author: "AI e洞察"
---

## 这两天趁着过年的间隙，我将很久不用的Windows配置成了云服务器，并在上面部署了OpenClaw和OpenCode作为我的私人医学助理。

## 我今天拜完年后闲着没事，将这段痛苦的经历整理成一篇部署教程，这里面是我的一些踩坑经历，你不妨先收藏，以后要是有这样的需求也能够快速拿出来阅读，能避免许多我遇到的困境。

![Image](/images/posts/windows-cloud-server-deploy/image-01.jpg)

我算是一个资深的Windows用户了，从21年大一的Windows10开始用到24年的Windows11。几年用下来并没有发现Windows有什么“缺点”，除了满屏的广告、删了又出现的垃圾，以及各种开发环境永远处在报错外，其他体验都还不错。不过在遇到Mac后，我发现我之前用Windows做的很多事情其实是不合理的，比如开发。

我过去在Windows上折腾R语言的时候总是遇到奇奇怪怪的问题。早上打开电脑弄半天总是处在报错中，但下午打开电脑再测试时，莫名其妙就跑通了。那时候因为是自学，又没有人可请教，只能自己慢慢花时间调试，就这样一路磕磕绊绊走过来，我一直以为是我的问题。用了Mac后才发现，Linux系统才是操作开发的首选。所以，在拿到Windows系统的时候，第一件事是给它配置一个Linux。

## 如何配置

对于新手来说，使用WSL2（Windows subsystem for Linux）是不错的选择。你可以在wsl2里装一个Ubuntu，它拥有原生的Linux内核。你将代码写在Windows上，但运行、调试、终端全部发生在wsl2的Linux环境里，体验非常好。这是将Windows电脑作为云服务器的第一步——环境的搭建。

目前安装wsl非常简单，你只需要保证你的Windows版本符合要求，因为Windows11是原生支持的。

在Windows里以管理员身份运行PowerShell一键安装命令：

wsl  --install

这条命令会在Windows组件下载最新的Linux内核，并将Ubuntu设置为默认安装的发行版。安装完成重启电脑（必须操作），你就能看到Linux要求你设置信息的界面。没有使用过Linux系统的朋友需要注意，在输入密码时感觉电脑没什么反应，这是正常的。在提示设置密码时，屏幕上不会显示任何内容，输完后直接回车即可。

有了Linnux系统，你就可以在里面安装必要的开发工具，比如git，node.js，Python，Go......

在下载工具前，你需要确保你的Windows能链接到GitHub，所以你可以在github.com网站上配置你Windows的公钥，让GitHub认识你的电脑，不然你从GitHub上下载一些内容时可能会提示链接失败。

那么问题来了，如何配置公钥？

1.打开PowerShell输入ls ~/.ssh/id_ed25519.pub，如果显示文件不存在，可以使用ssh-keygen -t ed25519 -C "your_email@example.com"去生成新的密钥，按提示操作就行。（注意：以.pub后缀的是公钥，私钥绝不要暴露）

2.使用cat ~/.ssh/id_ed25519.pub查看生成的公钥内容，并复制到GitHub中设置就行。（GitHub → Settings → SSH and GPG keys → New SSH key）

3.填写完成后，可以使用ssh -T git@github.com在终端里测试一下。

## 链接Mac到Windows

为了让远程操作更加丝滑，我选择了使用ssh免密登录。

这步的配置也很简单，在Windows上以管理员权限(win+x)打开poweshell，运行：

```powershell
# 安装 OpenSSH 服务器
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# 启动服务并设置为自动启动
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'
```

在Mac端运行

ls ~/.ssh/id_ed25519.pub

查看公钥，如果没有，运行 ssh-keygen 一路回车生成。

将公钥内容复制到 Windows 的

C:\Users\你的用户名\.ssh\authorized_keys

文件中。（没有文件夹可以自行创建）

问题又来了，如何将一台电脑上的内容复制到另一台呢？

我当时遇到这个问题也不知道怎么解决，我使用了最笨的办法——微信。在两台电脑上登录同一微信账号，再将Mac上的公钥复制到微信上，在另一台上粘贴，但是发现消息竟然不会同步，后来通过手机作为中转——将手机微信收到的公钥重新转发到新登录的windows上。

不过这个方法太慢了。我后来使用Tailscale来链接Mac和Windows，当Mac和Windows登录同一tailscale账号时，他们会被分配一个固定IP，使用这个IP可以将Mac上的公钥复制到Windows上。

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub 你的Windows用户名@Windows的Tailscale IP
```

最后的操作就更简单了，在Mac上使用

```bash
nano ~/.ssh/config
```

打开配置文件，添加以下内容：

```sshconfig
Host win
    HostName 你的Windows的Tailscale IP
    User 你的Windows用户名
    IdentityFile ~/.ssh/id_ed25519
```

然后在Mac终端直接使用ssh win就可以链接。

## 生产力提升

1. 永不睡眠。作为云服务器，最忌讳“关机”。在 Windows 设置中，将“接通电源时”的屏幕关闭时间改为“从不”，睡眠时间改为“从不”。

2. 包管理器：让系统更整洁。Windows 推荐使用 Scoop，它安装软件非常干净，所有软件都装在同一目录下，卸载也彻底。macOS 毫无疑问是 Homebrew。

3. VS Code Remote Development。在 Mac 的 VS Code 里安装 Remote - SSH插件。你可以直接打开 Windows 上的代码文件夹进行编辑。这简直就是把 Windows 的算力借给了 Mac。

这篇文章基本聊完了如何配置Windows作为服务器，并通过ssh+Tailscale进行双机交互的方法。我知道它还很粗糙，因为我在做的过程中遇到的问题，比文章描述的多且复杂。不过只要你遇到问题就想办法解决，解决不了的咨询AI，要是还在有问题就搁置在一边，等你什么时候想起来再去弄，当前的问题会变得轻松许多。

我遇到这种情况很多次，我思考了一下背后的原因，发现很多情况下是因为条件不成熟。至于这个条件是什么，需要结合实际具体分析。我折腾过很多东西，遇到过各种问题，有些轻松解决了，有些不再想起，有些在当时试了各种方法都无果，但过后，等我头脑冷静下来我就知道是怎么回事了。这种很玄学，但放弃有时候何尝不是一种解决问题的方法呢？
