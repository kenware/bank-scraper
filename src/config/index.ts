import dotenv from 'dotenv';

dotenv.config();
const { env } = process

export default {
    mongoConnectionString: env.NODE_ENV === 'test' ? env.MONGO_URL_TEST: env.MONGO_URL,
    apiKey: env.API_KEY,
    userOTP: env.USER_OTP || 12345
}
