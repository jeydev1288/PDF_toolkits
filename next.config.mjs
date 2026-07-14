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
  outputFileTracingIncludes: {
    "/api/jobs/[tool]": [
      "./node_modules/pdf-to-img/**/*",
      "./node_modules/pdfjs-dist/**/*",
      "./node_modules/@napi-rs/canvas/**/*",
      "./node_modules/@napi-rs/canvas-linux-x64-gnu/**/*"
    ]
  }
};

export default nextConfig;
