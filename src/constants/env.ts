import * as dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 8080,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY,
  KITAI_ADMIN_WALLET_ADDRESS: process.env.KITAI_ADMIN_WALLET_ADDRESS,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  KITAI_PAY_CONTRACT_ADDRESS: process.env.KITAI_PAY_CONTRACT_ADDRESS,
  LUMIVERSE_RPC_URL: process.env.LUMIVERSE_RPC_URL,
};
