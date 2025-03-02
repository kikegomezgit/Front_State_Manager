import 'dotenv/config';
/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        SECRET_API_TOKEN: process.env.SECRET_API_TOKEN,
        SECRET_WEBHOOK_TOKEN: process.env.SECRET_WEBHOOK_TOKEN,
        API_ORDERS_HOST: process.env.API_ORDERS_HOST,
    }
};

export default nextConfig;