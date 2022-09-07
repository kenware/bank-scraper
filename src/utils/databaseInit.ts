import mongoose from 'mongoose';
import config from '../config'
import logger from './logger'

try {
    mongoose.connect(config.mongoConnectionString, { 
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    logger.info('Database connected')
}catch(error) {
 logger.info(error)
}
