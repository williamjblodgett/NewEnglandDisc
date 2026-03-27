import type { NextConfig } from "next";
// @ts-ignore – next-pwa types are loose
const repoName = "NewEnglandDisc";
const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development" || isGithubPages,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: { cacheName: "offlineCache", expiration: { maxEntries: 200 } },
    },
  ],
});

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default withPWA(nextConfig);
