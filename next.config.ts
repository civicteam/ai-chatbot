import { createCivicAuthPlugin } from "@civic/auth/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
    ],
  },
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: process.env.CIVIC_AUTH_CLIENT_ID!,
  include: ["/*"],
  exclude: ["/api/auth/*"],
});

export default withCivicAuth(nextConfig);
