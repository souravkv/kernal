import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // old course slug -> new naming system
      { source: "/courses/dsa-masterclass", destination: "/courses/dsa-101", permanent: true },
      // old flat topic URLs -> new course page (topic slugs changed with the rewrite)
      { source: "/courses/dsa-masterclass/:topic", destination: "/courses/dsa-101", permanent: false },
    ];
  },
};

export default nextConfig;
