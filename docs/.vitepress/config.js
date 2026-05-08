import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'url'
import { readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { withMermaid } from 'vitepress-plugin-mermaid'

const __dirname = dirname(fileURLToPath(import.meta.url))

function getPosts() {
  const postsDir = resolve(__dirname, '../')
  const files = readdirSync(postsDir).filter(f => f.endsWith('.md') && f !== 'index.md')
  return files.map(file => {
    const name = file.replace('.md', '')
    const url = `/${name}`
    return { text: name, link: url }
  })
}

export default withMermaid(defineConfig({
  title: 'DHX Blog',
  description: '翻译 AI / Agent 相关技术文章',
  base: '/doc/',
  cleanUrls: true,
  mermaid: {
    theme: 'default'
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' }
    ],
    sidebar: [
      {
        text: '文章',
        items: getPosts()
      }
    ]
  }
}))


