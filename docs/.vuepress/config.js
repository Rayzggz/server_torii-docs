import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { webpackBundler } from '@vuepress/bundler-webpack'

export default defineUserConfig({
  locales: {
    '/': {
      lang: 'en-US',
      title: '⛩️ Server Torii',
      description: 'High-performance distributed lightweight DDoS mitigation software',
    },

    '/zh/': {
      lang: 'zh-CN',
      title: '⛩️ Server Torii',
      description: '高性能、分布式、轻量的 DDoS 缓解清洗程序',
    },
  },

  theme: defaultTheme({
    logo: 'https://vuejs.press/images/hero.png',
    repo: "https://github.com/Rayzggz/server_torii",
    repoLabel: "Github",
    locales: {
      /**
       * English locale config
       */
      '/': {
        navbar: [
          { text: 'Home', link: '/' },
          { text: 'Getting started', link: '/get-started.html' },
        ],
        selectLanguageText: '选择语言 / Select Language',
        selectLanguageName: 'English',
      },

      /**
       * Chinese locale config
       */
      '/zh/': {
        navbar: [
          { text: '首页', link: '/zh/' },
          { text: '快速上手', link: '/zh/get-started.html' },
        ],
        selectLanguageText: 'Select Language / 选择语言',
        selectLanguageName: '简体中文',
        sidebar: {
          '/zh/guide/': [
            {
              text: '指南',
              children: [
                  '/zh/guide/home.md',
                '/zh/guide/install.md',
              ],
            },
          ],
        }
      },
    },
  }),

  bundler: webpackBundler(),
})