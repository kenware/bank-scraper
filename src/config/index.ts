import dotenv from 'dotenv';

dotenv.config();
const { env } = process

export default {
    mongoConnectionString: env.NODE_ENV === 'test' ? env.MONGO_URL_TEST: env.MONGO_URL,
    userOTP: env.USER_OTP || '12345',
    bankUrl: env.BANK_BASE_URL || 'https://bankof.okra.ng/login'
}
