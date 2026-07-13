import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile higher up the filesystem makes Turbopack infer the
  // wrong workspace root; pin it so file watching and resolution stay
  // scoped to this project.
  turbopack: {
    root: path.join(__dirname),
  },
  // Keep production builds out of the dev server's .next directory:
  // `next build` while `next dev` is running otherwise corrupts the
  // shared cache and the dev server starts returning 500s.
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",
};

export default nextConfig;
