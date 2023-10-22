const puppeteer = require("puppeteer");


async function getSJSLength() {
    /* 
    Get max number of pages for SolarisJapan.
    */
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: false })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0);
    await page.goto('https://solarisjapan.com/collections/figures', { waitUntil: 'networkidle0' })
    const len = await page.evaluate(() => {
        return parseInt(document.querySelector('#CollectionLoopPagination > ul > li:nth-child(9) > a').innerHTML)
    })
    console.log(len)
    return len
}

async function scrapeJS() {
    /* 
    Standard scrape of SolarisJapan, gets max number of pages and then scrapes products. 
    */
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://solarisjapan.com/collections/figures', { waitUntil: 'networkidle0' })

    const len = await page.evaluate(() => {
        console.log(document.querySelector('#product-40338773966891 > div > div.product-information.aos-init.aos-animate > div > div.product-label.product-label--pre-order.tw-relative > span.product-label__title'))
        return parseInt(document.querySelector('#product-40338773966891 > div > div.product-information.aos-init.aos-animate > div > div.product-label.product-label--pre-order.tw-relative > span.product-label__title').innerHTML)
    })
    const finalResult = []
    //replace with len
    for (let z = 1; z <= len; z++) {
        console.log(z)
        await page.goto('https://solarisjapan.com/collections/figures?page=' + z.toString(), { waitUntil: 'networkidle0' })
        const products = await page.evaluate(() => {
            const lst = []
            const collection = document.getElementsByClassName('product__item hover:tw-shadow-lg')
            for (var i = 0; i < collection.length; i++) {
                const temp = []
                try {

                    temp.push(collection[i].querySelector('.title').innerHTML)
                    temp.push(collection[i].querySelector('.product-item__bg.tw-object-contain').src)
                    temp.push('SolarisJapan')
                    temp.push(collection[i].querySelector('.product-link').href)
                }
                catch (err) {
                    console.log(err)
                    continue
                }
                const brandNew = collection[i].querySelector('.product-label.product-label--brand-new.tw-relative')
                const preOrder = collection[i].querySelector('.product-label.product-label--pre-order.tw-relative')
                const preOwned = collection[i].querySelector('.product-label.product-label--pre-owned.tw-relative')
                const release = collection[i].querySelector('.product-label.product-label--release')
                if (brandNew != null) {
                    temp.push((brandNew.querySelector('.money').innerHTML).slice(1))
                }
                else if (preOrder != null) {
                    temp.push((preOrder.querySelector('.money').innerHTML).slice(1))
                }
                else {
                    temp.push("")
                }
                if (preOwned != null) {
                    temp.push((preOwned.querySelector('.money').innerHTML).slice(1))
                    temp.push("")
                }
                else if (release != null) {
                    temp.push("")
                    temp.push(release.querySelector('.product-label__detail').innerHTML)
                }
                else {
                    temp.push("")
                    temp.push("")
                }
                lst.push(temp)

            } return lst
        }
        )
        for (var x = 0; x < products.length; x++) {
            finalResult.push(products[x])
        }
        console.log(finalResult)
    }
    await browser.close()
    return finalResult

}

async function scrapeJSVari(pageNum) {
    /* 
    Scrape SolarisJapan based on inputted number of pages.
    */
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', "--single-process"]})
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0);

    const finalResult = []
        await page.goto('https://solarisjapan.com/collections/figures?page=' + pageNum, { waitUntil: 'networkidle0' })
        const products = await page.evaluate(() => {
            const lst = []
            const collection = document.getElementsByClassName('product__item hover:tw-shadow-lg')
            for (var i = 0; i < collection.length; i++) {
                const temp = []
                try {

                    temp.push(collection[i].querySelector('.title').innerHTML)
                    temp.push(collection[i].querySelector('.product-item__bg.tw-object-contain').src)
                    temp.push('SolarisJapan')
                    temp.push(collection[i].querySelector('.product-link').href)
                }
                catch (err) {
                    console.log(err)
                    continue
                }
                const brandNew = collection[i].querySelector('.product-label.product-label--brand-new.tw-relative')
                const preOrder = collection[i].querySelector('.product-label.product-label--pre-order.tw-relative')
                const preOwned = collection[i].querySelector('.product-label.product-label--pre-owned.tw-relative')
                const release = collection[i].querySelector('.product-label.product-label--release')
                if (brandNew != null) {
                    temp.push((brandNew.querySelector('.money').innerHTML).slice(1))
                }
                else if (preOrder != null) {
                    temp.push((preOrder.querySelector('.money').innerHTML).slice(1))
                }
                else {
                    temp.push("")
                }
                if (preOwned != null) {
                    temp.push((preOwned.querySelector('.money').innerHTML).slice(1))
                    temp.push("")
                }
                else if (release != null) {
                    temp.push("")
                    temp.push(release.querySelector('.product-label__detail').innerHTML)
                }
                else {
                    temp.push("")
                    temp.push("")
                }
                lst.push(temp)

            } return lst
        }
        )
        for (var x = 0; x < products.length; x++) {
            finalResult.push(products[x])
        }
        //console.log(finalResult)
    
    await browser.close()
    return finalResult

}


module.exports = {
    scrapeJS, getSJSLength, scrapeJSVari
}
