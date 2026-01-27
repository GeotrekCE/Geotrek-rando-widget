import type { DefaultTheme } from 'vitepress'
import { defineUserConfig } from 'vitepress-export-pdf';

import userConfig from './.vitepress/config'

function extractLinksFromConfig(config: DefaultTheme.Config) {
    const links: string[] = []

    function extractLinks(sidebar: any) {
        for (const item of sidebar) {
            if (item.items && item.items.length > 0)
                extractLinks(item.items)

            else if (item.link)
                links.push(`${item.link}.html`)
        }
    }

    if (Array.isArray(config.sidebar)) {
        extractLinks(config.sidebar)
    }

    return links
}

const links = extractLinksFromConfig(userConfig.locales?.root?.themeConfig!)
const routeOrder = [
    '/index.html',
    ...links,
]

const headerTemplate = `<div style="margin-top: -0.4cm; height: 70%; width: 100%; display: flex; justify-content: center; align-items: center; color: lightgray; border-bottom: solid lightgray 1px; font-size: 10px;">
  <span class="title"></span>
</div>`

const footerTemplate = `<div style="margin-bottom: -0.4cm; height: 70%; width: 100%; display: flex; justify-content: flex-start; align-items: center; color: lightgray; border-top: solid lightgray 1px; font-size: 10px;">
  <span style="margin-left: 15px;" class="url"></span>
</div>`

export default defineUserConfig({
    routePatterns: ['!/en/**'],
    outFile: 'documentation.pdf',
    outDir: 'documentation',
    pdfOptions: {
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate,
        footerTemplate,
        margin: {
            bottom: 60,
            left: 25,
            right: 25,
            top: 60,
        },
    },
    sorter: (pageA, pageB) => {
        const aIndex = routeOrder.findIndex(route => route === pageA.path)
        const bIndex = routeOrder.findIndex(route => route === pageB.path)
        return aIndex - bIndex
    },
});
