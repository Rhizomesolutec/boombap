import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/artists",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
