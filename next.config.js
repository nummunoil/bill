/** @type {import('next').NextConfig} */

console.log("process.env.NODE_ENV : ", process.env.NODE_ENV);
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: isProd ? "/bill/" : "",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
