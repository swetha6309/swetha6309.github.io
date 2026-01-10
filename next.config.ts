import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  // If you are deploying to a subdirectory (e.g. username.github.io/repo-name),
  // you may need to set basePath: '/repo-name' below.
  // basePath: '/swetha-portfolio',
};

export default nextConfig;
