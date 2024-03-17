/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output:"standalone"
}

const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);
