import logger from '../utils/logger';
import ScraperService from '../services/scraper';

const formatter = process.env.npm_config_formatter
const dbcommit = process.env.npm_config_dbcommit
const email = process.env.npm_config_email
const password = process.env.npm_config_password
const otp = process.env.npm_config_otp
const mapper = {
  'true': true
}

const processTask = async () => {
    logger.info(`Arguments are: ${JSON.stringify({email, password, otp, formatter, dbcommit})}`)
    if (email && password && otp){
      const scrapedData = await ScraperService.scrapeBank(email, password, otp)
    }else{
        if (!email) logger.info('Email is required')
        if (!password) logger.info('Password is required')
        if (!otp) logger.info('OTP is required')
        logger.info('Error, script exited')
    }
}
processTask();
