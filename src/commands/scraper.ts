import logger from '../utils/logger';
import ScraperService from '../services/scraper';
import FormatterService from '../services/formatter';
import CollectionRepository from '../services/collectionRepository';
import '../utils/databaseInit';

const formatter = process.env.npm_config_formatter
const dbcommit = process.env.npm_config_dbcommit
const email = process.env.npm_config_email
const password = process.env.npm_config_password
const otp = process.env.npm_config_otp
const mapper = {
  'true': true
}

const processTask = async () => {
    try{
    logger.info(`Arguments are: ${JSON.stringify({email, password, otp, formatter, dbcommit})}`)
    if (email && password && otp){
      const scrapedData = await ScraperService.scrapeBank(email, password, otp)
      if (mapper[formatter]){
        logger.info('Data formatting initiated ........')
        const data = FormatterService.formatData(scrapedData)
        logger.info('Data successfully formatted ........')
        if (mapper[dbcommit]) {
            logger.info('Saving the formatted data in the db ........')
            await CollectionRepository.saveALL(data.formattedData, password)
            logger.info('Data successfully saved ........')
            process.exit()
        }
      }
    }else{
        if (!email) logger.info('Email is required')
        if (!password) logger.info('Password is required')
        if (!otp) logger.info('OTP is required')
        logger.info('Error, script exited')
        process.exit(1)
    }
    }catch(err:any) {
        logger.info(err || 'Error running command')
        process.exit(1)
    }
}
processTask();
