import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile higher up the filesystem makes Turbopack infer the
  // wrong workspace root; pin it so file watching and resolution stay
  // scoped to this project.
  turbopack: {
    root: path.join(__dirname),
  },
  // Keep local production builds out of the dev server's .next directory:
  // `next build` while `next dev` is running otherwise corrupts the
  // shared cache and the dev server starts returning 500s. Hosting
  // platforms (Vercel sets VERCEL=1) always build in a clean container
  // and expect the default ".next" output, so leave those alone.
  distDir:
    process.env.NODE_ENV === "production" && !process.env.VERCEL
      ? ".next-build"
      : ".next",
};

export default nextConfig;
