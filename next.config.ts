import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile higher up the filesystem makes Turbopack infer the
  // wrong workspace root; pin it so file watching and resolution stay
  // scoped to this project.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
