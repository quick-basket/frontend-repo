/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "api.sandbox.midtrans.com"],
    unoptimized: true
  },
};

export default nextConfig;
