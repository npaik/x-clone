/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  experimental: {
    serverActions: true,
  },

  images: {
    domains: [
      "images.clerk.dev",
      "picsum.photos",
      "example.com",
      "fastly.picsum.photos",
      "www.youtube.com",
    ],
  },
};
