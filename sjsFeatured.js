const puppeteer = require("puppeteer");

async function scrapeSJSFeatured() {
    /*
    Gets featured the 5 featured products from SolarisJapan. Meant to be used hourly.
    */
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0);
    await page.goto('https://solarisjapan.com/', { waitUntil: 'networkidle0' })

    const allProducts = []
    const products = await page.evaluate(() => {
        const collection = document.getElementsByClassName('product-link')
        const lst = []
        for (let x = 0; x < 5; x++) {
            const tuple = []
            tuple.push(collection[x].href)
            tuple.push(collection[x].querySelector('.money').innerHTML)
            lst.push(tuple)
        }
        return lst

    })
    //console.log(products)

    for (let i = 0; i < products.length; i++) {
        await page.goto(products[i][0], { waitUntil: 'networkidle0' })
        const product = await page.evaluate(() => {
            //console.log('images')
            const temp = []
            temp.push(document.querySelector('#template-product > div.product-wrapper > div > div.grid__item.medium-up--one-half.product__information > div > div > div > div.small--hide.tw-flex.tw-justify-between.tw-mb-6 > div > h1').innerHTML)
            //get images
            const images = document.getElementsByClassName('fade-in lazyautosizes lazyloaded')
            var imageStr = images[0].srcset
            for (var i = 1; i < images.length; i++) {
                imageStr += ">>><<<" + images[i].srcset
            }
            temp.push(imageStr)
            temp.push('SolarisJapan')
            const preorder = document.querySelector('.money').innerHTML

            if (preorder != null) {
                temp.push(preorder)
            }
            else {
                temp.push("empty")
            }
            temp.push(document.querySelector('.product__release-date').querySelector('.product__btn-label').innerHTML)
            return temp
        })
        product.splice(3, 0, products[i][0])
        product.splice(4, 1, products[i][1])
        //console.log(product)
        allProducts.push(product)
    }

    await browser.close()
    return allProducts
}

module.exports = {
    scrapeSJSFeatured
}