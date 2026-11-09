import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel image optimization is over quota and returns 402, which
    // leaves every next/image blank. Serve the public files directly.
    unoptimized: true,
  },
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
