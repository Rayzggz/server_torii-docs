import {defaultTheme} from '@vuepress/theme-default'
import {defineUserConfig} from 'vuepress'
import {webpackBundler} from '@vuepress/bundler-webpack'

export default defineUserConfig({
    base: '/server_torii-docs/',
    locales: {
        '/': {
            lang: 'en-US',
            title: 'Server Torii',
            description: 'High-performance distributed lightweight DDoS mitigation software',
        },

        '/zh/': {
            lang: 'zh-CN',
            title: 'Server Torii',
            description: '高性能、分布式、轻量的 DDoS 缓解清洗程序',
        },
    },

    theme: defaultTheme({
        logo: '/images/shinto_shrine.png',
        repo: "https://github.com/Rayzggz/server_torii",
        repoLabel: "Github",
        locales: {
            /**
             * English locale config
             */
            '/': {
                navbar: [
                    {text: 'Home', link: '/'},
                    {text: 'Getting started', link: '/guide/home.html'},
                ],
                selectLanguageText: '选择语言 / Select Language',
                selectLanguageName: 'English',
                sidebar: {
                    '/': [
                        {
                            text: 'Guide',
                            children: [
                                '/guide/home.md',
                                '/guide/install.md',
                                '/guide/configuration.md',
                                '/guide/faq.md',
                                '/guide/upgrade.md'
                            ],
                        },
                        {
                            text: 'Advanced',
                            children: [
                                '/advanced/external_migration.md',
                            ],
                        },
                        {
                            text: 'Development',
                            children: [
                                '/development/roadmap.md',
                            ],
                        },
                    ],
                }
            },

            /**
             * Chinese locale config
             */
            '/zh/': {
                navbar: [
                    {text: '首页', link: '/zh/'},
                    {text: '快速上手', link: '/zh/guide/home.html'},
                ],
                selectLanguageText: 'Select Language / 选择语言',
                selectLanguageName: '简体中文',
                sidebar: {
                    '/zh/': [
                        {
                            text: '指南',
                            children: [
                                '/zh/guide/home.md',
                                '/zh/guide/install.md',
                                '/zh/guide/configuration.md',
                                '/zh/guide/faq.md',
                                '/zh/guide/upgrade.md'
                            ],
                        },
                        {
                            text: '进阶配置',
                            children: [
                                '/zh/advanced/external_migration.md',
                            ],
                        },
                        {
                            text: '开发',
                            children: [
                                '/zh/development/roadmap.md',
                            ],
                        },
                    ],
                }
            },
        },
    }),

    bundler: webpackBundler(),
})