import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: '关于我',
  description: '了解展兵，以及这个博客持续写作的方向与初衷。',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <header className="text-center space-y-5">
          <div className="relative w-28 h-28 mx-auto rounded-full border border-slate-200 shadow-sm overflow-hidden">
            <Image
              src="/lizhanbing.png"
              alt="zhanbing avatar"
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">About</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">你好，我是展兵</h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              一个持续练习写作的前端工程师。这里既是我的公开笔记，也是我长期积累作品和思考的地方。
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">我在关注什么</h2>
            <p className="text-slate-600 leading-relaxed">
              我主要关注前端工程、内容系统、学习方法，以及如何用更小的复杂度做出更长期可维护的产品。
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3 bg-white">
                <p className="text-sm text-slate-500">最近在做</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  <li>• 记录 Next.js、React 和个人项目实践</li>
                  <li>• 总结学习路径、输入输出和行动方法</li>
                  <li>• 持续打磨这个博客的结构、速度和可读性</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 bg-white">
                <p className="text-sm text-slate-500">常用技术栈</p>
                <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                  {['TypeScript', 'React', 'Next.js', 'Tailwind', 'Vite', 'ESLint', 'Jest'].map((item) => (
                    <li key={item} className="rounded-full border border-slate-200 px-2.5 py-1 bg-slate-50 text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">这个博客写什么</h2>
            <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
              <p className="rounded-xl border border-slate-200 p-3 bg-white">
                不是资讯站，也不是纯教程站。这里更像一个长期更新的个人工作台，记录我正在验证的方法和经验。
              </p>
              <p className="rounded-xl border border-slate-200 p-3 bg-white">
                技术上保持克制：Markdown 写作、静态导出、轻依赖，重点始终放在内容本身和稳定体验上。
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">在哪里找到我</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/Zhanbingli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                GitHub
              </a>
              <a
                href="mailto:contact@zhanbing.site"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                邮箱
              </a>
              <Link
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                RSS 订阅
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
} 
