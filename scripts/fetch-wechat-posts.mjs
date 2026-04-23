import fs from 'node:fs/promises'

const APP_ID = process.env.WECHAT_APP_ID
const APP_SECRET = process.env.WECHAT_APP_SECRET
const OUTPUT_FILE = process.env.WECHAT_OUTPUT_FILE || 'wechat-articles.json'
const SOURCE = process.env.WECHAT_SOURCE || 'auto'

if (!APP_ID || !APP_SECRET) {
  console.error('请先设置 WECHAT_APP_ID 和 WECHAT_APP_SECRET')
  process.exit(1)
}

function buildTokenUrl() {
  const url = new URL('https://api.weixin.qq.com/cgi-bin/token')
  url.searchParams.set('grant_type', 'client_credential')
  url.searchParams.set('appid', APP_ID)
  url.searchParams.set('secret', APP_SECRET)
  return url
}

function buildPublishedUrl(accessToken) {
  const url = new URL('https://api.weixin.qq.com/cgi-bin/freepublish/batchget')
  url.searchParams.set('access_token', accessToken)
  return url
}

function buildMaterialUrl(accessToken) {
  const url = new URL('https://api.weixin.qq.com/cgi-bin/material/batchget_material')
  url.searchParams.set('access_token', accessToken)
  return url
}

function buildDraftUrl(accessToken) {
  const url = new URL('https://api.weixin.qq.com/cgi-bin/draft/batchget')
  url.searchParams.set('access_token', accessToken)
  return url
}

class WechatApiError extends Error {
  constructor(errcode, errmsg) {
    super(`微信接口错误：${errcode} ${errmsg}`)
    this.errcode = errcode
    this.errmsg = errmsg
  }
}

async function requestJson(url, options = {}) {
  const res = await fetch(url, options)
  const text = await res.text()

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`微信接口返回了非 JSON 内容：HTTP ${res.status}\n${text}`)
  }

  if (!res.ok) {
    throw new Error(`微信接口 HTTP 错误：${res.status} ${res.statusText}\n${text}`)
  }

  if (data.errcode && data.errcode !== 0) {
    throw new WechatApiError(data.errcode, data.errmsg)
  }

  return data
}

async function getAccessToken() {
  const data = await requestJson(buildTokenUrl())

  if (!data.access_token) {
    throw new Error(`微信接口没有返回 access_token：${JSON.stringify(data)}`)
  }

  return data.access_token
}

async function getPublishedArticles(accessToken) {
  const allArticles = []
  let offset = 0
  const count = 20

  while (true) {
    const data = await requestJson(buildPublishedUrl(accessToken), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offset,
        count,
        no_content: 0,
      }),
    })

    const items = data.item || []
    console.log(
      `已发布接口：offset=${offset} total_count=${data.total_count ?? 'unknown'} item_count=${data.item_count ?? items.length}`
    )

    for (const item of items) {
      const articles = item.content?.news_item || []

      for (const article of articles) {
        allArticles.push({
          title: article.title,
          author: article.author,
          digest: article.digest,
          content: article.content,
          content_source_url: article.content_source_url,
          url: article.url,
          thumb_url: article.thumb_url,
          create_time: item.content?.create_time,
          update_time: item.content?.update_time,
          publish_id: item.publish_id,
        })
      }
    }

    console.log(`已获取 ${allArticles.length} 篇文章`)

    if (items.length < count) {
      break
    }

    offset += count
  }

  return allArticles
}

async function getMaterialArticles(accessToken) {
  const allArticles = []
  let offset = 0
  const count = 20

  while (true) {
    const data = await requestJson(buildMaterialUrl(accessToken), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'news',
        offset,
        count,
      }),
    })

    const items = data.item || []
    console.log(
      `素材库接口：offset=${offset} total_count=${data.total_count ?? 'unknown'} item_count=${data.item_count ?? items.length}`
    )

    for (const item of items) {
      const articles = item.content?.news_item || []

      for (const article of articles) {
        allArticles.push({
          title: article.title,
          author: article.author,
          digest: article.digest,
          content: article.content,
          content_source_url: article.content_source_url,
          url: article.url,
          thumb_url: article.thumb_url,
          thumb_media_id: article.thumb_media_id,
          create_time: item.content?.create_time,
          update_time: item.update_time || item.content?.update_time,
          media_id: item.media_id,
        })
      }
    }

    console.log(`已从素材库获取 ${allArticles.length} 篇文章`)

    if (items.length < count || offset + items.length >= data.total_count) {
      break
    }

    offset += count
  }

  return allArticles
}

async function getDraftArticles(accessToken) {
  const allArticles = []
  let offset = 0
  const count = 20

  while (true) {
    const data = await requestJson(buildDraftUrl(accessToken), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offset,
        count,
        no_content: 0,
      }),
    })

    const items = data.item || []
    console.log(
      `草稿箱接口：offset=${offset} total_count=${data.total_count ?? 'unknown'} item_count=${data.item_count ?? items.length}`
    )

    for (const item of items) {
      const articles = item.content?.news_item || []

      for (const article of articles) {
        allArticles.push({
          title: article.title,
          author: article.author,
          digest: article.digest,
          content: article.content,
          content_source_url: article.content_source_url,
          url: article.url,
          thumb_url: article.thumb_url,
          thumb_media_id: article.thumb_media_id,
          create_time: item.content?.create_time,
          update_time: item.update_time || item.content?.update_time,
          media_id: item.media_id,
        })
      }
    }

    console.log(`已从草稿箱获取 ${allArticles.length} 篇文章`)

    if (items.length < count || offset + items.length >= data.total_count) {
      break
    }

    offset += count
  }

  return allArticles
}

async function main() {
  const accessToken = await getAccessToken()
  let articles

  if (SOURCE === 'published') {
    articles = await getPublishedArticles(accessToken)
  } else if (SOURCE === 'material') {
    articles = await getMaterialArticles(accessToken)
  } else if (SOURCE === 'draft') {
    articles = await getDraftArticles(accessToken)
  } else {
    try {
      articles = await getPublishedArticles(accessToken)
    } catch (error) {
      if (error instanceof WechatApiError && error.errcode === 48001) {
        console.warn('已发布文章接口无权限，改用素材库图文接口继续尝试。')
        articles = await getMaterialArticles(accessToken)
        if (articles.length === 0) {
          console.warn('素材库没有返回图文，继续尝试草稿箱接口。')
          articles = await getDraftArticles(accessToken)
        }
      } else {
        throw error
      }
    }
  }

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(articles, null, 2), 'utf8')

  console.log(`完成，共获取 ${articles.length} 篇文章`)
  console.log(`结果已保存到 ${OUTPUT_FILE}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
