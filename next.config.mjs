const isDesktopBuild = process.env.DESKTOP_BUILD === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: isDesktopBuild ? "export" : undefined,
  trailingSlash: isDesktopBuild,
  pageExtensions: isDesktopBuild
    ? ["tsx", "ts", "jsx", "js"]
    : ["web.ts", "web.tsx", "tsx", "ts", "jsx", "js"]
};

export default nextConfig;
