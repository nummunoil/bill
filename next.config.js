/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: isProd ? "/nummunoil/" : "",
  images: {
    loader: "akamai",
    path: "",
  },
};

module.exports = nextConfig;
