import fs from 'fs';
import * as puppeteer from 'puppeteer'

import logger from '../utils/logger';
import config from '../config'

export default class Scraper {
    /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
  static async Auth(browser: any, email: string, password: string, otp: string): Promise<any> {
    try{
      const page = await browser.newPage();
      await page.setViewport({width: 1200, height: 720});
      await page.goto(config.bankUrl, { waitUntil: 'networkidle0' });
      await page.type('#email', email);
      await page.type('#password', password);
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      await page.click("button[type=submit]")
      await page.waitForNavigation({ waitUntil: 'networkidle0' })
      await page.type('#otp', otp);
      await page.click("button[type=submit]")
      await page.waitForNavigation({ waitUntil: 'networkidle0' })
      await page.waitForSelector('div .text-default')

      return page
    }catch(err: any) {
      logger.info(err)
    }
  }

  /**
  * @param {object} ctx
  * @param {req} ctx.request
  * @param {res} ctx.response
  */
  static async Customer(page: any): Promise<any> {
    try{
      logger.info('Scaping customer profile.......')
      const customer: any = {}
      const customerContent = await page.$$eval('div .text-default', elms => elms.map(elm => elm.textContent));
      customerContent.forEach((content: string) => {
        if (content) {
          const contentArray = content.split(':')
          customer[contentArray[0]?.toLowerCase()] = contentArray[1]
        }
      })
      const fullNameContent = await page.$eval('div .text-2xl.font-semibold.text-gray-800', el => el.textContent)
      const fullNameContentArray = fullNameContent.split(' ')
      customer.firstName = fullNameContentArray[fullNameContentArray.length - 2]
      customer.lastName = fullNameContentArray[fullNameContentArray.length - 1].slice(0, -1)
      return customer

    }catch(err: any) {
      logger.info(err)
    }
  }

  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
     static async AccountTransaction(page: any, account: any, data: any): Promise<Array<any>>{
      try{
        const transactions = []
        let transactionEl = await account.$('div a')
        let nextPage = true;
        const nextPageClass = 'div.inline-flex.mt-2 button.py-2.px-4.text-sm.font-medium.text-white.bg-gray-800'
        const paginationClass = '.flex.flex-col.items-center span.text-sm.text-gray-700 span.font-semibold'

        while(nextPage) {
          await transactionEl.click()
          await page.waitForSelector('table > tbody > tr')
          const transactionElements = await page.$$('table > tbody > tr')

          for (let i = 0; i < transactionElements.length; i++){
            const elements = await page.$$('table > tbody > tr')
            const elem = elements[i]

            const tableRows = await elem.$$('td')
            const transaction = {
              type: await page.evaluate(el => el?.textContent, await elem.$('th')),
              clearedDate: await page.evaluate(el => el?.textContent, tableRows[0]),
              description: await page.evaluate(el => el?.textContent, tableRows[1]),
              amount: await page.evaluate(el => el?.textContent, tableRows[2]),
              beneficiary: await page.evaluate(el => el?.textContent, tableRows[3]),
              sender: await page.evaluate(el => el?.textContent, tableRows[4]),
            }
            if (data.type && data.amount){
              transactions.push(transaction);
            }
          }
          const paginations = await page.$$(paginationClass);
          let currentNumber = await page.evaluate(el => el.textContent, paginations[1])
          let lastNumber = await page.evaluate(el => el.textContent, paginations[2])
          currentNumber = currentNumber.trim()
          lastNumber = lastNumber.trim()
          const transactionElArray = await page.$$(nextPageClass)
          transactionEl = transactionElArray[1]

          logger.info(`${currentNumber} of ${lastNumber} transactions completed for ${data.type}......`)
    
          if(currentNumber === lastNumber) {
            nextPage = false
          }
        }
        return transactions
      }catch(err: any) {
        console.log(err)
        logger.info(err)
      }
    }
  
  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
  static async scrapeBank(email:string, password:string, otp:string): Promise<any> {
    try{
        const browser = await puppeteer.launch({headless: false});
        let page = await Scraper.Auth(browser, email, password, otp)

        const customer = await Scraper.Customer(page)
        
        const accounts = []
        const accountsElements = await page.$$('section section');

        for (let i = 0; i < accountsElements.length; i++) {
          logger.info('Scaping account objects ......')
          let elements = await page.$$('section section');
          let account = elements[i]
          if (!account) {
            page = await Scraper.Auth(browser, email, password, otp)
            elements = await page.$$('section section');
            account = elements[i]
          }
          const balances = await account.$$('div p')
          const data: any = { 
            type: await page.evaluate(el => el.textContent, await account.$('div h3')),
            amount: await page.evaluate(el => el.textContent, balances[0]),
            ledgerAamount: await page.evaluate(el => el.textContent, balances[1]),
          }
          const transactions = await Scraper.AccountTransaction(page, account, data)
          data.transactions = transactions
          accounts.push(data) 
        }
        const callback = (data) => {
          logger.info('Data successfully scraped')
        }
        customer.account = accounts
        fs.writeFile(`scraped-data-${new Date()}.json`, JSON.stringify(customer), 'utf8', callback);
        const logoutElement = await page.$('nav div a.no-underline.font-bold')
        await logoutElement.click()
        browser.close()
        return customer
    }catch(err) {
      const errMessage = err.response?.data || err.message || "Error Occured";
      logger.info(errMessage);
      return {}
    }
  }
}

