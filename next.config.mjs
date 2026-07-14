/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  serverExternalPackages: [
    "pdf-lib",
    "jszip",
    "pdf-to-img",
    "pdfjs-dist",
    "@napi-rs/canvas"
  ],
};

export default nextConfig;
