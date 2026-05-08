import { createContentLoader } from 'vitepress'

export const data = createContentLoader('/*.md', {
  excerpt: false,
  transform(raw) {
    return raw.map(({ url, src }) => {
      const match = src.match(/^#\s+(.+)/m)
      return {
        url,
        title: match ? match[1] : url.split('/').pop()
      }
    })
  }
})
