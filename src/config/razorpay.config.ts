import dotenv from 'dotenv';

dotenv.config();

const { RAZORPAY_ID, RAZORPAY_SECRET } = <Record<string, string>>process.env;

export const razorpayConfig = {
  key_id: RAZORPAY_ID,
  key_secret: RAZORPAY_SECRET,
}
