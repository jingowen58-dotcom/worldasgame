import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["argon2", "@electric-sql/pglite", "pg"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
