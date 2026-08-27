import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // (.*) matches ALL routes including root /
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            // Allows Google OAuth popup to communicate back to your app
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            // Allows Firebase SDK and Google Identity Toolkit to load
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};

export default nextConfig;