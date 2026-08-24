import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    // Inlined into server and client bundles at build time so date-derived
    // UI (e.g. "launched N days ago") hydrates without mismatches.
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10),
  },
};

export default nextConfig;
