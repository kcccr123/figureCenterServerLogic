const puppeteer = require("puppeteer");

async function getSTOMlen() {
    /* 
    Gets max number of pages from TOM.
    */
    const browser = await puppeteer.launch({ args: ['--no-sandbox']})
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0);
    await page.goto('https://otakumode.com/search?mode=shop&limit=50&sort=rec&page=1&filter=buyable&category=figures-dolls', { waitUntil: 'networkidle0' })
    const len = await page.evaluate(() => {
        return parseInt(document.querySelector('#main > div > div.p-search-result__case.col.s12 > div.u-flex.u-flex-jc-space_between.u-flex-ai-center > ul > li:nth-child(13) > a').innerHTML)
    })
    return len
}

async function scrapeTOM() {
    /* 
    Standard scrape of TOM, gets max number of pages and then scrapes products. 
    */
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0);
    await page.goto('https://otakumode.com/search?mode=shop&limit=50&sort=rec&page=1&filter=buyable&category=figures-dolls', { waitUntil: 'networkidle0' })

    const len = await page.evaluate(() => {
        return parseInt(document.querySelector('#main > div > div.p-search-result__case.col.s12 > div.u-flex.u-flex-jc-space_between.u-flex-ai-center > ul > li:nth-child(13) > a').innerHTML)
    })
    const allProducts = []
    //default start 1
    //replace with len
    for (let z = 1; z <= len; z++) {
        console.log(z)
        await page.goto('https://otakumode.com/search?mode=shop&limit=50&sort=rec&page=' + z.toString() + '&filter=buyable&category=figures-dolls', { waitUntil: 'networkidle0' })
        const products = await page.evaluate(() => {
            const collection = document.getElementsByClassName('p-product-list__thumb')
            const lst = []
            for (let x = 0; x < collection.length; x++) {
                lst.push(collection[x].href)
            }
            return lst
        })

        for (let i = 0; i < products.length; i++) {
            await page.goto(products[i], { waitUntil: 'networkidle0' })
            const product = await page.evaluate(() => {
                const temp = []
                temp.push(document.querySelector('#shopMainArea > article > div > div.p-product-detail-main > div.p-product-detail__contents.u-flex > div.p-product-detail-main__note > div > h1 > span').innerHTML)
                temp.push(document.querySelector('.img-responsive.img-responsive--full.js-slick-image.js-magnifier-0').src)
                temp.push('TokyoOtakuMode')
                const preorder = document.querySelector('.c-label.c-label--info.c-label--round.c-label--lg')
                if (preorder != null && preorder.innerHTML != 'Special Order') {
                    temp.push(document.querySelector('#shopMainArea > article > div > div.p-product-detail-main > div.p-product-detail__contents.u-flex > div.p-product-detail-main__note > div > div:nth-child(4) > div.p-product-detail__sku > div > div:nth-child(1) > div > span.p-price__price > span.p-price__offscreen').innerHTML)
                    temp.push('')
                    temp.push(document.querySelector('#shopMainArea > article > div > div.p-product-detail-main > div.p-product-detail__contents.u-flex > div.p-product-detail-main__note > div > div:nth-child(4) > div:nth-child(2) > div > p > span.p-product-detail__release-month > a').innerHTML)
                }
                else {
                    temp.push(document.querySelector('#shopMainArea > article > div > div.p-product-detail-main > div.p-product-detail__contents.u-flex > div.p-product-detail-main__note > div > div:nth-child(4) > div.p-product-detail__sku > div > div:nth-child(1) > div > span.p-price__price > span.p-price__offscreen').innerHTML)
                    temp.push('')
                    temp.push('')
                }
                return temp
            })
            product.splice(3, 0, products[i])
            console.log(product)
            allProducts.push(product)
        }
    }
    await browser.close()
    return allProducts
}

async function scrapeTOMVari(pageNum) {
    /* 
    Scrape number of pages based on input "pageNum".
    */
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', "--single-process"]})
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0);

    const allProducts = []
        await page.goto('https://otakumode.com/search?mode=shop&limit=50&sort=rec&page=' + pageNum + '&filter=buyable&category=figures-dolls', { waitUntil: 'networkidle0' })
        const products = await page.evaluate(() => {
            const collection = document.getElementsByClassName('p-product-list__thumb')
            const lst = []
            for (let x = 0; x < collection.length; x++) {
                lst.push(collection[x].href)
            }
            return lst
        })

        for (let i = 0; i < products.length; i++) {
            await page.goto(products[i], { waitUntil: 'networkidle0' })
            const product = await page.evaluate(() => {
                const temp = []
                temp.push(document.querySelector('#shopMainArea > article > div > div.p-product-detail-main > div.p-product-detail__contents.u-flex > div.p-product-detail-main__note > div > h1 > span').innerHTML)
                temp.push(document.querySelector('.img-responsive.img-responsive--full.js-slick-image.js-magnifier-0').src)
                temp.push('TokyoOtakuMode')
                const preorder = document.querySelector('.c-label.c-label--info.c-label--round.c-label--lg')
                if (preorder != null && preorder.innerHTML != 'Special Order') {
                    temp.push(document.querySelector('#shopMainArea > article > div > div.p-product-detail-main > div.p-product-detail__contents.u-flex > div.p-product-detail-main__note > div > div:nth-child(4) > div.p-product-detail__sku > div > div:nth-child(1) > div > span.p-price__price > span.p-price__offscreen').innerHTML)
                    temp.push('')
                    temp.push(document.querySelector('#shopMainArea > article > div > div.p-product-detail-main > div.p-product-detail__contents.u-flex > div.p-product-detail-main__note > div > div:nth-child(4) > div:nth-child(2) > div > p > span.p-product-detail__release-month > a').innerHTML)
                }
                else {
                    temp.push(document.querySelector('#shopMainArea > article > div > div.p-product-detail-main > div.p-product-detail__contents.u-flex > div.p-product-detail-main__note > div > div:nth-child(4) > div.p-product-detail__sku > div > div:nth-child(1) > div > span.p-price__price > span.p-price__offscreen').innerHTML)
                    temp.push('')
                    temp.push('')
                }
                return temp
            })
            product.splice(3, 0, products[i])
            //console.log(product)
            allProducts.push(product)
        }
    
    await browser.close()
    return allProducts
}

module.exports = {
    scrapeTOM, getSTOMlen, scrapeTOMVari
}