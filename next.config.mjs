/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "api.sandbox.midtrans.com"],
  },
};

export default nextConfig;
