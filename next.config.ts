import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["firestories.s3.ap-south-1.amazonaws.com", "images.unsplash.com"],
  },
};

export default nextConfig;
