/** @type {import('next').NextConfig} */

console.log("process.env.NODE_ENV : ", process.env.NODE_ENV);
const isProd = process.env.NODE_ENV === "production";
console.log("isProd : ", isProd);
const nextConfig = {
  reactStrictMode: true,
  basePath: isProd ? "/nummunoil" : "",
  assetPrefix: isProd ? "/nummunoil/" : "./",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
